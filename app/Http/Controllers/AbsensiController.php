<?php

namespace App\Http\Controllers;

use App\Models\Absensi;
use App\Models\JadwalAbsensi;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class AbsensiController extends Controller
{
    /**
     * Scan QR Code untuk absen
     * Endpoint: POST /absensi/scan
     */
    public function scan(Request $request)
    {
        // Validasi request
        $request->validate([
            'token' => 'required|string',
            'tanggal' => 'nullable|date', // tanggal opsional dari admin
        ]);

        // Cari user berdasarkan qr_token
        $user = User::where('qr_token', $request->token)->first();
        if (!$user) {
            return response()->json([
                'message' => 'QR code tidak valid',
            ], 400);
        }

        // Ambil tanggal yang dikirim admin, jika tidak ada gunakan hari ini
        $tanggalAbsensi = $request->tanggal ?? now()->toDateString();

        // Ambil jadwal absensi sesuai tanggal
        $jadwalHariIni = JadwalAbsensi::where('tanggal', $tanggalAbsensi)->first();
        if (!$jadwalHariIni) {
            return response()->json([
                'message' => 'Belum ada jadwal absensi untuk tanggal ini',
            ], 400);
        }

        // Cek apakah user sudah absen hari ini
        $absensi = Absensi::firstOrCreate(
            [
                'user_id' => $user->id,
                'absensi_jadwal_id' => $jadwalHariIni->id,
            ],
            [
                'status' => 'Hadir',
                'waktu_scan' => now(),
            ]
        );

        return response()->json([
            'message' => 'Absensi berhasil!',
            'data' => [
                'id' => $absensi->id,
                'nama' => $user->name,
                'divisi' => $user->getRoleNames()->first() ?? '-',
                'tanggal' => $jadwalHariIni->tanggal,
                'jamMasuk' => $jadwalHariIni->jam_mulai,
                'jamPulang' => $jadwalHariIni->jam_selesai,
                'status' => $absensi->status,
                'waktu_scan' => $absensi->waktu_scan,
            ],
        ], 200);
    }

    /**
     * Ambil semua data absensi untuk tabel
     * Endpoint: GET /absensi
     */
    public function index()
    {
        try {
            $absensi = Absensi::with(['user', 'absensiJadwal'])
                ->orderBy('waktu_scan', 'desc')
                ->get();

            $data = $absensi->map(function ($item) {
                return [
                    'id' => $item->id,
                    'nama' => optional($item->user)->name ?? '-',
                    'divisi' => optional($item->user)->getRoleNames()->first() ?? '-',
                    'tanggal' => optional($item->absensiJadwal)->tanggal ?? '-',
                    'jamMasuk' => optional($item->absensiJadwal)->jam_mulai ?? '-',
                    'jamPulang' => optional($item->absensiJadwal)->jam_selesai ?? '-',
                    'status' => $item->status ?? '-',
                    'waktu_scan' => $item->waktu_scan ?? '-',
                ];
            });

            // Ambil daftar tanggal unik untuk dropdown filter di frontend
            $availableDates = JadwalAbsensi::orderBy('tanggal', 'desc')
                ->pluck('tanggal')
                ->unique()
                ->values();

            return response()->json([
                'data' => $data,
                'availableDates' => $availableDates,
            ], 200);
        } catch (\Throwable $th) {
            Log::error('AbsensiController@index error: ' . $th->getMessage());
            return response()->json([
                'error' => 'Terjadi kesalahan server: ' . $th->getMessage()
            ], 500);
        }
    }
}
