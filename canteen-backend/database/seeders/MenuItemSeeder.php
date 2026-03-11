<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\MenuItem;
use App\Models\Category;

class MenuItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $meals      = Category::where('name', 'Meals')->first()->id;
        $snacks     = Category::where('name', 'Snacks')->first()->id;
        $beverages  = Category::where('name', 'Beverages')->first()->id;
        $desserts   = Category::where('name', 'Desserts')->first()->id;
        $combos     = Category::where('name', 'Combos')->first()->id;

        $items = [
            // Meals
            ['category_id' => $meals, 'name' => 'Chicken Adobo Rice',      'price' => 65,  'stock_qty' => 50],
            ['category_id' => $meals, 'name' => 'Pork Sinigang',            'price' => 75,  'stock_qty' => 40],
            ['category_id' => $meals, 'name' => 'Beef Caldereta',           'price' => 85,  'stock_qty' => 35],
            ['category_id' => $meals, 'name' => 'Fried Chicken Rice',       'price' => 70,  'stock_qty' => 60],
            ['category_id' => $meals, 'name' => 'Pinakbet Rice',            'price' => 60,  'stock_qty' => 45],
            ['category_id' => $meals, 'name' => 'Pork BBQ Rice',            'price' => 75,  'stock_qty' => 50],
            ['category_id' => $meals, 'name' => 'Tinolang Manok',           'price' => 70,  'stock_qty' => 30],
            ['category_id' => $meals, 'name' => 'Bangus Sisig Rice',        'price' => 80,  'stock_qty' => 40],

            // Snacks
            ['category_id' => $snacks, 'name' => 'Lumpiang Shanghai',       'price' => 25,  'stock_qty' => 80],
            ['category_id' => $snacks, 'name' => 'Kikiam',                  'price' => 15,  'stock_qty' => 100],
            ['category_id' => $snacks, 'name' => 'Fishball',                'price' => 10,  'stock_qty' => 120],
            ['category_id' => $snacks, 'name' => 'Cheese Bread',            'price' => 20,  'stock_qty' => 60],
            ['category_id' => $snacks, 'name' => 'Pandesal',                'price' => 8,   'stock_qty' => 150],
            ['category_id' => $snacks, 'name' => 'Hotdog on Stick',         'price' => 20,  'stock_qty' => 90],
            ['category_id' => $snacks, 'name' => 'Squid Balls',             'price' => 15,  'stock_qty' => 100],

            // Beverages
            ['category_id' => $beverages, 'name' => 'Bottled Water',        'price' => 15,  'stock_qty' => 200],
            ['category_id' => $beverages, 'name' => 'Iced Coffee',          'price' => 40,  'stock_qty' => 80],
            ['category_id' => $beverages, 'name' => 'Softdrinks (Can)',      'price' => 35,  'stock_qty' => 100],
            ['category_id' => $beverages, 'name' => 'Fresh Buko Juice',     'price' => 30,  'stock_qty' => 60],
            ['category_id' => $beverages, 'name' => 'Hot Coffee',           'price' => 25,  'stock_qty' => 70],
            ['category_id' => $beverages, 'name' => 'Chocolate Milk',       'price' => 30,  'stock_qty' => 80],
            ['category_id' => $beverages, 'name' => 'Fruit Juice Tetra',    'price' => 20,  'stock_qty' => 90],

            // Desserts
            ['category_id' => $desserts, 'name' => 'Halo-Halo',             'price' => 55,  'stock_qty' => 40],
            ['category_id' => $desserts, 'name' => 'Leche Flan',            'price' => 35,  'stock_qty' => 50],
            ['category_id' => $desserts, 'name' => 'Buko Pandan',           'price' => 30,  'stock_qty' => 45],
            ['category_id' => $desserts, 'name' => 'Mais con Yelo',         'price' => 25,  'stock_qty' => 55],
            ['category_id' => $desserts, 'name' => 'Banana Cue',            'price' => 15,  'stock_qty' => 70],

            // Combos
            ['category_id' => $combos, 'name' => 'Chicken Combo',           'price' => 99,  'stock_qty' => 40],
            ['category_id' => $combos, 'name' => 'Pork BBQ Combo',          'price' => 105, 'stock_qty' => 35],
            ['category_id' => $combos, 'name' => 'Bangus Combo',            'price' => 110, 'stock_qty' => 30],
            ['category_id' => $combos, 'name' => 'Snack Combo',             'price' => 45,  'stock_qty' => 60],
        ];

        foreach ($items as $item) {
            MenuItem::create(array_merge($item, [
                'description'       => 'Freshly prepared ' . $item['name'],
                'low_stock_threshold' => 5,
                'is_available'      => true,
            ]));
        }
    }
}
