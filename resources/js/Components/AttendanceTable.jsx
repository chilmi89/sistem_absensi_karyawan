import React, { useState } from "react";

export default function AttendanceTable({ data = [], availableDates = [], onDateSelect }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDate, setSelectedDate] = useState("");

    // Filter data berdasarkan search dan tanggal
    const filteredData = data.filter((row) => {
        const matchesSearch = row.nama?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDate = selectedDate ? row.tanggal === selectedDate : true;
        return matchesSearch && matchesDate;
    });

    // Handle perubahan tanggal
    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
        if (onDateSelect) {
            onDateSelect(e.target.value); // Kirim tanggal ke parent untuk QR scan
        }
    };

    return (
        <div className="table-wrapper px-2 sm:px-6 md:px-6 bg-gray-900 ms-2 pb-10">
            {/* Filter dan Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 px-2 gap-2">
                <input
                    type="text"
                    placeholder="Cari nama karyawan..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="p-2 border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64 md:w-48 bg-gray-900 text-gray-200"
                />

                {/* Dropdown untuk tanggal */}
                <select
                    value={selectedDate}
                    onChange={handleDateChange}
                    className="p-2 border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-900 text-gray-200"
                >
                    <option value="">Pilih Tanggal</option>
                    {availableDates.length > 0 ? (
                        availableDates.map((tgl) => (
                            <option key={tgl} value={tgl}>
                                {tgl}
                            </option>
                        ))
                    ) : (
                        <option value="" disabled>Belum ada jadwal</option>
                    )}
                </select>

                <button
                    className="ml-0 sm:ml-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                    onClick={() => {
                        if (!selectedDate) {
                            alert("Pilih tanggal terlebih dahulu sebelum export!");
                            return;
                        }
                        alert("Export Excel clicked!");
                    }}
                >
                    Export Excel
                </button>
            </div>

            {/* Table */}
            <div className="rounded-lg overflow-hidden shadow-lg">
                <table className="w-full text-white">
                    <thead>
                        <tr className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500">
                            <th className="p-4 text-center">No</th>
                            <th className="p-4 text-left">Nama</th>
                            <th className="p-4 text-left">Divisi</th>
                            <th className="p-4 text-center">Tanggal</th>
                            <th className="p-4 text-center">Jam Masuk</th>
                            <th className="p-4 text-center">Jam Pulang</th>
                            <th className="p-4 text-center">Status Kehadiran</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.length > 0 ? (
                            filteredData.map((row, idx) => (
                                <tr
                                    key={row.id ?? `row-${idx}`}
                                    className="bg-gray-900 hover:bg-blue-600/50 transition-colors duration-200"
                                >
                                    <td className="p-3 text-center">{idx + 1}</td>
                                    <td className="p-3 text-left">{row.nama || "-"}</td>
                                    <td className="p-3 text-left">{row.divisi || "-"}</td>
                                    <td className="p-3 text-center">{row.tanggal || "-"}</td>
                                    <td className="p-3 text-center">{row.jamMasuk || "-"}</td>
                                    <td className="p-3 text-center">{row.jamPulang || "-"}</td>
                                    <td className="p-3 text-center">
                                        <span
                                            className={`status-badge ${
                                                row.status?.toLowerCase() || "alpa"
                                            } px-2 py-1 rounded text-sm`}
                                        >
                                            {row.status || "Belum Absen"}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="p-4 text-gray-400 text-center bg-gray-900">
                                    Tidak ada data
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Info jika tanggal belum dipilih */}
            {!selectedDate && (
                <div className="mt-4 text-yellow-400 text-center">
                    Pilih tanggal terlebih dahulu agar user bisa melakukan scan QR
                </div>
            )}
        </div>
    );
}
