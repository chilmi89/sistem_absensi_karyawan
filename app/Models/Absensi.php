<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Absensi extends Model
{
    use HasFactory;

    // Nama tabel
    protected $table = 'absensis';

    // Kolom yang bisa diisi
    protected $fillable = [
        'user_id',
        'absensi_jadwal_id', // pastikan sesuai dengan kolom di tabel
        'status',
        'waktu_scan'
    ];

    // Relasi ke User
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // Relasi ke AbsensiJadwal
    public function absensiJadwal()
    {
        return $this->belongsTo(JadwalAbsensi::class, 'absensi_jadwal_id', 'id');
    }
}
