<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\SupportMessage;
use App\Models\User;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class AdminStatsController extends Controller
{
    public function index(): array
    {
        $now = Carbon::now();

        // ── Revenue & Orders ──────────────────────────────────────────────
        $totalRevenue = (float) Order::where('status', '!=', 'ANNULE')->sum('final_total');
        $ordersCount  = Order::count();

        // ── Period comparisons ────────────────────────────────────────────
        $periods = [
            'today' => [
                'current'  => [$now->copy()->startOfDay(),           $now->copy()->endOfDay()],
                'previous' => [$now->copy()->subDay()->startOfDay(),  $now->copy()->subDay()->endOfDay()],
            ],
            'week' => [
                'current'  => [$now->copy()->subDays(6)->startOfDay(), $now->copy()->endOfDay()],
                'previous' => [$now->copy()->subDays(13)->startOfDay(), $now->copy()->subDays(7)->endOfDay()],
            ],
            'month' => [
                'current'  => [$now->copy()->startOfMonth(),          $now->copy()->endOfMonth()],
                'previous' => [$now->copy()->subMonth()->startOfMonth(), $now->copy()->subMonth()->endOfMonth()],
            ],
            'year' => [
                'current'  => [$now->copy()->startOfYear(),           $now->copy()->endOfYear()],
                'previous' => [$now->copy()->subYear()->startOfYear(), $now->copy()->subYear()->endOfYear()],
            ],
        ];

        $periodStats = [];
        foreach ($periods as $key => $range) {
            $current  = $this->periodRevenue($range['current'][0],  $range['current'][1]);
            $previous = $this->periodRevenue($range['previous'][0], $range['previous'][1]);
            $periodStats[$key] = array_merge($current, [
                'previousRevenue' => $previous['revenue'],
                'previousOrders'  => $previous['ordersCount'],
                'revenueTrend'    => $this->percentChange($current['revenue'],     $previous['revenue']),
                'ordersTrend'     => $this->percentChange($current['ordersCount'], $previous['ordersCount']),
            ]);
        }

        // ── Monthly revenue series (last 12 months) ───────────────────────
        $monthlyRevenue = Order::where('status', '!=', 'ANNULE')
            ->where('created_at', '>=', $now->copy()->subMonths(11)->startOfMonth())
            ->select(
                DB::raw("DATE_FORMAT(created_at, '%Y-%m') as month"),
                DB::raw('SUM(final_total) as revenue'),
                DB::raw('COUNT(*) as orders')
            )
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->keyBy('month');

        // Build a full 12-month array (fill missing months with 0)
        $monthlySeries = [];
        for ($i = 11; $i >= 0; $i--) {
            $key = $now->copy()->subMonths($i)->format('Y-m');
            $monthlySeries[] = [
                'month'   => $key,
                'label'   => Carbon::createFromFormat('Y-m', $key)->locale('fr')->isoFormat('MMM YYYY'),
                'revenue' => (float) ($monthlyRevenue[$key]->revenue ?? 0),
                'orders'  => (int)   ($monthlyRevenue[$key]->orders  ?? 0),
            ];
        }

        // ── Daily revenue series (last 30 days) ───────────────────────────
        $dailyRevenue = Order::where('status', '!=', 'ANNULE')
            ->where('created_at', '>=', $now->copy()->subDays(29)->startOfDay())
            ->select(
                DB::raw("DATE(created_at) as day"),
                DB::raw('SUM(final_total) as revenue'),
                DB::raw('COUNT(*) as orders')
            )
            ->groupBy('day')
            ->orderBy('day')
            ->get()
            ->keyBy('day');

        $dailySeries = [];
        for ($i = 29; $i >= 0; $i--) {
            $key = $now->copy()->subDays($i)->format('Y-m-d');
            $dailySeries[] = [
                'day'     => $key,
                'label'   => Carbon::parse($key)->locale('fr')->isoFormat('D MMM'),
                'revenue' => (float) ($dailyRevenue[$key]->revenue ?? 0),
                'orders'  => (int)   ($dailyRevenue[$key]->orders  ?? 0),
            ];
        }

        // ── Orders by status ──────────────────────────────────────────────
        $ordersByStatus = Order::selectRaw('status, count(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status');

        // ── Product breakdown ─────────────────────────────────────────────
        $totalStock = (int) Product::sum('stock');

        $categoryBreakdown = DB::table('products')
            ->join('categories', 'products.category_id', '=', 'categories.id')
            ->select('categories.name', DB::raw('SUM(products.stock) as stock'))
            ->groupBy('categories.name')
            ->orderByDesc('stock')
            ->get()
            ->map(fn($row) => ['name' => $row->name, 'stock' => (int) $row->stock])
            ->toArray();

        $lowStockProducts = Product::with(['category', 'brand', 'images', 'variants', 'reviews'])
            ->where('stock', '>', 0)
            ->where('stock', '<=', 5)
            ->orderBy('stock')
            ->limit(10)
            ->get()
            ->map(fn(Product $p) => $p->toFrontendArray());

        $topSellers = Product::with(['category', 'brand', 'images', 'variants', 'reviews'])
            ->orderByDesc('reviews_count')
            ->limit(5)
            ->get()
            ->map(fn(Product $p) => $p->toFrontendArray());

        // ── Customers ────────────────────────────────────────────────────
        $customersCount = User::where('role', 'user')->count();

        // ── Recent activity ───────────────────────────────────────────────
        $recentOrders = Order::with('items')
            ->latest()
            ->limit(5)
            ->get()
            ->map(fn(Order $o) => $o->toFrontendArray());

        $recentMessages = SupportMessage::latest()
            ->limit(5)
            ->get()
            ->map(fn(SupportMessage $m) => $m->toFrontendArray());

        return [
            // Global KPIs
            'totalRevenue'      => $totalRevenue,
            'ordersCount'       => $ordersCount,
            'customersCount'    => $customersCount,
            'totalStock'        => $totalStock,

            // Period KPIs (today / week / month / year)
            'periodStats'       => $periodStats,

            // Charts
            'monthlySeries'     => $monthlySeries,
            'dailySeries'       => $dailySeries,

            // Orders breakdown
            'ordersByStatus'    => $ordersByStatus,

            // Products
            'categoryBreakdown' => $categoryBreakdown,
            'lowStockProducts'  => $lowStockProducts,
            'topSellers'        => $topSellers,

            // Recent
            'recentOrders'      => $recentOrders,
            'recentMessages'    => $recentMessages,
        ];
    }

    // ── Helpers ───────────────────────────────────────────────────────────

    private function periodRevenue(Carbon $start, Carbon $end): array
    {
        $rows = Order::where('status', '!=', 'ANNULE')
            ->whereBetween('created_at', [$start, $end]);

        return [
            'revenue'      => (float) $rows->sum('final_total'),
            'ordersCount'  => (int)   Order::whereBetween('created_at', [$start, $end])->count(),
            'delivered'    => (int)   Order::where('status', 'LIVRE')->whereBetween('created_at', [$start, $end])->count(),
            'canceled'     => (int)   Order::where('status', 'ANNULE')->whereBetween('created_at', [$start, $end])->count(),
        ];
    }

    private function percentChange(float $current, float $previous): string
    {
        if ($previous == 0 && $current == 0) return '0%';
        if ($previous == 0) return '+100%';
        $val = (($current - $previous) / $previous) * 100;
        return ($val >= 0 ? '+' : '') . number_format($val, 1) . '%';
    }
}
