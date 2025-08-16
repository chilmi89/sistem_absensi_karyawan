<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Permissions
        $permissions = [
            'manage karyawan',
            'view absensi',
            'input absensi',
            'create jadwal',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // 2. Roles
        $admin    = Role::firstOrCreate(['name' => 'admin']);
        $karyawan = Role::firstOrCreate(['name' => 'karyawan']);
        $staff    = Role::firstOrCreate(['name' => 'staff']);
        $manager  = Role::firstOrCreate(['name' => 'manager']);
        $cleaning = Role::firstOrCreate(['name' => 'cleaning service']);

        // 3. Assign Permissions
        $admin->givePermissionTo([
            'manage karyawan',
            'view absensi',
            'create jadwal',
        ]);

        // Semua role ini punya permission yang sama seperti karyawan
        $karyawanPermissions = [
            'input absensi',
            'view absensi',
        ];

        $karyawan->givePermissionTo($karyawanPermissions);
        $staff->givePermissionTo($karyawanPermissions);
        $manager->givePermissionTo($karyawanPermissions);
        $cleaning->givePermissionTo($karyawanPermissions);
    }
}
