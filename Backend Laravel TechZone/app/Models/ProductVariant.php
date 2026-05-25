<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductVariant extends Model
{
    protected $fillable = [
        'product_id',
        'type',
        'value',
        'color_hex',
        'stock',
        'price_delta',
    ];

    protected $casts = [
        'stock' => 'integer',
        'price_delta' => 'decimal:2',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function toFrontendArray(): array
    {
        return [
            'id' => $this->id,
            'productId' => $this->product_id,
            'type' => $this->type,
            'value' => $this->value,
            'colorHex' => $this->color_hex,
            'stock' => $this->stock,
            'priceDelta' => (float) $this->price_delta,
        ];
    }
}
