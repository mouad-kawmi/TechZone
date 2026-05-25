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

Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);
Route::get('/auth/me', [AuthController::class, 'me']);

Route::get('/products', [ProductController::class, 'index']);
Route::post('/products', [ProductController::class, 'store']);
Route::get('/products/{product}', [ProductController::class, 'show']);
Route::match(['put', 'patch'], '/products/{product}', [ProductController::class, 'update']);
Route::delete('/products/{product}', [ProductController::class, 'destroy']);
Route::post('/products/{product}/images', [ProductImageController::class, 'store']);
Route::match(['put', 'patch'], '/product-images/{image}', [ProductImageController::class, 'update']);
Route::delete('/product-images/{image}', [ProductImageController::class, 'destroy']);
Route::post('/products/{product}/specs', [ProductSpecController::class, 'store']);
Route::post('/products/{product}/variants', [ProductVariantController::class, 'store']);
Route::match(['put', 'patch'], '/product-variants/{variant}', [ProductVariantController::class, 'update']);
Route::delete('/product-variants/{variant}', [ProductVariantController::class, 'destroy']);
Route::post('/products/{product}/reviews', [ReviewController::class, 'store']);

Route::post('/images/upload', [ImageUploadController::class, 'store']);

Route::get('/categories', [CatalogController::class, 'categories']);
Route::post('/categories', [CatalogController::class, 'storeCategory']);
Route::put('/categories/{category}', [CatalogController::class, 'updateCategory']);
Route::delete('/categories/{category}', [CatalogController::class, 'deleteCategory']);
Route::get('/brands', [CatalogController::class, 'brands']);
Route::post('/brands', [CatalogController::class, 'storeBrand']);
Route::put('/brands/{brand}', [CatalogController::class, 'updateBrand']);
Route::delete('/brands/{brand}', [CatalogController::class, 'deleteBrand']);

Route::get('/users/{userId}/cart', [CartController::class, 'show']);
Route::post('/users/{userId}/cart/items', [CartController::class, 'addItem']);
Route::patch('/users/{userId}/cart/items/{item}', [CartController::class, 'updateItem']);
Route::delete('/users/{userId}/cart/items/{item}', [CartController::class, 'removeItem']);
Route::delete('/users/{userId}/cart/items', [CartController::class, 'clear']);
Route::post('/users/{userId}/cart/merge', [CartController::class, 'mergeGuestCart']);

Route::post('/coupons/validate', [CouponController::class, 'validateCoupon']);

Route::get('/orders', [OrderController::class, 'index']);
Route::get('/users/{userId}/orders', [OrderController::class, 'index']);
Route::post('/checkout', [OrderController::class, 'checkout']);
Route::post('/users/{userId}/checkout', [OrderController::class, 'checkout']);
Route::get('/orders/track/{orderNumber}', [OrderController::class, 'track']);
Route::match(['put', 'patch'], '/orders/{order}', [OrderController::class, 'update']);
Route::patch('/orders/{order}/status', [OrderController::class, 'update']);

Route::get('/support/messages', [SupportMessageController::class, 'index']);
Route::post('/contact/messages', [SupportMessageController::class, 'store']);
Route::patch('/support/messages/{message}/status', [SupportMessageController::class, 'updateStatus']);
Route::post('/support/messages/{message}/reply', [SupportMessageController::class, 'reply']);
Route::delete('/support/messages/{message}', [SupportMessageController::class, 'destroy']);

Route::get('/notifications/global', [NotificationController::class, 'index']);
Route::get('/users/{userId}/notifications', [NotificationController::class, 'index']);
Route::post('/notifications', [NotificationController::class, 'store']);
Route::patch('/notifications/{notification}/read', [NotificationController::class, 'markRead']);
Route::delete('/notifications/{notification}', [NotificationController::class, 'destroy']);

Route::get('/store-settings', [StoreSettingController::class, 'show']);
Route::patch('/store-settings', [StoreSettingController::class, 'update']);

Route::get('/admin/stats', [AdminStatsController::class, 'index']);
