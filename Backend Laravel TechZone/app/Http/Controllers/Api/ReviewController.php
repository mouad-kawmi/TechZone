<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;

class ReviewController extends Controller
{

    public function store(Request $request, Product $product)
    {
        $data = $request->validate([
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'title' => ['nullable', 'string', 'max:150'],
            'body' => ['nullable', 'string'],
        ]);

        $user = $request->user();
        
        // Verify if user actual purchased this product directly and it's delivered
        $hasPurchased = $user && \App\Models\Order::where('user_id', $user->id)
            ->where('status', 'LIVRE')
            ->whereHas('items', fn ($q) => $q->where('product_id', $product->id))
            ->exists();

        $review = $product->reviews()->create([
            'user_id' => $user?->id,
            'user' => $user?->name ?: 'Client TechZone',
            'title' => $data['title'] ?? null,
            'rating' => $data['rating'],
            'body' => $data['body'] ?? '',
            'is_verified' => $hasPurchased,
            'is_approved' => true,
            'helpful_count' => 0,
        ]);

        $product->refreshRating();

        return $review->toFrontendArray();
    }
}
