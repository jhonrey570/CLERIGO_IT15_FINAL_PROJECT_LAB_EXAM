<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\InventoryController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\UserController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me',      [AuthController::class, 'me']);

    Route::get('/categories',            [CategoryController::class, 'index']);
    Route::get('/categories/{category}', [CategoryController::class, 'show']);
    Route::middleware('role:admin')->group(function () {
        Route::post('/categories',              [CategoryController::class, 'store']);
        Route::put('/categories/{category}',    [CategoryController::class, 'update']);
        Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);
    });

    Route::get('/menu-items',            [MenuController::class, 'index']);
    Route::get('/menu-items/{menuItem}', [MenuController::class, 'show']);
    Route::middleware('role:admin')->group(function () {
        Route::post('/menu-items',                    [MenuController::class, 'store']);
        Route::put('/menu-items/{menuItem}',          [MenuController::class, 'update']);
        Route::delete('/menu-items/{menuItem}',       [MenuController::class, 'destroy']);
        Route::patch('/menu-items/{menuItem}/toggle', [MenuController::class, 'toggle']);
    });

    Route::get('/orders/my-orders',   [OrderController::class, 'myOrders']);
    Route::post('/orders',            [OrderController::class, 'store']);
    Route::middleware('role:admin,cashier')->group(function () {
        Route::get('/orders',                  [OrderController::class, 'index']);
        Route::get('/orders/{order}',          [OrderController::class, 'show']);
        Route::patch('/orders/{order}/status', [OrderController::class, 'updateStatus']);
    });

    Route::middleware('role:admin,cashier')->group(function () {
        Route::get('/inventory',                     [InventoryController::class, 'index']);
        Route::get('/inventory/low-stock',           [InventoryController::class, 'lowStock']);
        Route::get('/inventory/logs',                [InventoryController::class, 'logs']);
        Route::patch('/inventory/{menuItem}/adjust', [InventoryController::class, 'adjust']);
    });
    Route::middleware('role:admin')->group(function () {
        Route::post('/inventory/bulk-restock', [InventoryController::class, 'bulkRestock']);
    });

    Route::middleware('role:admin')->group(function () {
        Route::get('/reports/daily-sales',        [ReportController::class, 'dailySales']);
        Route::get('/reports/weekly-sales',       [ReportController::class, 'weeklySales']);
        Route::get('/reports/monthly-sales',      [ReportController::class, 'monthlySales']);
        Route::get('/reports/best-sellers',       [ReportController::class, 'bestSellers']);
        Route::get('/reports/order-volume',       [ReportController::class, 'orderVolume']);
        Route::get('/reports/category-breakdown', [ReportController::class, 'categoryBreakdown']);
        Route::get('/reports/summary',            [ReportController::class, 'summary']);
    });

    Route::middleware('role:admin')->group(function () {
        Route::get('/users',           [UserController::class, 'index']);
        Route::post('/users',          [UserController::class, 'store']);
        Route::get('/users/{user}',    [UserController::class, 'show']);
        Route::put('/users/{user}',    [UserController::class, 'update']);
        Route::delete('/users/{user}', [UserController::class, 'destroy']);
    });
});