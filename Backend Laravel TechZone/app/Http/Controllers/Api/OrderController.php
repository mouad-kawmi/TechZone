<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Coupon;
use App\Models\Notification;
use App\Models\Order;
use App\Models\Product;
use App\Models\StoreSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $query = Order::with('items')->latest();

        if ($request->route('userId')) {
            $query->where('user_id', $request->route('userId'));
        }

        return $query->get()->map(fn (Order $order) => $order->toFrontendArray());
    }

    public function checkout(Request $request, ?int $userId = null)
    {
        $data = $request->validate([
            'items' => ['required', 'array', 'min:1'],
            'items.*.productId' => ['required', 'integer', 'exists:products,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
            'items.*.variant' => ['nullable', 'string'],
            'couponCode' => ['nullable', 'string'],
            'paymentMethod' => ['nullable', 'string', 'in:COD,CARD,PAYPAL,cod,card,paypal'],
            'shippingName' => ['required', 'string', 'max:255'],
            'shippingPhone' => ['required', 'string', 'max:40'],
            'shippingEmail' => ['nullable', 'email'],
            'shippingStreet' => ['nullable', 'string'],
            'shippingCity' => ['nullable', 'string'],
            'shippingPostal' => ['nullable', 'string'],
            'notes' => ['nullable', 'string'],
        ]);

        $data['paymentMethod'] = strtoupper($data['paymentMethod'] ?? 'COD');
        $data['shippingPhone'] = preg_replace('/[\s-]+/', '', $data['shippingPhone']);

        if (! preg_match('/^(?:\+212|0)[5-7]\d{8}$/', $data['shippingPhone'])) {
            throw ValidationException::withMessages([
                'shippingPhone' => ['Numero de telephone marocain invalide.'],
            ]);
        }

        $order = DB::transaction(function () use ($data, $userId) {
            $settings = StoreSetting::first() ?: StoreSetting::create([]);
            $subtotal = 0;
            $preparedItems = [];

            foreach ($data['items'] as $row) {
                $product = Product::with(['images', 'variants'])->lockForUpdate()->findOrFail($row['productId']);
                $quantity = (int) $row['quantity'];
                $variantValue = $row['variant'] ?? null;
                $variant = $variantValue ? $product->variants->firstWhere('value', $variantValue) : null;
                $stock = $variant ? $variant->stock : $product->stock;

                if ($stock < $quantity) {
                    abort(response()->json(['message' => "Stock insuffisant: {$product->title}"], 422));
                }

                $lineTotal = (float) $product->price * $quantity;
                $subtotal += $lineTotal;

                $preparedItems[] = [
                    'product' => $product,
                    'variant' => $variant,
                    'variantValue' => $variantValue,
                    'quantity' => $quantity,
                ];
            }

            $coupon = null;
            $discount = 0;
            if (! empty($data['couponCode'])) {
                $coupon = Coupon::where('code', strtoupper($data['couponCode']))->first();
                if ($coupon && $coupon->active && (float) $subtotal >= (float) $coupon->minimum_order) {
                    $discount = $coupon->type === 'PERCENT'
                        ? round($subtotal * ((float) $coupon->value / 100), 2)
                        : min($subtotal, (float) $coupon->value);
                }
            }

            $shipping = $subtotal >= (float) $settings->free_delivery_threshold ? 0 : (float) $settings->delivery_fee;
            $finalTotal = max(0, $subtotal + $shipping - $discount);

            $order = Order::create([
                'order_number' => (string) Str::uuid(),
                'user_id' => $userId,
                'shipping_name' => $data['shippingName'],
                'shipping_phone' => $data['shippingPhone'] ?? null,
                'shipping_email' => $data['shippingEmail'] ?? null,
                'shipping_street' => $data['shippingStreet'] ?? null,
                'shipping_city' => $data['shippingCity'] ?? 'Casablanca',
                'shipping_postal' => $data['shippingPostal'] ?? null,
                'notes' => $data['notes'] ?? null,
                'status' => 'EN_ATTENTE',
                'payment_method' => $data['paymentMethod'],
                'payment_status' => 'PENDING',
                'subtotal' => $subtotal,
                'shipping_cost' => $shipping,
                'discount' => $discount,
                'final_total' => $finalTotal,
                'coupon_code' => $coupon?->code,
                'transaction_reference' => 'TXN-'.Str::upper(Str::random(8)),
            ]);

            foreach ($preparedItems as $row) {
                $product = $row['product'];
                $image = $product->primaryImage()?->image_url;

                $order->items()->create([
                    'product_id' => $product->id,
                    'product_title' => $product->title,
                    'product_image' => $image,
                    'unit_price' => $product->price,
                    'quantity' => $row['quantity'],
                    'variant' => $row['variantValue'],
                ]);

                if ($row['variant']) {
                    $row['variant']->decrement('stock', $row['quantity']);
                }

                $product->decrement('stock', $row['quantity']);
            }

            $coupon?->increment('used_count');
            if ($userId !== null) {
                Cart::where('user_id', $userId)->first()?->items()->delete();
            }

            Notification::create([
                'type' => 'order',
                'title' => 'Nouvelle commande',
                'message' => "Commande {$order->order_number} de {$order->shipping_name} - {$order->final_total} DH",
                'link' => '/admin/orders',
            ]);

            return $order->fresh('items');
        });

        return $order->toFrontendArray();
    }

    public function track(string $orderNumber)
    {
        return Order::with('items')
            ->where('order_number', $orderNumber)
            ->firstOrFail()
            ->toFrontendArray();
    }

    public function update(Request $request, Order $order)
    {
        $data = $request->validate([
            'status' => ['nullable', 'string', 'in:EN_ATTENTE,EN_COURS,EXPEDIE,LIVRE,ANNULE'],
            'paymentStatus' => ['nullable', 'string', 'in:PENDING,PAID,FAILED,REFUNDED'],
            'paymentMethod' => ['nullable', 'string'],
            'shippedAt' => ['nullable', 'date'],
            'deliveredAt' => ['nullable', 'date'],
        ]);

        $status = $data['status'] ?? $order->status;
        $paymentStatus = $data['paymentStatus'] ?? $order->payment_status;
        $paymentMethod = $data['paymentMethod'] ?? $order->payment_method;

        if ($status === 'LIVRE') {
            $paymentStatus = 'PAID';
        }

        $order->update([
            'status' => $status,
            'payment_status' => $paymentStatus,
            'payment_method' => $paymentMethod,
            'shipped_at' => ($status === 'EXPEDIE' || $status === 'LIVRE') ? ($order->shipped_at ?: now()) : $order->shipped_at,
            'delivered_at' => $status === 'LIVRE' ? ($order->delivered_at ?: now()) : $order->delivered_at,
        ]);

        return $order->fresh('items')->toFrontendArray();
    }
}
