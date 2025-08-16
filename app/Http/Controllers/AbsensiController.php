<?php

namespace App\Http\Controllers;

use App\Models\Absensi;
use App\Models\JadwalAbsensi;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AbsensiController extends Controller
{
    /**
     * Scan QR Code untuk absen
     * Endpoint: POST /absensi/scan
     */

    
    public function scan(Request $request)
    {
        $request->validate([
            'token' => 'required|string',
        ]);

        // Cari user berdasarkan qr_token
        $user = User::where('qr_token', $request->token)->first();

        if (!$user) {
            return response()->json([
                'message' => 'QR code tidak valid'
            ], 404);
        }

        // Ambil jadwal absensi hari ini
        $jadwalHariIni = JadwalAbsensi::whereDate('tanggal', now()->format('Y-m-d'))->first();

        if (!$jadwalHariIni) {
            return response()->json([
                'message' => 'Belum ada jadwal absensi hari ini'
            ], 400);
        }

        // Cek apakah user sudah absen hari ini
        $absensi = Absensi::firstOrCreate(
            [
                'user_id' => $user->id,
                'absensi_jadwal_id' => $jadwalHariIni->id
            ],
            [
                'status' => 'Hadir',
                'waktu_scan' => now()
            ]
        );

        // Kembalikan data absensi terbaru ke frontend
        return response()->json([
            'message' => 'Absensi berhasil!',
            'data' => [
                'id' => $absensi->id,
                'nama' => $user->name,
                'divisi' => $user->getRoleNames()->first() ?? '-', // role Spatie sebagai divisi
                'tanggal' => $jadwalHariIni->tanggal,
                'jamMasuk' => $jadwalHariIni->jam_mulai,
                'jamPulang' => $jadwalHariIni->jam_selesai,
                'status' => $absensi->status,
                'waktu_scan' => $absensi->waktu_scan
            ]
        ], 200);
    }

    public function index(Request $request)
    {
        // Ambil semua tanggal jadwal admin (unik, untuk dropdown)
        $availableDates = \App\Models\JadwalAbsensi::orderBy('tanggal', 'asc')
            ->pluck('tanggal')
            ->unique()
            ->values();

        // Ambil absensi user jika sudah ada
        $query = \App\Models\Absensi::with(['user', 'absensiJadwal'])->orderBy('waktu_scan', 'desc');

        if ($request->has('tanggal') && $request->tanggal) {
            $query->whereHas('absensiJadwal', function ($q) use ($request) {
                $q->whereDate('tanggal', $request->tanggal);
            });
        }

        $absensi = $query->get();

        $data = $absensi->map(function ($item) {
            return [
                'id' => $item->id,
                'nama' => $item->user->name ?? '-',
                'divisi' => $item->user->getRoleNames()->first() ?? '-',
                'tanggal' => $item->absensiJadwal->tanggal ?? '-',
                'jamMasuk' => $item->absensiJadwal->jam_mulai ?? '-',
                'jamPulang' => $item->absensiJadwal->jam_selesai ?? '-',
                'status' => $item->status ?? 'Belum Absen',
                'waktu_scan' => $item->waktu_scan,
            ];
        });

        return response()->json([
            'data' => $data,
            'availableDates' => $availableDates
        ], 200);
    }
}
