<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CartItem extends Model
{
    protected $fillable = ['cart_id', 'product_id', 'quantity', 'variant', 'unit_price'];

    protected $casts = [
        'quantity' => 'integer',
        'unit_price' => 'decimal:2',
    ];

    public function cart(): BelongsTo
    {
        return $this->belongsTo(Cart::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function availableStock(): int
    {
        $variant = $this->product?->variants->firstWhere('value', $this->variant);

        return $variant ? $variant->stock : (int) ($this->product?->stock ?? 0);
    }

    public function toFrontendArray(): array
    {
        $this->loadMissing(['product.images', 'product.variants']);

        $image = $this->product?->primaryImage()?->image_url;
        $stock = $this->availableStock();

        return [
            'id' => $this->id,
            'productId' => $this->product_id,
            'productTitle' => $this->product?->title,
            'productImage' => $image,
            'unitPrice' => (float) $this->unit_price,
            'quantity' => $this->quantity,
            'variant' => $this->variant,
            'stock' => $stock,
            'isAvailable' => $stock >= $this->quantity,
        ];
    }
}
