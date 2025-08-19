<?php

use App\Http\Controllers\AbsensiController;
use App\Http\Controllers\CardController;
use App\Http\Controllers\DashboardController;
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
    return redirect()->route('dashboard.index');
});
// Home (auth)




Route::middleware(['auth' , 'role:admin'])->group(function () {
    Route::get('/home', [DashboardController::class, 'index'])->name('dashboard.index');
    Route::get('/dashboard/card-data', [DashboardController::class, 'cardData'])->name('dashboard.card-data');

});

// Profile routes
Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::get('/dashboard', function () {
        return redirect()->route('dashboard.index');
    })->name('dashboard');

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
