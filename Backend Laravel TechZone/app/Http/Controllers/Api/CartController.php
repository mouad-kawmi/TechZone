<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function show(int $userId)
    {
        return $this->cartForUser($userId)->toFrontendArray();
    }

    public function addItem(Request $request, int $userId)
    {
        $data = $request->validate([
            'productId' => ['required', 'integer', 'exists:products,id'],
            'quantity' => ['nullable', 'integer', 'min:1'],
            'variant' => ['nullable', 'string', 'max:100'],
        ]);

        $cart = $this->cartForUser($userId);
        $product = Product::with(['images', 'variants'])->findOrFail($data['productId']);
        $quantity = $data['quantity'] ?? 1;
        $variant = $data['variant'] ?? null;

        $item = $cart->items()
            ->where('product_id', $product->id)
            ->where('variant', $variant)
            ->first();

        $nextQuantity = $quantity + ($item?->quantity ?? 0);
        $this->checkStock($product, $variant, $nextQuantity);

        if ($item) {
            $item->update(['quantity' => $nextQuantity, 'unit_price' => $product->price]);
        } else {
            $cart->items()->create([
                'product_id' => $product->id,
                'quantity' => $quantity,
                'variant' => $variant,
                'unit_price' => $product->price,
            ]);
        }

        return $cart->fresh('items.product.images', 'items.product.variants')->toFrontendArray();
    }

    public function updateItem(Request $request, int $userId, CartItem $item)
    {
        $data = $request->validate([
            'quantity' => ['required', 'integer', 'min:1'],
        ]);

        $cart = $this->cartForUser($userId);
        abort_unless($item->cart_id === $cart->id, 404);

        $item->load('product.variants');
        $this->checkStock($item->product, $item->variant, $data['quantity']);
        $item->update(['quantity' => $data['quantity']]);

        return $cart->fresh('items.product.images', 'items.product.variants')->toFrontendArray();
    }

    public function removeItem(int $userId, CartItem $item)
    {
        $cart = $this->cartForUser($userId);
        abort_unless($item->cart_id === $cart->id, 404);
        $item->delete();

        return $cart->fresh('items.product.images', 'items.product.variants')->toFrontendArray();
    }

    public function clear(int $userId)
    {
        $cart = $this->cartForUser($userId);
        $cart->items()->delete();

        return $cart->fresh('items.product.images', 'items.product.variants')->toFrontendArray();
    }

    public function mergeGuestCart(Request $request, int $userId)
    {
        try {
            $data = $request->validate([
                'items' => ['nullable', 'array'],
                'items.*.productId' => ['required', 'integer', 'exists:products,id'],
                'items.*.quantity' => ['nullable', 'integer', 'min:1'],
                'items.*.variant' => ['nullable', 'string', 'max:100'],
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::error('Cart merge validation failed', ['errors' => $e->errors(), 'input' => $request->all()]);
            throw $e;
        }

        foreach ($data['items'] ?? [] as $item) {
            $this->addItem(new Request($item), $userId);
        }

        return $this->cartForUser($userId)->fresh('items.product.images', 'items.product.variants')->toFrontendArray();
    }

    private function cartForUser(int $userId): Cart
    {
        return Cart::firstOrCreate(['user_id' => $userId]);
    }

    private function checkStock(Product $product, ?string $variant, int $quantity): void
    {
        $stock = $product->stock;

        if ($variant) {
            $variantRow = $product->variants->firstWhere('value', $variant);
            $stock = $variantRow?->stock ?? 0;
        }

        if ($stock < $quantity) {
            abort(response()->json(['message' => 'Stock insuffisant pour ce produit.'], 422));
        }
    }
}
