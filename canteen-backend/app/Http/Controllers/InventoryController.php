<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\MenuItem;
use App\Models\InventoryLog;

class InventoryController extends Controller
{
    public function index()
    {
        return response()->json(
            MenuItem::with('category')
                ->orderBy('stock_qty', 'asc')
                ->get()
        );
    }

    public function lowStock()
    {
        $items = MenuItem::with('category')
            ->whereColumn('stock_qty', '<=', 'low_stock_threshold')
            ->get();

        return response()->json($items);
    }

    public function adjust(Request $request, MenuItem $menuItem)
    {
        $request->validate([
            'change_qty' => 'required|integer',
            'reason'     => 'required|string|max:200',
        ]);

        $menuItem->increment('stock_qty', $request->change_qty);

        InventoryLog::create([
            'menu_item_id' => $menuItem->id,
            'user_id'      => $request->user()->id,
            'change_qty'   => $request->change_qty,
            'reason'       => $request->reason,
        ]);

        return response()->json($menuItem);
    }

    public function bulkRestock(Request $request)
    {
        $request->validate([
            'items'              => 'required|array',
            'items.*.id'         => 'required|exists:menu_items,id',
            'items.*.stock_qty'  => 'required|integer|min:1',
        ]);

        foreach ($request->items as $item) {
            $menuItem = MenuItem::find($item['id']);
            $menuItem->increment('stock_qty', $item['stock_qty']);

            InventoryLog::create([
                'menu_item_id' => $menuItem->id,
                'user_id'      => $request->user()->id,
                'change_qty'   => $item['stock_qty'],
                'reason'       => 'Bulk restock',
            ]);
        }

        return response()->json(['message' => 'Bulk restock successful.']);
    }

    public function logs()
    {
        return response()->json(
            InventoryLog::with(['menuItem', 'user'])
                ->orderBy('created_at', 'desc')
                ->get()
        );
    }
}
