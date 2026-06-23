<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrderControllerTest extends TestCase
{
    use RefreshDatabase;

    private function makeUser(string $role = 'user'): User
    {
        return User::factory()->create(['role' => $role]);
    }

    private function makeProduct(int $stock = 20): Product
    {
        return Product::factory()->create(['stock' => $stock, 'price' => 500]);
    }

    private function authHeader(User $user): array
    {
        return ['Authorization' => 'Bearer ' . $user->createToken('t')->plainTextToken];
    }

    private function checkoutPayload(Product $product, int $qty = 1): array
    {
        return [
            'items'        => [['productId' => $product->id, 'quantity' => $qty]],
            'shippingName'  => 'Mouad Test',
            'shippingPhone' => '0612345678',
            'shippingCity'  => 'Casablanca',
            'paymentMethod' => 'COD',
        ];
    }

    // ──────────────────────────────────────────
    // PUBLIC CHECKOUT
    // ──────────────────────────────────────────

    public function test_guest_can_checkout_via_public_endpoint(): void
    {
        $product = $this->makeProduct();

        $response = $this->postJson('/api/checkout', $this->checkoutPayload($product));

        $response->assertStatus(200)
                 ->assertJsonPath('status', 'En Attente');

        // Order number should be a UUID (not guessable)
        $data = $response->json();
        $this->assertMatchesRegularExpression(
            '/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/',
            $data['orderNumber'] ?? $data['id'] ?? ''
        );
    }

    public function test_checkout_decrements_stock(): void
    {
        $product = $this->makeProduct(10);

        $this->postJson('/api/checkout', $this->checkoutPayload($product, 3));

        $this->assertDatabaseHas('products', [
            'id'    => $product->id,
            'stock' => 7,
        ]);
    }

    public function test_checkout_fails_when_stock_insufficient(): void
    {
        $product = $this->makeProduct(1);

        $response = $this->postJson('/api/checkout', $this->checkoutPayload($product, 100));

        $response->assertStatus(422);
    }

    public function test_authenticated_checkout_rejects_wrong_user_id(): void
    {
        $user1   = $this->makeUser();
        $user2   = $this->makeUser();
        $product = $this->makeProduct();

        $response = $this->withHeaders($this->authHeader($user1))
                         ->postJson("/api/users/{$user2->id}/checkout", $this->checkoutPayload($product));

        $response->assertStatus(403);
    }

    // ──────────────────────────────────────────
    // ORDER LISTING
    // ──────────────────────────────────────────

    public function test_user_can_only_see_own_orders(): void
    {
        $user1 = $this->makeUser();
        $user2 = $this->makeUser();

        $response = $this->withHeaders($this->authHeader($user1))
                         ->getJson("/api/users/{$user2->id}/orders");

        $response->assertStatus(403);
    }

    public function test_admin_can_see_all_orders(): void
    {
        $admin = $this->makeUser('admin');

        $response = $this->withHeaders($this->authHeader($admin))
                         ->getJson('/api/orders');

        $response->assertStatus(200);
    }

    // ──────────────────────────────────────────
    // ORDER STATUS UPDATE
    // ──────────────────────────────────────────

    public function test_admin_can_update_order_status(): void
    {
        $admin   = $this->makeUser('admin');
        $product = $this->makeProduct();

        // Create an order first
        $orderRes = $this->postJson('/api/checkout', $this->checkoutPayload($product));
        $orderId  = $orderRes->json('backendId') ?? \App\Models\Order::first()?->id;

        if (!$orderId) {
            $this->markTestSkipped('Could not create order for status test.');
        }

        $response = $this->withHeaders($this->authHeader($admin))
                         ->patchJson("/api/orders/{$orderId}/status", [
                             'status' => 'EN_COURS',
                         ]);

        $response->assertStatus(200);
    }

    public function test_invalid_order_status_is_rejected(): void
    {
        $admin   = $this->makeUser('admin');
        $product = $this->makeProduct();
        $this->postJson('/api/checkout', $this->checkoutPayload($product));
        $orderId = \App\Models\Order::first()?->id;

        if (!$orderId) {
            $this->markTestSkipped('Could not create order.');
        }

        $response = $this->withHeaders($this->authHeader($admin))
                         ->patchJson("/api/orders/{$orderId}/status", [
                             'status' => 'FAKE_STATUS',
                         ]);

        $response->assertStatus(422);
    }
}
