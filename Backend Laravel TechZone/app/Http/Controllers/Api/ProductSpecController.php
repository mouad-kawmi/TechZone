<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductSpecController extends Controller
{
    public function store(Request $request, Product $product)
    {
        $data = $request->validate([
            'specKey' => ['required', 'string', 'max:100'],
            'specValue' => ['required', 'string', 'max:255'],
        ]);

        $specs = $product->specs ?: [];
        $specs[$data['specKey']] = $data['specValue'];
        $product->update(['specs' => $specs]);

        return $product->fresh(['category', 'brand', 'images', 'variants', 'reviews'])->toFrontendArray();
    }
}
