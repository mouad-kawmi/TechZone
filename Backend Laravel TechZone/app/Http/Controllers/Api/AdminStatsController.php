<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\SupportMessage;
use App\Models\User;

class AdminStatsController extends Controller
{
    public function index(): array
    {
        return [
            'totalRevenue' => (float) Order::where('status', '!=', 'ANNULE')->sum('final_total'),
            'ordersCount' => Order::count(),
            'ordersByStatus' => Order::selectRaw('status, count(*) as total')->groupBy('status')->pluck('total', 'status'),
            'lowStockProducts' => Product::with(['category', 'brand', 'images', 'variants', 'reviews'])
                ->where('stock', '<=', 5)
                ->limit(10)
                ->get()
                ->map(fn (Product $product) => $product->toFrontendArray()),
            'topSellers' => Product::with(['category', 'brand', 'images', 'variants', 'reviews'])
                ->orderByDesc('reviews_count')
                ->limit(5)
                ->get()
                ->map(fn (Product $product) => $product->toFrontendArray()),
            'customersCount' => User::where('role', 'user')->count(),
            'recentOrders' => Order::with('items')->latest()->limit(5)->get()->map(fn (Order $order) => $order->toFrontendArray()),
            'recentMessages' => SupportMessage::latest()->limit(5)->get()->map(fn (SupportMessage $message) => $message->toFrontendArray()),
        ];
    }
}
