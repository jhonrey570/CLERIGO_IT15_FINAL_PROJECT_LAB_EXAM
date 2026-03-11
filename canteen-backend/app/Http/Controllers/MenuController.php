<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\MenuItem;

class MenuController extends Controller
{
    public function index(Request $request)
    {
        $query = MenuItem::with('category');

        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        if ($request->has('available')) {
            $query->where('is_available', true);
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'category_id'         => 'required|exists:categories,id',
            'name'                => 'required|string|max:120',
            'description'         => 'nullable|string',
            'price'               => 'required|numeric|min:0',
            'stock_qty'           => 'integer|min:0',
            'low_stock_threshold' => 'integer|min:0',
            'is_available'        => 'boolean',
        ]);

        $item = MenuItem::create($request->all());

        return response()->json($item->load('category'), 201);
    }

    public function show(MenuItem $menuItem)
    {
        return response()->json($menuItem->load('category'));
    }

    public function update(Request $request, MenuItem $menuItem)
    {
        $request->validate([
            'category_id'         => 'exists:categories,id',
            'name'                => 'string|max:120',
            'description'         => 'nullable|string',
            'price'               => 'numeric|min:0',
            'stock_qty'           => 'integer|min:0',
            'low_stock_threshold' => 'integer|min:0',
            'is_available'        => 'boolean',
        ]);

        $menuItem->update($request->all());

        return response()->json($menuItem->load('category'));
    }

    public function destroy(MenuItem $menuItem)
    {
        $menuItem->delete();

        return response()->json(['message' => 'Menu item deleted successfully.']);
    }

    public function toggle(MenuItem $menuItem)
    {
        $menuItem->update(['is_available' => !$menuItem->is_available]);

        return response()->json($menuItem);
    }
}
