<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name'     => 'Admin User',
            'email'    => 'admin@canteen.com',
            'password' => Hash::make('password'),
            'role'     => 'admin',
        ]);

        User::create([
            'name'     => 'Cashier User',
            'email'    => 'cashier@canteen.com',
            'password' => Hash::make('password'),
            'role'     => 'cashier',
        ]);

        $customers = [
            ['name' => 'Juan Dela Cruz',   'email' => 'juan@email.com'],
            ['name' => 'Maria Santos',     'email' => 'maria@email.com'],
            ['name' => 'Pedro Reyes',      'email' => 'pedro@email.com'],
            ['name' => 'Ana Garcia',       'email' => 'ana@email.com'],
            ['name' => 'Carlos Mendoza',   'email' => 'carlos@email.com'],
        ];

        foreach ($customers as $customer) {
            User::create([
                'name'     => $customer['name'],
                'email'    => $customer['email'],
                'password' => Hash::make('password'),
                'role'     => 'customer',
            ]);
        }
    }
}
