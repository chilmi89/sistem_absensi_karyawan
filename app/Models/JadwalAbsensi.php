<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JadwalAbsensi extends Model
{
    use HasFactory;

    protected $table = 'absensi_jadwals';

    protected $fillable = [
        'nama_jadwal',
        'tanggal',
        'jam_mulai',
        'jam_selesai',
        'keterangan',
        'dibuat_oleh_admin_id', // opsional, kalau mau simpan siapa pembuatnya
    ];

    /**
     * Relasi ke absensi
     */
    public function absensis()
    {
        return $this->hasMany(Absensi::class, 'absensi_jadwal_id', 'id');
    }


    /**
     * Relasi ke admin pembuat jadwal
     */
    public function admin()
    {
        return $this->belongsTo(User::class, 'dibuat_oleh_admin_id');
    }
}
