<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        try {
            $data = $request->validate([
                'fullName' => ['required', 'string', 'max:255'],
                'email' => ['required', 'email', 'unique:users,email'],
                'password' => ['required', 'string', \Illuminate\Validation\Rules\Password::min(8)->letters()->numbers()],
                'phone' => ['nullable', 'string', 'max:40'],
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::error('Register validation failed', ['errors' => $e->errors(), 'input' => $request->except('password')]);
            throw $e;
        }

        $user = User::create([
            'name' => $data['fullName'],
            'full_name' => $data['fullName'],
            'username' => $data['fullName'],
            'email' => $data['email'],
            'phone' => $data['phone'] ?? null,
            'role' => 'user',
            'points' => 200,
            'password' => Hash::make($data['password']),
        ]);

        return $this->authResponse($user);
    }

    public function login(Request $request)
    {
        try {
            $data = $request->validate([
                'email' => ['required', 'email'],
                'password' => ['required', 'string'],
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::error('Login validation failed', ['errors' => $e->errors(), 'input' => $request->all()]);
            throw $e;
        }

        $user = User::query()
            ->where('email', $data['email'])
            ->first();

        if (! $user || ! Hash::check($data['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Email ou mot de passe incorrect.'],
            ]);
        }

        return $this->authResponse($user);
    }

    public function me(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        return $user->toFrontendArray();
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully.']);
    }

    private function authResponse(User $user): array
    {
        // Delete all old personal access tokens for this user
        $user->tokens()->delete();

        $token = $user->createToken('auth_token')->plainTextToken;

        return [
            'token' => $token,
            'user' => $user->toFrontendArray(),
        ];
    }
}
