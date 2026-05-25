<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Review extends Model
{
    protected $fillable = [
        'product_id',
        'user_id',
        'user',
        'title',
        'rating',
        'body',
        'is_verified',
        'is_approved',
        'helpful_count',
    ];

    protected $casts = [
        'rating' => 'integer',
        'is_verified' => 'boolean',
        'is_approved' => 'boolean',
        'helpful_count' => 'integer',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function toFrontendArray(): array
    {
        return [
            'id' => $this->id,
            'productId' => $this->product_id,
            'userId' => $this->user_id,
            'user' => $this->user ?: $this->author?->name ?: 'Client',
            'title' => $this->title,
            'rating' => $this->rating,
            'body' => $this->body,
            'comment' => $this->body,
            'isVerified' => $this->is_verified,
            'isApproved' => $this->is_approved,
            'helpfulCount' => $this->helpful_count,
            'createdAt' => optional($this->created_at)->toISOString(),
        ];
    }
}
