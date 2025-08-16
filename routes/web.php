<?php

use App\Http\Controllers\AbsensiController;
use App\Http\Controllers\CardController;
use App\Http\Controllers\JadwalAbsensiController;
use App\Http\Controllers\KaryawanController;

use App\Http\Controllers\ProductivityController;
use App\Http\Controllers\ProfileController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use SimpleSoftwareIO\QrCode\Facades\QrCode;




// Redirect root (/) langsung ke /home, wajib login
Route::get('/', function () {
    return Inertia::render('Home');
});

// Home (auth)
Route::get('/home', function () {
    return Inertia::render('Home');
})->middleware(['auth'])->name('Home');



// Dashboard (auth + verified)
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// Profile routes
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});




// Admin routes
Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::get('/admin/personality', [KaryawanController::class, 'index'])->name('karyawan.index');
    Route::post('/admin/personality', [KaryawanController::class, 'store'])->name('karyawan.store');
    Route::put('/admin/personality/{user}', [KaryawanController::class, 'update'])->name('karyawan.update');
    Route::delete('/admin/personality/{id}', [KaryawanController::class, 'destroy'])->name('karyawan.destroy');
});




Route::post('/admin/karyawan/preview-qrcode', [KaryawanController::class, 'previewQr'])->name('karyawan.preview-qr');

Route::middleware(['auth'])->group(function () {
    // Scan QR Code
    Route::post('/absensi/scan', [AbsensiController::class, 'scan'])->name('absensi.scan');
     Route::get('/absensi', [AbsensiController::class, 'index'])->name('absensi.index');
});


Route::get('/admin/productivity', [ProductivityController::class, 'index'])->name('admin.productivity');

Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::resource('jadwal', JadwalAbsensiController::class);
});



require __DIR__ . '/auth.php';
