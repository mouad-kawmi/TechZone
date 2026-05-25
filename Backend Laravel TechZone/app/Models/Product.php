<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'description',
        'price',
        'old_price',
        'stock',
        'sku',
        'category_id',
        'brand_id',
        'specs',
        'technical_specs',
        'is_new',
        'is_featured',
        'is_active',
        'rating',
        'reviews_count',
        'promo_expires_at',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'old_price' => 'decimal:2',
        'stock' => 'integer',
        'specs' => 'array',
        'technical_specs' => 'array',
        'is_new' => 'boolean',
        'is_featured' => 'boolean',
        'is_active' => 'boolean',
        'rating' => 'decimal:2',
        'reviews_count' => 'integer',
        'promo_expires_at' => 'datetime',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function brand(): BelongsTo
    {
        return $this->belongsTo(Brand::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class)->orderBy('sort_order');
    }

    public function variants(): HasMany
    {
        return $this->hasMany(ProductVariant::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class)->latest();
    }

    public function primaryImage(): ?ProductImage
    {
        return $this->images->firstWhere('is_primary', true) ?: $this->images->first();
    }

    public function refreshRating(): void
    {
        $approvedReviews = $this->reviews()->where('is_approved', true);

        $this->update([
            'rating' => round((float) $approvedReviews->avg('rating'), 2),
            'reviews_count' => $approvedReviews->count(),
        ]);
    }

    public function toFrontendArray(): array
    {
        $this->loadMissing(['category', 'brand', 'images', 'variants', 'reviews']);

        $images = $this->images->values();
        $primaryImage = $this->primaryImage();
        $reviewRows = $this->reviews->where('is_approved', true)->values();

        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'description' => $this->description,
            'price' => (float) $this->price,
            'oldPrice' => $this->old_price === null ? null : (float) $this->old_price,
            'stock' => $this->stock,
            'sku' => $this->sku,
            'categoryId' => $this->category_id,
            'categoryName' => $this->category?->name,
            'category' => $this->category?->name,
            'brandId' => $this->brand_id,
            'brandName' => $this->brand?->name,
            'brand' => $this->brand?->name,
            'specs' => $this->specs ?: [],
            'technicalSpecs' => $this->technical_specs ?: [],
            'isNew' => $this->is_new,
            'isFeatured' => $this->is_featured,
            'isActive' => $this->is_active,
            'isOutOfStock' => $this->stock <= 0,
            'rating' => (float) $this->rating,
            'reviewsCount' => $this->reviews_count,
            'reviews' => $this->reviews_count,
            'mainImage' => $primaryImage?->image_url,
            'image' => $primaryImage?->image_url,
            'images' => $images->pluck('image_url')->filter()->values(),
            'imageDetails' => $images->map(fn (ProductImage $image) => $image->toFrontendArray())->values(),
            'variants' => $this->variants->map(fn (ProductVariant $variant) => $variant->toFrontendArray())->values(),
            'reviewsList' => $reviewRows->map(fn (Review $review) => $review->toFrontendArray())->values(),
            'promoExpiresAt' => optional($this->promo_expires_at)->toISOString(),
            'createdAt' => optional($this->created_at)->toISOString(),
        ];
    }
}
