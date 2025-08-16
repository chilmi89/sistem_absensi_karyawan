<?php

namespace App\Http\Controllers;

use App\Models\JadwalAbsensi;
use Illuminate\Http\Request;

class CardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $totalKaryawan = \App\Models\User::count();

        $hadir = \App\Models\Absensi::where('status', 'Hadir')->count();
        $izin = \App\Models\Absensi::where('status', 'Izin')->count();
        $sakit = \App\Models\Absensi::where('status', 'Sakit')->count();
        $alpa = \App\Models\Absensi::where('status', 'Alpa')->count();

        // contoh: terlambat dihitung dari waktu scan > jam_mulai jadwal
        $terlambat = \App\Models\Absensi::whereHas('absensiJadwal', function ($q) {
            $q->whereColumn('absensis.waktu_scan', '>', 'absensi_jadwals.jam_mulai');
        })->count();

        return inertia('Home', [
            'stats' => [
                'totalKaryawan' => $totalKaryawan,
                'hadir' => $hadir,
                'izin' => $izin,
                'sakit' => $sakit,
                'alpa' => $alpa,
                'terlambat' => $terlambat,
            ]
        ]);
    }


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
