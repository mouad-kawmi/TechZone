<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Http\Request;

class ProductVariantController extends Controller
{
    public function store(Request $request, Product $product)
    {
        $data = $this->validatedData($request);
        $variant = $product->variants()->create($this->fields($data));

        return $variant->toFrontendArray();
    }

    public function update(Request $request, ProductVariant $variant)
    {
        $data = $this->validatedData($request);
        $variant->update($this->fields($data));

        return $variant->fresh()->toFrontendArray();
    }

    public function destroy(ProductVariant $variant)
    {
        $variant->delete();

        return response()->noContent();
    }

    private function validatedData(Request $request): array
    {
        return $request->validate([
            'type' => ['required', 'string', 'max:40'],
            'value' => ['required', 'string', 'max:100'],
            'colorHex' => ['nullable', 'string', 'max:20'],
            'stock' => ['nullable', 'integer', 'min:0'],
            'priceDelta' => ['nullable', 'numeric'],
        ]);
    }

    private function fields(array $data): array
    {
        return [
            'type' => strtoupper($data['type']),
            'value' => $data['value'],
            'color_hex' => $data['colorHex'] ?? null,
            'stock' => $data['stock'] ?? 0,
            'price_delta' => $data['priceDelta'] ?? 0,
        ];
    }
}
