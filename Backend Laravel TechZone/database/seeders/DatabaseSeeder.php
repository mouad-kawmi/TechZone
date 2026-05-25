<?php

namespace Database\Seeders;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Coupon;
use App\Models\Product;
use App\Models\StoreSetting;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@techzone.ma'],
            [
                'name' => 'Admin TechZone',
                'full_name' => 'Admin TechZone',
                'username' => 'admin',
                'phone' => '+212 600-000000',
                'role' => 'admin',
                'points' => 0,
                'password' => Hash::make('admin123'),
            ]
        );

        User::updateOrCreate(
            ['email' => 'client@techzone.ma'],
            [
                'name' => 'Client Demo',
                'full_name' => 'Client Demo',
                'username' => 'client',
                'phone' => '+212 611-111111',
                'role' => 'user',
                'points' => 200,
                'password' => Hash::make('client123'),
            ]
        );

        $categories = collect(['Smartphones', 'Laptops', 'Tablets', 'Audio'])
            ->mapWithKeys(fn (string $name, int $index) => [
                $name => Category::updateOrCreate(
                    ['name' => $name],
                    ['slug' => Str::slug($name), 'is_active' => true, 'sort_order' => $index]
                ),
            ]);

        $brands = collect(['Apple', 'Samsung', 'HP', 'Sony', 'Bose'])
            ->mapWithKeys(fn (string $name) => [
                $name => Brand::updateOrCreate(
                    ['name' => $name],
                    ['slug' => Str::slug($name), 'is_active' => true]
                ),
            ]);

        StoreSetting::updateOrCreate(
            ['id' => 1],
            [
                'store_name' => 'TechZone Electro',
                'email' => 'contact@techzone.ma',
                'phone' => '+212 600-000000',
                'address' => 'Casablanca, Morocco',
                'delivery_fee' => 30,
                'free_delivery_threshold' => 2000,
                'currency' => 'MAD',
            ]
        );

        Coupon::updateOrCreate(
            ['code' => 'WELCOME10'],
            ['type' => 'PERCENT', 'value' => 10, 'minimum_order' => 500, 'active' => true]
        );

        $products = [
            [
                'title' => 'iPhone 15 Pro Max',
                'category' => 'Smartphones',
                'brand' => 'Apple',
                'price' => 12900,
                'old_price' => 13900,
                'stock' => 12,
                'description' => 'Smartphone premium avec puce A17 Pro et camera avancee.',
                'image' => 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=1200&auto=format&fit=crop',
                'specs' => ['Ecran' => '6.7 pouces', 'Stockage' => '256GB', 'Puce' => 'A17 Pro'],
                'variants' => [['value' => '256', 'stock' => 8], ['value' => '512', 'stock' => 4]],
            ],
            [
                'title' => 'HP Spectre x360',
                'category' => 'Laptops',
                'brand' => 'HP',
                'price' => 15000,
                'old_price' => 17000,
                'stock' => 7,
                'description' => 'Laptop convertible elegant pour travail et creation.',
                'image' => 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1200&auto=format&fit=crop',
                'specs' => ['CPU' => 'Intel Core i7', 'RAM' => '16GB', 'SSD' => '1TB'],
                'variants' => [['value' => '16GB / 1TB', 'stock' => 7]],
            ],
            [
                'title' => 'iPad Pro 12.9',
                'category' => 'Tablets',
                'brand' => 'Apple',
                'price' => 11200,
                'old_price' => null,
                'stock' => 9,
                'description' => 'Tablette puissante pour design, notes et multimedia.',
                'image' => 'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?q=80&w=1200&auto=format&fit=crop',
                'specs' => ['Ecran' => '12.9 pouces', 'Puce' => 'M2', 'Stockage' => '256GB'],
                'variants' => [['value' => 'WiFi', 'stock' => 5], ['value' => 'Cellular', 'stock' => 4]],
            ],
            [
                'title' => 'Sony WH-1000XM5',
                'category' => 'Audio',
                'brand' => 'Sony',
                'price' => 3900,
                'old_price' => 4500,
                'stock' => 16,
                'description' => 'Casque bluetooth avec reduction de bruit active.',
                'image' => 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=1200&auto=format&fit=crop',
                'specs' => ['Autonomie' => '30h', 'Bluetooth' => '5.2', 'ANC' => 'Oui'],
                'variants' => [['value' => 'Noir', 'stock' => 10], ['value' => 'Argent', 'stock' => 6]],
            ],
        ];

        foreach ($products as $item) {
            $product = Product::updateOrCreate(
                ['slug' => Str::slug($item['title'])],
                [
                    'title' => $item['title'],
                    'description' => $item['description'],
                    'price' => $item['price'],
                    'old_price' => $item['old_price'],
                    'stock' => $item['stock'],
                    'category_id' => $categories[$item['category']]->id,
                    'brand_id' => $brands[$item['brand']]->id,
                    'specs' => $item['specs'],
                    'is_active' => true,
                    'is_featured' => true,
                    'rating' => 5,
                    'reviews_count' => 1,
                ]
            );

            $product->images()->updateOrCreate(
                ['sort_order' => 0],
                ['image_url' => $item['image'], 'alt_text' => $item['title'], 'is_primary' => true]
            );

            foreach ($item['variants'] as $variant) {
                $product->variants()->updateOrCreate(
                    ['type' => 'STORAGE', 'value' => $variant['value']],
                    ['stock' => $variant['stock'], 'price_delta' => 0]
                );
            }

            $product->reviews()->updateOrCreate(
                ['user' => 'Client Demo'],
                [
                    'title' => 'Avis verifie',
                    'rating' => 5,
                    'body' => 'Produit conforme, livraison rapide et service client reactif.',
                    'is_verified' => true,
                    'is_approved' => true,
                ]
            );
        }
    }
}
