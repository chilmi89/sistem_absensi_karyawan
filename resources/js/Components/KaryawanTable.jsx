// React: KaryawanTable.js
import { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import { route } from "ziggy-js";
import Swal from "sweetalert2";
import KaryawanModal from "./KaryawanModal";
import { v4 as uuidv4 } from "uuid";
import HeaderPersonality from "./HeaderPersonality";

export default function KaryawanTable({ karyawan = {}, roles = [], filters = {} }) {
    const [search, setSearch] = useState(filters?.search || "");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [form, setForm] = useState({
        id: null,
        nama: "",
        jabatan: "",
        email: "",
        password: "",
        qr_token: "" // simpan token backend
    });
    const [errors, setErrors] = useState({});

    // Live search dengan debounce
    useEffect(() => {
        const delay = setTimeout(() => {
            router.get(route("karyawan.index"), { search }, { preserveState: true, replace: true });
        }, 400);
        return () => clearTimeout(delay);
    }, [search]);

    // Tambah karyawan
    const handleAdd = () => {
        setForm({
            id: null,
            nama: "",
            jabatan: "",
            email: "",
            password: "",
            qr_token: "" // kosongkan, backend yang generate
        });
        setIsEditMode(false);
        setErrors({});
        setIsModalOpen(true);
    };

    // Edit karyawan
    const handleEdit = (item) => {
        setForm({
            id: item.id,
            nama: item.name,
            jabatan: item.roles?.[0]?.name || "",
            email: item.email,
            password: "",
            qr_token: item.qr_token || "" // pakai token asli dari backend
        });
        setIsEditMode(true);
        setErrors({});
        setIsModalOpen(true);
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: "Hapus data ini?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ya, hapus",
            cancelButtonText: "Batal"
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route("karyawan.destroy", id), {
                    preserveScroll: true,
                    onSuccess: () => Swal.fire("Berhasil", "Data dihapus", "success"),
                    onError: () => Swal.fire("Gagal", "Tidak bisa menghapus", "error")
                });
            }
        });
    };

    const handleSave = () => {
        setErrors({});
        const payload = {
            nama: form.nama,
            jabatan: form.jabatan,
            email: form.email,
            ...(form.password ? { password: form.password } : {}),
            qr_token: form.qr_token // selalu kirim token backend
        };

        const method = isEditMode ? "put" : "post";
        const url = isEditMode ? route("karyawan.update", form.id) : route("karyawan.store");

        router[method](url, payload, {
            preserveScroll: true,
            onSuccess: (res) => {
                Swal.fire(
                    "Berhasil",
                    isEditMode ? "Data diubah" : "Data ditambahkan",
                    "success"
                );
                setIsModalOpen(false);
                // Update form dengan qr_token terbaru dari backend
                if (res?.props?.karyawan?.qr_token) {
                    setForm((prev) => ({ ...prev, qr_token: res.props.karyawan.qr_token }));
                }
                router.visit(route("karyawan.index"), { replace: true, preserveScroll: true });
            },
            onError: (err) => {
                if (err?.response?.data?.errors) {
                    setErrors(err.response.data.errors);
                } else {
                    Swal.fire("Gagal", "Terjadi kesalahan saat menyimpan", "error");
                }
            }
        });
    };

    const data = Array.isArray(karyawan?.data) ? karyawan.data : [];
    const links = Array.isArray(karyawan?.links) ? karyawan.links : [];

    return (
        <div className="p-4 flex flex-col items-center">
            <div className="flex flex-col justify-between w-full max-w-5xl mb-4">
                <div className="flex justify-start"><HeaderPersonality /></div>
                <div className="flex justify-between pt-2">
                    <input
                        type="text"
                        placeholder="Cari karyawan..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-64 pl-2 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 bg-gray-900 text-gray-100"
                    />
                    <button
                        onClick={handleAdd}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                    >
                        + Tambah Karyawan
                    </button>
                </div>
            </div>

            <div className="rounded-lg overflow-hidden w-full max-w-5xl shadow-lg">
                <table className="w-full border-collapse text-center text-white">
                    <thead>
                        <tr className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500">
                            <th className="p-4">ID</th>
                            <th className="p-4">Nama</th>
                            <th className="p-4">Jabatan</th>
                            <th className="p-4">Email</th>
                            <th className="p-4">QR Code</th>
                            <th className="p-4">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length > 0 ? data.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-700/80">
                                <td className="p-4">{item.id}</td>
                                <td className="p-4">{item.name}</td>
                                <td className="p-4">{item.roles?.[0]?.name || ""}</td>
                                <td className="p-4">{item.email}</td>
                                <td className="p-4">
                                    {item.qr_code && (
                                        <img
                                            src={`/storage/${item.qr_code}`}
                                            alt={`QR ${item.name}`}
                                            className="w-16 h-16 object-contain border border-gray-600 rounded mx-auto"
                                        />
                                    )}
                                </td>
                                <td className="p-4 space-x-2">
                                    <button
                                        onClick={() => handleEdit(item)}
                                        className="bg-blue-500 px-3 py-1 rounded-lg"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="bg-red-500 px-3 py-1 rounded-lg"
                                    >
                                        Hapus
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="6" className="p-4 text-gray-400">Tidak ada data</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {links.length > 0 && (
                <div className="mt-4 flex gap-2">
                    {links.map((link, idx) => (
                        <button
                            key={idx}
                            disabled={!link.url}
                            onClick={() => router.get(link.url, { search }, { preserveState: true })}
                            className={`px-3 py-1 border rounded ${link.active ? "bg-blue-500 text-white" : "bg-gray-800 text-gray-300"}`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            )}

            <KaryawanModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                form={form}
                setForm={setForm}
                isEditMode={isEditMode}
                roles={roles}
                errors={errors}
            />
        </div>
    );
}
