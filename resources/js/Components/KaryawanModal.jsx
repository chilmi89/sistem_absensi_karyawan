import { useState } from "react";
import axios from "axios";

export default function KaryawanModal({
    isOpen,
    onClose,
    onSave,
    form,
    setForm,
    roles,
    errors = {},
    isEditMode = false
}) {
    const [qrPreview, setQrPreview] = useState(null);
    const [loadingQr, setLoadingQr] = useState(false);

    if (!isOpen) return null;

    const handleGenerateQr = async () => {
        if (!form.nama) return alert("Isi nama dulu untuk generate QR!");

        try {
            setLoadingQr(true);
            const response = await axios.post("/admin/karyawan/preview-qrcode", {
                qr_content: form.nama
            });
            setQrPreview(response.data.qr_base64);
            setForm({ ...form, qr_token: form.nama });
        } catch (err) {
            console.error(err);
            alert("Gagal generate QR code!");
        } finally {
            setLoadingQr(false);
        }
    };

    const handleSave = () => {
        if (!form.nama || !form.jabatan || !form.email || (!isEditMode && !form.password)) {
            alert("Semua field wajib diisi!");
            return;
        }
        onSave();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
            <div className="bg-gray-900 p-6 rounded-lg shadow-xl w-96 max-h-[90vh] overflow-y-auto">
                <h3 className="text-xl font-bold mb-4 text-white text-center">
                    {isEditMode ? "Edit Karyawan" : "Tambah Karyawan"}
                </h3>

                <div className="flex flex-col space-y-3">
                    {/* Nama */}
                    <div>
                        <input
                            type="text"
                            placeholder="Nama"
                            value={form.nama}
                            onChange={e => setForm({ ...form, nama: e.target.value })}
                            className="w-full bg-gray-800 text-white border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        {errors.nama && <p className="text-red-500 text-sm">{errors.nama[0]}</p>}
                    </div>

                    {/* Jabatan */}
                    <div>
                        <select
                            value={form.jabatan}
                            onChange={e => setForm({ ...form, jabatan: e.target.value })}
                            className="w-full bg-gray-800 text-white border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            <option value="">Pilih Jabatan</option>
                            {roles.map(role => (
                                <option key={role.id} value={role.name}>
                                    {role.name}
                                </option>
                            ))}
                        </select>
                        {errors.jabatan && <p className="text-red-500 text-sm">{errors.jabatan[0]}</p>}
                    </div>

                    {/* Email */}
                    <div>
                        <input
                            type="email"
                            placeholder="Email"
                            value={form.email}
                            onChange={e => setForm({ ...form, email: e.target.value })}
                            className="w-full bg-gray-800 text-white border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email[0]}</p>}
                    </div>

                    {/* Password */}
                    <div>
                        <input
                            type="password"
                            placeholder={isEditMode ? "Password (opsional)" : "Password"}
                            value={form.password}
                            onChange={e => setForm({ ...form, password: e.target.value })}
                            className="w-full bg-gray-800 text-white border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        {errors.password && <p className="text-red-500 text-sm">{errors.password[0]}</p>}
                    </div>
                </div>

                {/* QR Code */}
                <div className="mt-3 flex flex-col items-center">
                    <button
                        onClick={handleGenerateQr}
                        disabled={loadingQr}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        {loadingQr ? "Loading..." : "Generate QR"}
                    </button>
                    {qrPreview && (
                        <img
                            src={qrPreview}
                            alt="QR Preview"
                            className="w-24 h-24 border mt-3 rounded bg-white p-1"
                        />
                    )}
                </div>

                {/* Tombol Aksi */}
                <div className="flex justify-end space-x-3 mt-6">
                    <button
                        onClick={onClose}
                        className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-500"
                    >
                        Batal
                    </button>
                    <button
                        onClick={handleSave}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                        Simpan
                    </button>
                </div>
            </div>
        </div>
    );
}
