<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\MenuItem;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function dailySales()
    {
        $total = Order::whereDate('created_at', today())
            ->where('status', 'completed')
            ->sum('total_amount');

        return response()->json(['date' => today(), 'total' => $total]);
    }

    public function weeklySales()
    {
        $sales = Order::where('status', 'completed')
            ->where('created_at', '>=', now()->subDays(7))
            ->selectRaw('DATE(created_at) as date, SUM(total_amount) as total')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        return response()->json($sales);
    }

    public function monthlySales()
    {
        $sales = Order::where('status', 'completed')
            ->where('created_at', '>=', now()->subDays(30))
            ->selectRaw('DATE(created_at) as date, SUM(total_amount) as total')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        return response()->json($sales);
    }

    public function bestSellers()
    {
        $items = OrderItem::with('menuItem')
            ->selectRaw('menu_item_id, SUM(quantity) as total_qty, SUM(subtotal) as total_revenue')
            ->groupBy('menu_item_id')
            ->orderBy('total_qty', 'desc')
            ->limit(10)
            ->get();

        return response()->json($items);
    }

    public function orderVolume(Request $request)
    {
        $days = $request->get('days', 30);

        $volume = Order::where('created_at', '>=', now()->subDays($days))
            ->selectRaw('DATE(created_at) as date, COUNT(*) as total_orders')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        return response()->json($volume);
    }

    public function categoryBreakdown()
    {
        $breakdown = OrderItem::join('menu_items', 'order_items.menu_item_id', '=', 'menu_items.id')
            ->join('categories', 'menu_items.category_id', '=', 'categories.id')
            ->selectRaw('categories.name as category, SUM(order_items.subtotal) as total_revenue')
            ->groupBy('categories.name')
            ->orderBy('total_revenue', 'desc')
            ->get();

        return response()->json($breakdown);
    }

    public function summary()
    {
        $totalSales  = Order::where('status', 'completed')->sum('total_amount');
        $totalOrders = Order::count();
        $avgOrder    = $totalOrders > 0 ? $totalSales / $totalOrders : 0;

        return response()->json([
            'total_sales'   => $totalSales,
            'total_orders'  => $totalOrders,
            'average_order' => round($avgOrder, 2),
        ]);
    }
}
