<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductImage extends Model
{
    protected $fillable = [
        'product_id',
        'image_url',
        'public_id',
        'alt_text',
        'is_primary',
        'sort_order',
    ];

    protected $casts = [
        'is_primary' => 'boolean',
        'sort_order' => 'integer',
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
            'imageUrl' => $this->image_url,
            'publicId' => $this->public_id,
            'altText' => $this->alt_text,
            'isPrimary' => $this->is_primary,
            'sortOrder' => $this->sort_order,
        ];
    }
}
