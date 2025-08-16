import React, { useEffect } from "react";
import "@/../css/JadwalModal.css";

export default function JadwalModal({
    show = false,
    isEditMode = false,
    form,
    setForm,
    onSave,
    onClose,
    currentAdmin = { id: null, name: "" },
}) {
    // Reset form saat modal dibuka untuk mode tambah
    useEffect(() => {
        if (show && !isEditMode) {
            setForm({
                id: null,
                tanggal: "",
                jam_mulai: "",
                jam_selesai: "",
                keterangan: "",
            });
        }
    }, [show, isEditMode, setForm]);

    return (
        <div className={`fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 ${!show ? "hidden" : ""}`}>
            <div className="rgb-border w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="modal-content p-6 bg-gray-900 rounded-lg">
                    <h2 className="text-xl font-bold mb-4 text-center">
                        {isEditMode ? "Edit Jadwal Absensi" : "Tambah Jadwal Absensi"}
                    </h2>

                    <form
                        onSubmit={onSave}
                        className="space-y-4"
                    >
                        <input
                            type="date"
                            value={form.tanggal || ""}
                            onChange={(e) => setForm({ ...form, tanggal: e.target.value })}
                            className="bg-gray-800 border border-gray-700 p-2 rounded w-full"
                            required
                        />
                        <input
                            type="time"
                            value={form.jam_mulai || ""}
                            onChange={(e) => setForm({ ...form, jam_mulai: e.target.value })}
                            className="bg-gray-800 border border-gray-700 p-2 rounded w-full"
                            required
                        />
                        <input
                            type="time"
                            value={form.jam_selesai || ""}
                            onChange={(e) => setForm({ ...form, jam_selesai: e.target.value })}
                            className="bg-gray-800 border border-gray-700 p-2 rounded w-full"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Keterangan (opsional)"
                            value={form.keterangan || ""}
                            onChange={(e) => setForm({ ...form, keterangan: e.target.value })}
                            className="bg-gray-800 border border-gray-700 p-2 rounded w-full"
                        />

                        <input
                            type="text"
                            value={currentAdmin.name || "Admin"}
                            readOnly
                            className="bg-gray-700 border border-gray-500 p-2 rounded w-full cursor-not-allowed text-gray-300"
                        />

                        <div className="flex justify-end gap-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors"
                            >
                                {isEditMode ? "Update" : "Simpan"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
