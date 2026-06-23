<?php

namespace Tests\Feature;

use App\Models\Cart;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CartControllerTest extends TestCase
{
    use RefreshDatabase;

    private function makeUser(string $role = 'user'): User
    {
        return User::factory()->create(['role' => $role]);
    }

    private function makeProduct(int $stock = 10): Product
    {
        return Product::factory()->create(['stock' => $stock, 'price' => 100]);
    }

    private function authHeader(User $user): array
    {
        return ['Authorization' => 'Bearer ' . $user->createToken('t')->plainTextToken];
    }

    // ──────────────────────────────────────────
    // SHOW
    // ──────────────────────────────────────────

    public function test_user_can_view_own_cart(): void
    {
        $user = $this->makeUser();

        $response = $this->withHeaders($this->authHeader($user))
                         ->getJson("/api/users/{$user->id}/cart");

        $response->assertStatus(200);
    }

    public function test_user_cannot_view_another_users_cart(): void
    {
        $user1 = $this->makeUser();
        $user2 = $this->makeUser();

        $response = $this->withHeaders($this->authHeader($user1))
                         ->getJson("/api/users/{$user2->id}/cart");

        $response->assertStatus(403);
    }

    public function test_admin_can_view_any_cart(): void
    {
        $admin = $this->makeUser('admin');
        $user  = $this->makeUser();

        $response = $this->withHeaders($this->authHeader($admin))
                         ->getJson("/api/users/{$user->id}/cart");

        $response->assertStatus(200);
    }

    public function test_unauthenticated_user_cannot_view_cart(): void
    {
        $this->getJson('/api/users/1/cart')->assertStatus(401);
    }

    // ──────────────────────────────────────────
    // ADD ITEM
    // ──────────────────────────────────────────

    public function test_user_can_add_item_to_own_cart(): void
    {
        $user    = $this->makeUser();
        $product = $this->makeProduct(5);

        $response = $this->withHeaders($this->authHeader($user))
                         ->postJson("/api/users/{$user->id}/cart/items", [
                             'productId' => $product->id,
                             'quantity'  => 2,
                         ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('cart_items', [
            'product_id' => $product->id,
            'quantity'   => 2,
        ]);
    }

    public function test_cannot_add_more_than_available_stock(): void
    {
        $user    = $this->makeUser();
        $product = $this->makeProduct(1);

        $response = $this->withHeaders($this->authHeader($user))
                         ->postJson("/api/users/{$user->id}/cart/items", [
                             'productId' => $product->id,
                             'quantity'  => 99,
                         ]);

        $response->assertStatus(422);
    }

    public function test_user_cannot_add_item_to_another_users_cart(): void
    {
        $user1   = $this->makeUser();
        $user2   = $this->makeUser();
        $product = $this->makeProduct();

        $response = $this->withHeaders($this->authHeader($user1))
                         ->postJson("/api/users/{$user2->id}/cart/items", [
                             'productId' => $product->id,
                             'quantity'  => 1,
                         ]);

        $response->assertStatus(403);
    }
}
