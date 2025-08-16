import React, { useState } from "react";

export default function AttendanceTable({ data = [], availableDates = [] }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 4;

    // Filter data berdasarkan search dan tanggal
    const filteredData = data.filter((row) => {
        const matchesSearch = row.nama?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDate = selectedDate ? row.tanggal === selectedDate : true;
        return matchesSearch && matchesDate;
    });

    // Pagination logic
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIdx = (currentPage - 1) * itemsPerPage;
    const currentData = filteredData.slice(startIdx, startIdx + itemsPerPage);

    return (
        <>
            {/* Container utama table-wrapper */}
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

                    <select
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
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
                            <option value="" disabled>
                                Belum ada jadwal
                            </option>
                        )}
                    </select>

                    <button
                        className="ml-0 sm:ml-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                        onClick={() => alert("Export Excel clicked!")}
                    >
                        Export Excel
                    </button>
                </div>

                {/* Table dengan scroll */}
                <div className="rounded-lg overflow-hidden shadow-lg">
                    <div className="max-h-[320px] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-700 transition-all duration-300">
                        <table className="w-full text-white border-collapse">
                            <thead className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 sticky top-0 z-10 shadow-md">
                                <tr>
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
                                {currentData.length > 0 ? (
                                    currentData.map((row, idx) => (
                                        <tr
                                            key={row.id ?? `row-${idx}`}
                                            className="bg-gray-900 hover:bg-blue-600/50 transition-colors duration-300"
                                        >
                                            <td className="p-3 text-center">{startIdx + idx + 1}</td>
                                            <td className="p-3 text-left">{row.nama || "-"}</td>
                                            <td className="p-3 text-left">{row.divisi || "-"}</td>
                                            <td className="p-3 text-center">{row.tanggal || "-"}</td>
                                            <td className="p-3 text-center">{row.jamMasuk || "-"}</td>
                                            <td className="p-3 text-center">{row.jamPulang || "-"}</td>
                                            <td className="p-3 text-center">
                                                <span
                                                    className={`status-badge ${row.status?.toLowerCase() || "alpa"} px-2 py-1 rounded text-sm`}
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
                </div>
            </div>

            {/* Pagination berada di luar table-wrapper */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-6">
                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        className="flex items-center gap-1 px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 transition"
                        disabled={currentPage === 1}
                    >
                        ◀ Prev
                    </button>
                    <span className="text-white px-3 py-1 rounded bg-gray-800">
                        {currentPage} / {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        className="flex items-center gap-1 px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 transition"
                        disabled={currentPage === totalPages}
                    >
                        Next ▶
                    </button>
                </div>
            )}
        </>
    );
}
