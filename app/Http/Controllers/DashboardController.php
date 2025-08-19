<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Absensi;
use App\Models\JadwalAbsensi;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'role:admin']);
    }

    /**
     * Render halaman Home dengan card summary
     */
    public function index(Request $request)
    {
        $tanggal = $request->input('tanggal', date('Y-m-d'));

        $cardData = $this->getCardData($tanggal);

        return Inertia::render('Home', [
            'cardData' => $cardData,
            'tanggal' => $tanggal,
        ]);
    }

    /**
     * API untuk fetch cardData berdasarkan tanggal (dipanggil frontend)
     */
    public function cardData(Request $request)
    {
        $tanggal = $request->input('tanggal', date('Y-m-d'));

        $cardData = $this->getCardData($tanggal);

        return response()->json([
            'cardData' => $cardData,
        ]);
    }

    /**
     * API untuk fetch data absensi per tanggal
     */
    public function attendance(Request $request)
    {
        $tanggal = $request->input('tanggal', date('Y-m-d'));

        $jadwalIds = JadwalAbsensi::where('tanggal', $tanggal)->pluck('id');

        $attendanceData = Absensi::with('user')
            ->whereIn('absensi_jadwal_id', $jadwalIds)
            ->get()
            ->map(function ($absensi) {
                return [
                    'id' => $absensi->user_id,
                    'nama' => $absensi->user->name,
                    'divisi' => $absensi->user->divisi ?? '-',
                    'tanggal' => $absensi->absensiJadwal->tanggal,
                    'jam_masuk' => $absensi->absensiJadwal->jam_mulai,
                    'jam_pulang' => $absensi->absensiJadwal->jam_selesai,
                    'status' => $absensi->status,
                ];
            });

        return response()->json([
            'data' => $attendanceData,
        ]);
    }

    /**
     * Helper function untuk menghitung card data
     */
    private function getCardData(string $tanggal): array
    {
        $jumlahKaryawan = User::role(['karyawan','staff','manager','cleaning service'])->count();

        $jadwalIds = JadwalAbsensi::where('tanggal', $tanggal)->pluck('id');

        $hadir = Absensi::whereIn('absensi_jadwal_id', $jadwalIds)
            ->where('status', 'Hadir')
            ->distinct('user_id')
            ->count('user_id');

        $terlambat = Absensi::whereIn('absensi_jadwal_id', $jadwalIds)
            ->where('status', 'Terlambat')
            ->distinct('user_id')
            ->count('user_id');

        $belumHadir = max(0, $jumlahKaryawan - ($hadir + $terlambat));

        return [
            'jumlah' => $jumlahKaryawan,
            'hadir' => $hadir,
            'terlambat' => $terlambat,
            'belumHadir' => $belumHadir,
        ];
    }
}
