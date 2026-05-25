<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderItem extends Model
{
    protected $fillable = [
        'order_id',
        'product_id',
        'product_title',
        'product_image',
        'unit_price',
        'quantity',
        'variant',
    ];

    protected $casts = [
        'unit_price' => 'decimal:2',
        'quantity' => 'integer',
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function toFrontendArray(): array
    {
        return [
            'id' => $this->id,
            'orderId' => $this->order_id,
            'productId' => $this->product_id,
            'productTitle' => $this->product_title,
            'productImage' => $this->product_image,
            'unitPrice' => (float) $this->unit_price,
            'price' => (float) $this->unit_price,
            'quantity' => $this->quantity,
            'variant' => $this->variant,
        ];
    }
}
