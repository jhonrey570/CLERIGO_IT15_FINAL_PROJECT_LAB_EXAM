<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\MenuItem;
use App\Models\User;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $customers  = User::where('role', 'customer')->get();
        $cashier    = User::where('role', 'cashier')->first();
        $menuItems  = MenuItem::all();
        $statuses   = ['pending', 'preparing', 'ready', 'completed', 'cancelled'];

        for ($i = 1; $i <= 200; $i++) {
            $customer     = $customers->random();
            $status       = $statuses[array_rand($statuses)];
            $orderNumber  = 'ORD-' . str_pad($i, 5, '0', STR_PAD_LEFT);

            $selectedItems = $menuItems->random(rand(1, 4));
            $totalAmount   = 0;
            $orderItemsData = [];

            foreach ($selectedItems as $item) {
                $quantity  = rand(1, 3);
                $subtotal  = $item->price * $quantity;
                $totalAmount += $subtotal;

                $orderItemsData[] = [
                    'menu_item_id' => $item->id,
                    'quantity'     => $quantity,
                    'unit_price'   => $item->price,
                    'subtotal'     => $subtotal,
                ];
            }

            $order = Order::create([
                'order_number'  => $orderNumber,
                'user_id'       => $customer->id,
                'cashier_id'    => $cashier->id,
                'total_amount'  => $totalAmount,
                'status'        => $status,
                'notes'         => null,
                'created_at'    => now()->subDays(rand(0, 30))->subHours(rand(0, 23)),
                'updated_at'    => now()->subDays(rand(0, 10)),
            ]);

            foreach ($orderItemsData as $itemData) {
                OrderItem::create(array_merge($itemData, ['order_id' => $order->id]));
            }
        }
    }
}
