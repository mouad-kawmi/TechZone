<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Cart extends Model
{
    protected $fillable = ['user_id', 'session_id'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(CartItem::class);
    }

    public function toFrontendArray(): array
    {
        $this->loadMissing(['items.product.images', 'items.product.variants']);

        return [
            'id' => $this->id,
            'userId' => $this->user_id,
            'subtotal' => $this->items->sum(fn (CartItem $item) => $item->quantity * (float) $item->unit_price),
            'items' => $this->items->map(fn (CartItem $item) => $item->toFrontendArray())->values(),
        ];
    }
}
