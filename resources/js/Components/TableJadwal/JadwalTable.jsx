// React: JadwalTable.js (versi Notyf)
import React, { useState } from "react";
import { router, usePage } from "@inertiajs/react";
import { route } from "ziggy-js";
import { PencilIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/solid";
import JadwalModal from "./JadwalModal";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import JudulPage from "./JudulPage";

const JadwalTable = ({ jadwalAbsensi = [], onDataChange }) => {
    const notyf = new Notyf(); // instance notyf
    const { auth } = usePage().props;
    const currentAdmin = auth.user;

    const initialForm = { id: null, tanggal: "", jam_mulai: "", jam_selesai: "", keterangan: "" };
    const [form, setForm] = useState(initialForm);
    const [isEditMode, setIsEditMode] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const openModal = (jadwal = null) => {
        if (jadwal) {
            setForm({ ...jadwal });
            setIsEditMode(true);
        } else {
            setForm(initialForm);
            setIsEditMode(false);
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setForm(initialForm);
        setIsEditMode(false);
        setShowModal(false);
    };

    const handleSave = (e) => {
        e.preventDefault();

        if (!form.tanggal || !form.jam_mulai || !form.jam_selesai) {
            notyf.error("Tanggal, Jam Mulai, dan Jam Selesai wajib diisi!");
            return;
        }

        const payload = { ...form, dibuat_oleh_admin_id: currentAdmin?.id };
        const url = isEditMode ? route("admin.jadwal.update", form.id) : route("admin.jadwal.store");
        const method = isEditMode ? "put" : "post";

        router.visit(url, {
            method,
            data: payload,
            preserveState: true,
            onSuccess: (page) => {
                closeModal();
                onDataChange?.(page.props.jadwal);
                notyf.success(`Jadwal ${isEditMode ? "diupdate" : "ditambahkan"}!`);
            },
            onError: () => {
                notyf.error("Gagal menyimpan jadwal!");
            },
        });
    };

    const handleDelete = (id) => {
        if (!window.confirm("Yakin ingin menghapus jadwal ini?")) return;

        router.visit(route("admin.jadwal.destroy", id), {
            method: "delete",
            preserveState: true,
            onSuccess: (page) => {
                onDataChange?.(page.props.jadwal);
                notyf.success("Jadwal berhasil dihapus!");
            },
            onError: () => notyf.error("Gagal hapus jadwal!"),
        });
    };

    const filteredJadwal = jadwalAbsensi.filter(jadwal =>
        jadwal.tanggal.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (jadwal.keterangan && jadwal.keterangan.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (jadwal.admin?.name && jadwal.admin.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="flex flex-col items-center text-white mt-2">
            <div className="w-full max-w-4xl flex flex-col justify-between mb-4">
                <div className="flex justify-start"><JudulPage /></div>
                <div className="flex justify-between items-center pt-4">
                    <input
                        type="text"
                        placeholder="Cari jadwal..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="py-2 rounded-lg min-w-[200px] h-[40px] text-gray-200 bg-slate-900"
                    />
                    <button
                        onClick={() => openModal()}
                        className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-3 rounded-lg transition text-base"
                    >
                        <PlusIcon className="w-5 h-5" />
                        Tambah Jadwal
                    </button>
                </div>
            </div>

            <div className="rounded-lg overflow-hidden w-full max-w-4xl shadow-lg">
                <table className="w-full border-collapse text-center text-white text-base">
                    <thead>
                        <tr className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500">
                            <th className="px-4 py-3">No</th>
                            <th className="px-4 py-3">Tanggal</th>
                            <th className="px-4 py-3">Jam Mulai</th>
                            <th className="px-4 py-3">Jam Selesai</th>
                            <th className="px-4 py-3">Keterangan</th>
                            <th className="px-4 py-3">Dibuat Oleh</th>
                            <th className="px-4 py-3">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredJadwal.length > 0 ? (
                            filteredJadwal.map((jadwal, index) => (
                                <tr key={jadwal.id} className="hover:bg-gray-700/80">
                                    <td className="px-4 py-3">{index + 1}</td>
                                    <td className="px-4 py-3">{jadwal.tanggal}</td>
                                    <td className="px-4 py-3">{jadwal.jam_mulai}</td>
                                    <td className="px-4 py-3">{jadwal.jam_selesai}</td>
                                    <td className="px-4 py-3">{jadwal.keterangan || "-"}</td>
                                    <td className="px-4 py-3">{jadwal.admin?.name || "Tidak diketahui"}</td>
                                    <td className="px-4 py-3 flex justify-center gap-3">
                                        <button
                                            onClick={() => openModal(jadwal)}
                                            className="bg-blue-500 hover:bg-blue-600 p-2 rounded-lg"
                                            title="Edit"
                                        >
                                            <PencilIcon className="w-5 h-5 text-white" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(jadwal.id)}
                                            className="bg-red-500 hover:bg-red-600 p-2 rounded-lg"
                                            title="Hapus"
                                        >
                                            <TrashIcon className="w-5 h-5 text-white" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="px-4 py-3 text-gray-400">
                                    Tidak ada data
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <JadwalModal
                show={showModal}
                isEditMode={isEditMode}
                form={form}
                setForm={setForm}
                onSave={handleSave}
                onClose={closeModal}
                currentAdmin={currentAdmin}
            />
        </div>
    );
};

export default JadwalTable;
