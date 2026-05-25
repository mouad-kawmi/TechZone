<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function store(Request $request, Product $product)
    {
        $data = $request->validate([
            'userId' => ['nullable', 'integer', 'exists:users,id'],
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'title' => ['nullable', 'string', 'max:150'],
            'body' => ['nullable', 'string'],
            'isVerified' => ['nullable', 'boolean'],
            'isApproved' => ['nullable', 'boolean'],
            'helpfulCount' => ['nullable', 'integer', 'min:0'],
        ]);

        $user = isset($data['userId']) ? User::find($data['userId']) : null;

        $review = $product->reviews()->create([
            'user_id' => $data['userId'] ?? null,
            'user' => $user?->name ?: 'Client TechZone',
            'title' => $data['title'] ?? null,
            'rating' => $data['rating'],
            'body' => $data['body'] ?? '',
            'is_verified' => $data['isVerified'] ?? false,
            'is_approved' => $data['isApproved'] ?? true,
            'helpful_count' => $data['helpfulCount'] ?? 0,
        ]);

        $product->refreshRating();

        return $review->toFrontendArray();
    }
}
