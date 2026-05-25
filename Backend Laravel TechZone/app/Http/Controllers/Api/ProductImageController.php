<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Http\Request;

class ProductImageController extends Controller
{
    public function store(Request $request, Product $product)
    {
        $data = $this->validatedData($request);

        if ($data['isPrimary'] ?? false) {
            $product->images()->update(['is_primary' => false]);
        }

        $image = $product->images()->create([
            'image_url' => $data['imageUrl'],
            'public_id' => $data['publicId'] ?? null,
            'alt_text' => $data['altText'] ?? $product->title,
            'is_primary' => $data['isPrimary'] ?? ! $product->images()->exists(),
            'sort_order' => $data['sortOrder'] ?? $product->images()->count(),
        ]);

        return $image->toFrontendArray();
    }

    public function update(Request $request, ProductImage $image)
    {
        $data = $this->validatedData($request);

        if ($data['isPrimary'] ?? false) {
            $image->product->images()->where('id', '!=', $image->id)->update(['is_primary' => false]);
        }

        $image->update([
            'image_url' => $data['imageUrl'],
            'public_id' => $data['publicId'] ?? $image->public_id,
            'alt_text' => $data['altText'] ?? $image->alt_text,
            'is_primary' => $data['isPrimary'] ?? $image->is_primary,
            'sort_order' => $data['sortOrder'] ?? $image->sort_order,
        ]);

        return $image->fresh()->toFrontendArray();
    }

    public function destroy(ProductImage $image)
    {
        $product = $image->product;
        $wasPrimary = $image->is_primary;
        $image->delete();

        if ($wasPrimary) {
            $next = $product->images()->orderBy('sort_order')->first();
            $next?->update(['is_primary' => true]);
        }

        return response()->noContent();
    }

    private function validatedData(Request $request): array
    {
        return $request->validate([
            'imageUrl' => ['required', 'string'],
            'publicId' => ['nullable', 'string'],
            'altText' => ['nullable', 'string'],
            'isPrimary' => ['nullable', 'boolean'],
            'sortOrder' => ['nullable', 'integer'],
        ]);
    }
}
