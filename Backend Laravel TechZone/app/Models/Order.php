<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    protected $fillable = [
        'order_number',
        'user_id',
        'shipping_name',
        'shipping_phone',
        'shipping_email',
        'shipping_street',
        'shipping_city',
        'shipping_postal',
        'notes',
        'status',
        'payment_method',
        'payment_status',
        'subtotal',
        'shipping_cost',
        'discount',
        'final_total',
        'coupon_code',
        'transaction_reference',
        'shipped_at',
        'delivered_at',
    ];

    protected $casts = [
        'subtotal' => 'decimal:2',
        'shipping_cost' => 'decimal:2',
        'discount' => 'decimal:2',
        'final_total' => 'decimal:2',
        'shipped_at' => 'datetime',
        'delivered_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function toFrontendArray(): array
    {
        $this->loadMissing('items');

        return [
            'id' => $this->id,
            'orderId' => $this->id,
            'orderNumber' => $this->order_number,
            'userId' => $this->user_id,
            'shippingName' => $this->shipping_name,
            'customerName' => $this->shipping_name,
            'shippingPhone' => $this->shipping_phone,
            'shippingEmail' => $this->shipping_email,
            'shippingStreet' => $this->shipping_street,
            'shippingCity' => $this->shipping_city,
            'shippingPostal' => $this->shipping_postal,
            'notes' => $this->notes,
            'status' => $this->status,
            'paymentMethod' => $this->payment_method,
            'paymentStatus' => $this->payment_status,
            'subtotal' => (float) $this->subtotal,
            'shippingCost' => (float) $this->shipping_cost,
            'discount' => (float) $this->discount,
            'finalTotal' => (float) $this->final_total,
            'couponCode' => $this->coupon_code,
            'transactionReference' => $this->transaction_reference,
            'createdAt' => optional($this->created_at)->toISOString(),
            'shippedAt' => optional($this->shipped_at)->toISOString(),
            'deliveredAt' => optional($this->delivered_at)->toISOString(),
            'items' => $this->items->map(fn (OrderItem $item) => $item->toFrontendArray())->values(),
        ];
    }
}
