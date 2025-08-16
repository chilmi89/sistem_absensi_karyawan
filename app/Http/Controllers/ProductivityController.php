<?php

namespace App\Http\Controllers;

use App\Models\Absensi;
use App\Models\JadwalAbsensi;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class ProductivityController extends Controller
{
    public function index()
    {
        // Statistik hadir/alpa/izin/sakit
        $statusCounts = Absensi::select('status', DB::raw('COUNT(*) as total'))
            ->groupBy('status')
            ->pluck('total', 'status');

        // Produktivitas per bulan → ambil dari jadwal_absensis.tanggal
        $monthlyData = DB::table('absensis')
            ->join('absensi_jadwals', 'absensis.absensi_jadwal_id', '=', 'absensi_jadwals.id')
            ->select(
                DB::raw('MONTH(absensi_jadwals.tanggal) as bulan'),
                DB::raw('COUNT(absensis.id) as total')
            )
            ->where('absensis.status', 'Hadir')
            ->groupBy(DB::raw('MONTH(absensi_jadwals.tanggal)'))
            ->orderBy(DB::raw('MONTH(absensi_jadwals.tanggal)'))
            ->get()
            ->map(function ($row) {
                return [
                    'bulan' => $row->bulan,
                    'total' => $row->total,
                ];
            });

        return Inertia::render('Admin/Productivity', [
            'statusCounts' => $statusCounts,
            'monthlyData' => $monthlyData,
        ]);
    }
}
