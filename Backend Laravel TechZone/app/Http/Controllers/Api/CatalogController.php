<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CatalogController extends Controller
{
    private array $fixedCategories = ['Smartphones', 'Laptops', 'Tablets', 'Audio'];

    public function categories()
    {
        return Category::withCount('products')
            ->orderBy('sort_order')
            ->get()
            ->map(fn (Category $category) => $category->toFrontendArray());
    }

    public function storeCategory(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'description' => ['nullable', 'string'],
            'icon' => ['nullable', 'string'],
            'imageUrl' => ['nullable', 'string'],
            'isActive' => ['nullable', 'boolean'],
            'sortOrder' => ['nullable', 'integer'],
        ]);

        $name = $this->fixedCategoryName($data['name']);
        $category = Category::firstOrCreate(
            ['name' => $name],
            [
                'slug' => Str::slug($name),
                'description' => $data['description'] ?? null,
                'icon' => $data['icon'] ?? null,
                'image_url' => $data['imageUrl'] ?? null,
                'is_active' => $data['isActive'] ?? true,
                'sort_order' => $data['sortOrder'] ?? array_search($name, $this->fixedCategories, true),
            ]
        );

        return $category->fresh()->toFrontendArray();
    }

    public function updateCategory(Request $request, Category $category)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'description' => ['nullable', 'string'],
            'icon' => ['nullable', 'string'],
            'imageUrl' => ['nullable', 'string'],
            'isActive' => ['nullable', 'boolean'],
            'sortOrder' => ['nullable', 'integer'],
        ]);

        $name = $this->fixedCategoryName($data['name']);
        $category->update([
            'name' => $name,
            'slug' => Str::slug($name),
            'description' => $data['description'] ?? $category->description,
            'icon' => $data['icon'] ?? $category->icon,
            'image_url' => $data['imageUrl'] ?? $category->image_url,
            'is_active' => $data['isActive'] ?? $category->is_active,
            'sort_order' => $data['sortOrder'] ?? $category->sort_order,
        ]);

        return $category->fresh()->toFrontendArray();
    }

    public function deleteCategory(Category $category)
    {
        if (in_array($category->name, $this->fixedCategories, true) || $category->products()->exists()) {
            return response()->json(['message' => 'Cette categorie est verrouillee.'], 422);
        }

        $category->delete();

        return response()->noContent();
    }

    public function brands()
    {
        return Brand::withCount('products')
            ->orderBy('name')
            ->get()
            ->map(fn (Brand $brand) => $brand->toFrontendArray());
    }

    public function storeBrand(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'logoUrl' => ['nullable', 'string'],
            'isActive' => ['nullable', 'boolean'],
        ]);

        $brand = Brand::firstOrCreate(
            ['name' => $data['name']],
            [
                'slug' => Str::slug($data['name']),
                'logo_url' => $data['logoUrl'] ?? null,
                'is_active' => $data['isActive'] ?? true,
            ]
        );

        return $brand->fresh()->toFrontendArray();
    }

    public function updateBrand(Request $request, Brand $brand)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'logoUrl' => ['nullable', 'string'],
            'isActive' => ['nullable', 'boolean'],
        ]);

        $brand->update([
            'name' => $data['name'],
            'slug' => Str::slug($data['name']),
            'logo_url' => $data['logoUrl'] ?? $brand->logo_url,
            'is_active' => $data['isActive'] ?? $brand->is_active,
        ]);

        return $brand->fresh()->toFrontendArray();
    }

    public function deleteBrand(Brand $brand)
    {
        if ($brand->products()->exists()) {
            return response()->json(['message' => 'Cette marque est utilisee par des produits.'], 422);
        }

        $brand->delete();

        return response()->noContent();
    }

    private function fixedCategoryName(string $name): string
    {
        $clean = strtolower(trim($name));
        $aliases = [
            'phone' => 'Smartphones',
            'phones' => 'Smartphones',
            'smartphone' => 'Smartphones',
            'smartphones' => 'Smartphones',
            'laptop' => 'Laptops',
            'laptops' => 'Laptops',
            'pc' => 'Laptops',
            'tablet' => 'Tablets',
            'tablets' => 'Tablets',
            'tablette' => 'Tablets',
            'tablettes' => 'Tablets',
            'audio' => 'Audio',
        ];

        return $aliases[$clean] ?? 'Smartphones';
    }
}
