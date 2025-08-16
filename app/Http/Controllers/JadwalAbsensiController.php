<?php

namespace App\Http\Controllers;

use App\Models\JadwalAbsensi;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;


class JadwalAbsensiController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $jadwal = JadwalAbsensi::with('admin')->latest()->paginate(5);

        return Inertia::render('Admin/JadwalAbsensi/Index', [
            'jadwal' => $jadwal,

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
        $validated = $request->validate([
            'tanggal' => 'required|date',
            'jam_mulai' => 'required',
            'jam_selesai' => 'required',
            'keterangan' => 'nullable|string',
            'dibuat_oleh_admin_id' => 'required|exists:users,id',
        ]);

        JadwalAbsensi::create($validated);

        // Render Inertia dengan data terbaru
        $jadwal = JadwalAbsensi::with('admin')->latest()->get();
        return Inertia::render('Admin/JadwalAbsensi/Index', [
            'jadwal' => $jadwal,
        ])->with('success', 'Jadwal berhasil ditambahkan');
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
