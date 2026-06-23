<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthControllerTest extends TestCase
{
    use RefreshDatabase;

    // ──────────────────────────────────────────
    // REGISTER
    // ──────────────────────────────────────────

    public function test_user_can_register_with_valid_data(): void
    {
        $response = $this->postJson('/api/auth/register', [
            'fullName' => 'Mouad Test',
            'email'    => 'mouad@test.com',
            'password' => 'password123',
            'phone'    => '0600000000',
        ]);

        $response->assertStatus(200)
                 ->assertJsonPath('user.email', 'mouad@test.com');

        // Token must be in cookie, NOT in JSON body
        $response->assertCookie('tz_token');
        $response->assertJsonMissing(['token']);

        $this->assertDatabaseHas('users', ['email' => 'mouad@test.com']);
    }

    public function test_register_fails_with_weak_password(): void
    {
        $response = $this->postJson('/api/auth/register', [
            'fullName' => 'Test User',
            'email'    => 'test@test.com',
            'password' => '123', // too short, no letters
        ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['password']);
    }

    public function test_register_fails_with_duplicate_email(): void
    {
        User::factory()->create(['email' => 'existing@test.com']);

        $response = $this->postJson('/api/auth/register', [
            'fullName' => 'Another User',
            'email'    => 'existing@test.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['email']);
    }

    // ──────────────────────────────────────────
    // LOGIN
    // ──────────────────────────────────────────

    public function test_user_can_login_with_correct_credentials(): void
    {
        $user = User::factory()->create([
            'email'    => 'login@test.com',
            'password' => bcrypt('password123'),
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email'    => 'login@test.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(200)
                 ->assertJsonPath('user.email', 'login@test.com')
                 ->assertCookie('tz_token')
                 ->assertJsonMissing(['token']); // Token must not leak in JSON
    }

    public function test_login_fails_with_wrong_password(): void
    {
        User::factory()->create([
            'email'    => 'secure@test.com',
            'password' => bcrypt('correctpassword'),
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email'    => 'secure@test.com',
            'password' => 'wrongpassword',
        ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['email']);
    }

    public function test_login_is_rate_limited(): void
    {
        User::factory()->create(['email' => 'rl@test.com', 'password' => bcrypt('pass')]);

        for ($i = 0; $i < 6; $i++) {
            $this->postJson('/api/auth/login', ['email' => 'rl@test.com', 'password' => 'wrong']);
        }

        $response = $this->postJson('/api/auth/login', ['email' => 'rl@test.com', 'password' => 'wrong']);
        $response->assertStatus(429); // Too Many Requests
    }

    // ──────────────────────────────────────────
    // ME
    // ──────────────────────────────────────────

    public function test_me_returns_user_when_authenticated(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('auth_token')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer $token")
                         ->getJson('/api/auth/me');

        $response->assertStatus(200)
                 ->assertJsonPath('email', $user->email);
    }

    public function test_me_returns_401_when_not_authenticated(): void
    {
        $this->getJson('/api/auth/me')->assertStatus(401);
    }

    // ──────────────────────────────────────────
    // LOGOUT
    // ──────────────────────────────────────────

    public function test_logout_revokes_token_and_clears_cookie(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('auth_token')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer $token")
                         ->postJson('/api/auth/logout');

        $response->assertStatus(200)
                 ->assertJson(['message' => 'Logged out successfully.']);

        // Token should be revoked — no longer valid
        $this->assertCount(0, $user->fresh()->tokens);
    }
}
