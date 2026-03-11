<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\MenuItem;
use App\Models\OrderItem;
use App\Models\InventoryLog;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function index()
    {
        return response()->json(
            Order::with(['customer', 'cashier', 'orderItems.menuItem'])
                ->orderBy('created_at', 'desc')
                ->get()
        );
    }

    public function store(Request $request)
    {
        $request->validate([
            'items'          => 'required|array|min:1',
            'items.*.menu_item_id' => 'required|exists:menu_items,id',
            'items.*.quantity'     => 'required|integer|min:1',
            'notes'          => 'nullable|string',
        ]);

        DB::beginTransaction();

        try {
            $totalAmount = 0;
            $orderItemsData = [];

            foreach ($request->items as $item) {
                $menuItem = MenuItem::findOrFail($item['menu_item_id']);
                $subtotal = $menuItem->price * $item['quantity'];
                $totalAmount += $subtotal;

                $orderItemsData[] = [
                    'menu_item_id' => $menuItem->id,
                    'quantity'     => $item['quantity'],
                    'unit_price'   => $menuItem->price,
                    'subtotal'     => $subtotal,
                ];

                // Deduct stock
                $menuItem->decrement('stock_qty', $item['quantity']);

                // Log inventory change
                InventoryLog::create([
                    'menu_item_id' => $menuItem->id,
                    'user_id'      => $request->user()->id,
                    'change_qty'   => -$item['quantity'],
                    'reason'       => 'Order placed',
                ]);
            }

            $orderCount = Order::count() + 1;
            $order = Order::create([
                'order_number'  => 'ORD-' . str_pad($orderCount, 5, '0', STR_PAD_LEFT),
                'user_id'       => $request->user()->id,
                'cashier_id'    => $request->user()->role === 'cashier' ? $request->user()->id : null,
                'total_amount'  => $totalAmount,
                'status'        => 'pending',
                'notes'         => $request->notes,
            ]);

            foreach ($orderItemsData as $itemData) {
                OrderItem::create(array_merge($itemData, ['order_id' => $order->id]));
            }

            DB::commit();

            return response()->json($order->load('orderItems.menuItem'), 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Order failed: ' . $e->getMessage()], 500);
        }
    }

    public function show(Order $order)
    {
        return response()->json(
            $order->load(['customer', 'cashier', 'orderItems.menuItem'])
        );
    }

    public function updateStatus(Request $request, Order $order)
    {
        $request->validate([
            'status' => 'required|in:pending,preparing,ready,completed,cancelled',
        ]);

        $order->update(['status' => $request->status]);

        return response()->json($order);
    }

    public function myOrders(Request $request)
    {
        $orders = Order::with('orderItems.menuItem')
            ->where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($orders);
    }
}
