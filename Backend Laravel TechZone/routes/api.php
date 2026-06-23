<?php

use App\Http\Controllers\Api\AdminStatsController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\CatalogController;
use App\Http\Controllers\Api\CouponController;
use App\Http\Controllers\Api\ImageUploadController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\ProductImageController;
use App\Http\Controllers\Api\ProductSpecController;
use App\Http\Controllers\Api\ProductVariantController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\StoreSettingController;
use App\Http\Controllers\Api\SupportMessageController;
use Illuminate\Support\Facades\Route;

// ==========================================
// PUBLIC ROUTES
// ==========================================

// Auth
Route::post('/auth/register', [AuthController::class, 'register']);
Route::middleware('throttle:6,1')->post('/auth/login', [AuthController::class, 'login']);

// Catalog & Products
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{product}', [ProductController::class, 'show']);
Route::get('/categories', [CatalogController::class, 'categories']);
Route::get('/brands', [CatalogController::class, 'brands']);

// Checkout & Orders (Public tracking/checkout)
Route::middleware('throttle:30,1')->post('/checkout', [OrderController::class, 'checkout']);
Route::middleware('throttle:30,1')->post('/users/{userId}/checkout', [OrderController::class, 'checkout']);
Route::middleware('throttle:60,1')->get('/orders/track/{orderNumber}', [OrderController::class, 'track']);
Route::post('/coupons/validate', [CouponController::class, 'validateCoupon']);

// Support Messages (Public submission)
Route::post('/contact/messages', [SupportMessageController::class, 'store']);

// Store Settings (Public view)
Route::get('/store-settings', [StoreSettingController::class, 'show']);


// ==========================================
// AUTHENTICATED ROUTES
// ==========================================
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    
    // User specific routes
    Route::get('/users/{userId}/orders', [OrderController::class, 'index']);
    
    // Reviews
    Route::post('/products/{product}/reviews', [ReviewController::class, 'store']);

    // Carts
    Route::get('/users/{userId}/cart', [CartController::class, 'show']);
    Route::post('/users/{userId}/cart/items', [CartController::class, 'addItem']);
    Route::patch('/users/{userId}/cart/items/{item}', [CartController::class, 'updateItem']);
    Route::delete('/users/{userId}/cart/items/{item}', [CartController::class, 'removeItem']);
    Route::delete('/users/{userId}/cart/items', [CartController::class, 'clear']);
    Route::post('/users/{userId}/cart/merge', [CartController::class, 'mergeGuestCart']);

    // Notifications
    Route::get('/users/{userId}/notifications', [NotificationController::class, 'index']);
    Route::post('/notifications', [NotificationController::class, 'store']);
    Route::patch('/notifications/{notification}/read', [NotificationController::class, 'markRead']);
    Route::delete('/notifications/{notification}', [NotificationController::class, 'destroy']);
});


// ==========================================
// ADMIN ROUTES
// ==========================================
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    
    // Admin Stats
    Route::get('/admin/stats', [AdminStatsController::class, 'index']);

    // Store Settings
    Route::patch('/store-settings', [StoreSettingController::class, 'update']);

    // Admin Products Management
    Route::post('/products', [ProductController::class, 'store']);
    Route::match(['put', 'patch'], '/products/{product}', [ProductController::class, 'update']);
    Route::delete('/products/{product}', [ProductController::class, 'destroy']);
    
    Route::post('/products/{product}/images', [ProductImageController::class, 'store']);
    Route::match(['put', 'patch'], '/product-images/{image}', [ProductImageController::class, 'update']);
    Route::delete('/product-images/{image}', [ProductImageController::class, 'destroy']);
    
    Route::post('/products/{product}/specs', [ProductSpecController::class, 'store']);
    Route::post('/products/{product}/variants', [ProductVariantController::class, 'store']);
    Route::match(['put', 'patch'], '/product-variants/{variant}', [ProductVariantController::class, 'update']);
    Route::delete('/product-variants/{variant}', [ProductVariantController::class, 'destroy']);

    // Image Upload
    Route::post('/images/upload', [ImageUploadController::class, 'store']);

    // Categories & Brands
    Route::post('/categories', [CatalogController::class, 'storeCategory']);
    Route::put('/categories/{category}', [CatalogController::class, 'updateCategory']);
    Route::delete('/categories/{category}', [CatalogController::class, 'deleteCategory']);
    
    Route::post('/brands', [CatalogController::class, 'storeBrand']);
    Route::put('/brands/{brand}', [CatalogController::class, 'updateBrand']);
    Route::delete('/brands/{brand}', [CatalogController::class, 'deleteBrand']);

    // Orders Management
    Route::get('/orders', [OrderController::class, 'index']);
    Route::match(['put', 'patch'], '/orders/{order}', [OrderController::class, 'update']);
    Route::patch('/orders/{order}/status', [OrderController::class, 'update']);

    // Support Messages Management
    Route::get('/support/messages', [SupportMessageController::class, 'index']);
    Route::patch('/support/messages/{message}/status', [SupportMessageController::class, 'updateStatus']);
    Route::post('/support/messages/{message}/reply', [SupportMessageController::class, 'reply']);
    Route::delete('/support/messages/{message}', [SupportMessageController::class, 'destroy']);

    // Global Notifications
    Route::get('/notifications/global', [NotificationController::class, 'index']);
});
