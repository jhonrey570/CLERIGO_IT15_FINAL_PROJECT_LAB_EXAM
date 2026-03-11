<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            ['name' => 'Meals',      'description' => 'Full meal options including rice meals and viands'],
            ['name' => 'Snacks',     'description' => 'Light snacks and finger foods'],
            ['name' => 'Beverages',  'description' => 'Hot and cold drinks'],
            ['name' => 'Desserts',   'description' => 'Sweet treats and desserts'],
            ['name' => 'Combos',     'description' => 'Value combo meals with drink included'],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
