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

    public function weeklySales(Request $request)
    {
        $query = Order::where('status', 'completed');

        if ($request->has('start_date') && $request->has('end_date')) {
            $query->whereBetween('created_at', [$request->start_date . ' 00:00:00', $request->end_date . ' 23:59:59']);
        } else {
            $query->where('created_at', '>=', now()->subDays(7));
        }

        $sales = $query->selectRaw('DATE(created_at) as date, SUM(total_amount) as total')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        return response()->json($sales);
    }

    public function monthlySales(Request $request)
    {
        $query = Order::where('status', 'completed');

        if ($request->has('start_date') && $request->has('end_date')) {
            $query->whereBetween('created_at', [$request->start_date . ' 00:00:00', $request->end_date . ' 23:59:59']);
        } else {
            $query->where('created_at', '>=', now()->subDays(30));
        }

        $sales = $query->selectRaw('DATE(created_at) as date, SUM(total_amount) as total')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        return response()->json($sales);
    }

    public function bestSellers(Request $request)
    {
        $query = OrderItem::with('menuItem');

        if ($request->has('start_date') && $request->has('end_date')) {
            $query->whereHas('order', function ($q) use ($request) {
                $q->whereBetween('created_at', [$request->start_date . ' 00:00:00', $request->end_date . ' 23:59:59']);
            });
        }

        $items = $query->selectRaw('menu_item_id, SUM(quantity) as total_qty, SUM(subtotal) as total_revenue')
            ->groupBy('menu_item_id')
            ->orderBy('total_qty', 'desc')
            ->limit(10)
            ->get();

        return response()->json($items);
    }

    public function orderVolume(Request $request)
    {
        $query = Order::query();

        if ($request->has('start_date') && $request->has('end_date')) {
            $query->whereBetween('created_at', [$request->start_date . ' 00:00:00', $request->end_date . ' 23:59:59']);
        } else {
            $days = $request->get('days', 30);
            $query->where('created_at', '>=', now()->subDays($days));
        }

        $volume = $query->selectRaw('DATE(created_at) as date, COUNT(*) as total_orders')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        return response()->json($volume);
    }

    public function categoryBreakdown(Request $request)
    {
        $query = OrderItem::join('menu_items', 'order_items.menu_item_id', '=', 'menu_items.id')
            ->join('categories', 'menu_items.category_id', '=', 'categories.id');

        if ($request->has('start_date') && $request->has('end_date')) {
            $query->whereHas('order', function ($q) use ($request) {
                $q->whereBetween('created_at', [$request->start_date . ' 00:00:00', $request->end_date . ' 23:59:59']);
            });
        }

        $breakdown = $query->selectRaw('categories.name as category, SUM(order_items.subtotal) as total_revenue')
            ->groupBy('categories.name')
            ->orderBy('total_revenue', 'desc')
            ->get();

        return response()->json($breakdown);
    }

    public function summary(Request $request)
    {
        $query = Order::where('status', 'completed');

        if ($request->has('start_date') && $request->has('end_date')) {
            $query->whereBetween('created_at', [$request->start_date . ' 00:00:00', $request->end_date . ' 23:59:59']);
        }

        $totalSales  = $query->sum('total_amount');
        $totalOrders = $query->count();
        $avgOrder    = $totalOrders > 0 ? $totalSales / $totalOrders : 0;

        return response()->json([
            'total_sales'   => $totalSales,
            'total_orders'  => $totalOrders,
            'average_order' => round($avgOrder, 2),
        ]);
    }
}