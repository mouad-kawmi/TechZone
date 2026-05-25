<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with(['category', 'brand', 'images', 'variants', 'reviews'])
            ->where('is_active', true);

        if ($search = $request->query('search')) {
            $query->where(function ($builder) use ($search) {
                $builder->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($category = $request->query('category')) {
            $query->whereHas('category', fn ($builder) => $builder->where('name', $category));
        }

        if ($brand = $request->query('brand')) {
            $query->whereHas('brand', fn ($builder) => $builder->where('name', $brand));
        }

        if ($request->filled('minPrice')) {
            $query->where('price', '>=', (float) $request->query('minPrice'));
        }

        if ($request->filled('maxPrice')) {
            $query->where('price', '<=', (float) $request->query('maxPrice'));
        }

        match ($request->query('sort')) {
            'price_asc' => $query->orderBy('price'),
            'price_desc' => $query->orderByDesc('price'),
            'popular' => $query->orderByDesc('reviews_count'),
            default => $query->latest(),
        };

        if ($request->filled('perPage')) {
            $page = $query->paginate((int) $request->query('perPage', 12));

            return [
                'content' => collect($page->items())->map(fn (Product $product) => $product->toFrontendArray()),
                'totalElements' => $page->total(),
                'totalPages' => $page->lastPage(),
                'number' => $page->currentPage(),
            ];
        }

        return $query->get()->map(fn (Product $product) => $product->toFrontendArray());
    }

    public function store(Request $request)
    {
        $data = $this->validatedProduct($request);
        $product = Product::create($this->productFields($data));

        return $product->fresh(['category', 'brand', 'images', 'variants', 'reviews'])->toFrontendArray();
    }

    public function show(Product $product)
    {
        return $product->toFrontendArray();
    }

    public function update(Request $request, Product $product)
    {
        $data = $this->validatedProduct($request);
        $product->update($this->productFields($data, $product));

        return $product->fresh(['category', 'brand', 'images', 'variants', 'reviews'])->toFrontendArray();
    }

    public function destroy(Product $product)
    {
        $product->delete();

        return response()->noContent();
    }

    private function validatedProduct(Request $request): array
    {
        return $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'price' => ['required', 'numeric', 'min:0'],
            'oldPrice' => ['nullable', 'numeric', 'min:0'],
            'stock' => ['nullable', 'integer', 'min:0'],
            'sku' => ['nullable', 'string', 'max:100'],
            'categoryId' => ['nullable', 'integer', 'exists:categories,id'],
            'brandId' => ['nullable', 'integer', 'exists:brands,id'],
            'category' => ['nullable', 'string', 'max:100'],
            'brand' => ['nullable', 'string', 'max:100'],
            'specs' => ['nullable', 'array'],
            'technicalSpecs' => ['nullable', 'array'],
            'isNew' => ['nullable', 'boolean'],
            'isFeatured' => ['nullable', 'boolean'],
            'isActive' => ['nullable', 'boolean'],
            'rating' => ['nullable', 'numeric', 'min:0', 'max:5'],
            'reviewsCount' => ['nullable', 'integer', 'min:0'],
            'promoExpiresAt' => ['nullable', 'date'],
        ]);
    }

    private function productFields(array $data, ?Product $product = null): array
    {
        $categoryId = $data['categoryId'] ?? null;
        $brandId = $data['brandId'] ?? null;

        if (! $categoryId && ! empty($data['category'])) {
            $categoryId = Category::firstOrCreate(
                ['name' => $this->fixedCategoryName($data['category'])],
                ['slug' => Str::slug($this->fixedCategoryName($data['category']))]
            )->id;
        }

        if (! $brandId && ! empty($data['brand'])) {
            $brandId = Brand::firstOrCreate(
                ['name' => $data['brand']],
                ['slug' => Str::slug($data['brand'])]
            )->id;
        }

        $slug = $data['slug'] ?? Str::slug($data['title']);
        if (! $product || $product->slug !== $slug) {
            $slug = $this->uniqueSlug($slug, $product?->id);
        }

        return [
            'title' => $data['title'],
            'slug' => $slug,
            'description' => $data['description'] ?? null,
            'price' => $data['price'],
            'old_price' => $data['oldPrice'] ?? null,
            'stock' => $data['stock'] ?? 0,
            'sku' => $data['sku'] ?? null,
            'category_id' => $categoryId,
            'brand_id' => $brandId,
            'specs' => $data['specs'] ?? [],
            'technical_specs' => $data['technicalSpecs'] ?? [],
            'is_new' => $data['isNew'] ?? false,
            'is_featured' => $data['isFeatured'] ?? false,
            'is_active' => $data['isActive'] ?? true,
            'rating' => $data['rating'] ?? 0,
            'reviews_count' => $data['reviewsCount'] ?? 0,
            'promo_expires_at' => $data['promoExpiresAt'] ?? null,
        ];
    }

    private function uniqueSlug(string $slug, ?int $ignoreId = null): string
    {
        $base = $slug ?: Str::random(8);
        $next = $base;
        $count = 2;

        while (Product::where('slug', $next)->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))->exists()) {
            $next = $base.'-'.$count;
            $count++;
        }

        return $next;
    }

    private function fixedCategoryName(string $name): string
    {
        $clean = strtolower(trim($name));

        return match ($clean) {
            'phone', 'phones', 'smartphone', 'smartphones' => 'Smartphones',
            'laptop', 'laptops', 'pc' => 'Laptops',
            'tablet', 'tablets', 'tablette', 'tablettes' => 'Tablets',
            'audio' => 'Audio',
            default => 'Smartphones',
        };
    }
}
