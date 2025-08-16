<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use SimpleSoftwareIO\QrCode\Facades\QrCode;
use Spatie\Permission\Models\Role;

use Illuminate\Support\Str;
class KaryawanController extends Controller
{
    // Tampilkan halaman Personality + data karyawan & role
    public function index(Request $request)
    {
        $search = $request->get('search');

        $karyawan = User::role(['karyawan', 'staff', 'manager', 'cleaning service'])
            ->with('roles')
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->paginate(4);

        $roles = Role::whereIn('name', ['karyawan', 'staff', 'manager', 'cleaning service'])
            ->select('id', 'name')
            ->get();

        return Inertia::render('Admin/Personality', [
            'karyawan' => $karyawan,
            'roles'    => $roles,
            'filters'  => ['search' => $search]
        ]);
    }






    // Tambah karyawan baru + generate QR
    // Preview QR (SVG base64)
    public function previewQr(Request $request)
    {
        $request->validate(['qr_content' => 'required|string']);

        try {
            $qrSvg = QrCode::format('svg')->size(200)->generate($request->qr_content);
            $base64 = 'data:image/svg+xml;base64,' . base64_encode($qrSvg);

            return response()->json(['qr_base64' => $base64]);
        } catch (\Throwable $e) {
            Log::error('QR Preview Error: ' . $e->getMessage() . ' | Payload: ' . json_encode($request->all()));
            return response()->json(['error' => 'Gagal generate QR Code.'], 500);
        }
    }



    public function store(Request $request)
    {
        $request->validate([
            'nama' => 'required|string|max:255|unique:users,name',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'jabatan' => 'required|string|exists:roles,name',
        ]);

        // Generate qr_token unik di backend
        $qrToken = Str::uuid()->toString();

        // Buat user baru
        $user = User::create([
            'name' => $request->nama,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'qr_token' => $qrToken,
        ]);

        // Assign role
        $user->assignRole($request->jabatan);

        // Pastikan folder QR Code ada
        $qrFolder = storage_path('app/public/qrcodes');
        if (!file_exists($qrFolder)) {
            mkdir($qrFolder, 0777, true);
        }

        // Nama file QR
        $qrFileName = "user-{$user->id}.png";
        $qrFilePath = "$qrFolder/$qrFileName";

        // Jalankan Python untuk generate QR
        $pythonPath = base_path('.venv/Scripts/python.exe');
        $scriptPath = base_path('python/generate_qr.py');

        $command = "\"$pythonPath\" \"$scriptPath\" \"$qrToken\" \"$qrFilePath\"";
        exec($command, $output, $returnVar);

        if ($returnVar !== 0) {
            return back()->withErrors(['qr' => 'Gagal generate QR via Python']);
        }

        // Simpan path relatif QR code
        $user->update(['qr_code' => "qrcodes/$qrFileName"]);

        // Response ke Inertia, sertakan qr_token agar frontend bisa pakai saat edit
        return Inertia::render('Admin/Personality', [
            'success' => 'Karyawan & QR Code berhasil ditambahkan!',
            'karyawan' => $user->load('roles')->makeHidden(['password']),
        ]);
    }



    public function update(Request $request, User $user)
    {
        $request->validate([
            'nama' => 'required|string|max:255|unique:users,name,' . $user->id . ',id',
            'email' => 'required|email|unique:users,email,' . $user->id . ',id',
            'password' => 'nullable|string|min:6',
            'jabatan' => 'required|string|exists:roles,name',
            'qr_token' => 'nullable|string',
        ]);

        try {
            $user->name = $request->nama;
            $user->email = $request->email;

            if ($request->filled('qr_token')) {
                $user->qr_token = $request->qr_token;
            }

            if ($request->filled('password')) {
                $user->password = Hash::make($request->password);
            }

            $user->save();

            $user->syncRoles([$request->jabatan]);

            // Generate QR jika ada qr_token
            if ($user->qr_token) {
                $this->generateQrForUser($user, $user->qr_token);
            }

            return redirect()->route('karyawan.index')->with('success', 'Data karyawan berhasil diperbarui.');
        } catch (\Exception $e) {
            Log::error("Update user gagal: " . $e->getMessage());
            return back()->withErrors(['error' => 'Terjadi kesalahan saat menyimpan.']);
        }
    }


    private function generateQrForUser(User $user, string $token)
    {
        $qrFolder = storage_path('app/public/qrcodes');
        if (!file_exists($qrFolder)) {
            mkdir($qrFolder, 0777, true);
        }

        $qrFileName = "user-{$user->id}.png";
        $qrFilePath = "$qrFolder/$qrFileName";

        $pythonPath = base_path('.venv/Scripts/python.exe'); // sesuaikan path environment Anda
        $scriptPath = base_path('python/generate_qr.py');

        $command = "\"$pythonPath\" \"$scriptPath\" \"$token\" \"$qrFilePath\"";
        exec($command, $output, $returnVar);

        if ($returnVar === 0) {
            $user->update(['qr_code' => "qrcodes/$qrFileName"]);
        } else {
            Log::error("Gagal generate QR untuk user {$user->id}");
        }
    }




    public function destroy(User $user)
    {
        $user->delete();
        return redirect()->route('karyawan.index')->with('success', 'Data karyawan berhasil dihapus.');
    }
}
