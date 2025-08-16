// Home.jsx
import { useState, useEffect } from "react";
import Card from "@/Components/Card";
import AttendanceTable from "@/Components/AttendanceTable";
import MasterLayout from "./Layouts/MasterLayout";
import CameraQR from "@/Components/Camera";

import "@/../css/Home.css";
import "@/../css/AttendanceTable.css";

export default function Home() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // State untuk menyimpan semua hasil scan
    const [attendanceData, setAttendanceData] = useState([]);
    const [scanResult, setScanResult] = useState(null);

    // Load data dari localStorage saat pertama kali mount
    useEffect(() => {
        const stored = localStorage.getItem("attendanceData");
        if (stored) setAttendanceData(JSON.parse(stored));
    }, []);

    // Simpan ke localStorage setiap ada perubahan attendanceData
    useEffect(() => {
        localStorage.setItem("attendanceData", JSON.stringify(attendanceData));
    }, [attendanceData]);

    // Callback dari CameraQR saat scan berhasil
    const handleScan = (data) => {
        const d = data.data || data; // pastikan object hasil scan
        console.log("Hasil QR scan:", d);

        // Tampilkan alert
        alert(
            `Absensi Berhasil!\n` +
            `Nama: ${d.nama}\n` +
            `Divisi: ${d.divisi || "-"}\n` +
            `Tanggal: ${d.tanggal || "-"}\n` +
            `Jam Masuk: ${d.jamMasuk || "-"}\n` +
            `Jam Pulang: ${d.jamPulang || "-"}\n` +
            `Status: ${d.status || "-"}\n` +
            `Waktu Scan: ${d.waktu_scan || "-"}`
        );

        // Simpan ke state attendanceData, replace jika id sama
        setAttendanceData(prev => {
            const exists = prev.find(item => item.id === d.id);
            if (exists) {
                return prev.map(item => item.id === d.id ? d : item);
            } else {
                return [...prev, d];
            }
        });

        // Simpan terakhir scan untuk info kecil
        setScanResult(d);
    };

    return (
        <MasterLayout>
            <div className="relative min-h-screen overflow-hidden">
                {/* Background animasi */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-700 via-pink-600 to-red-500 animate-gradient-x -z-10"></div>

                {/* Konten utama */}
                <div
                    className={`pt-16 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-0"} min-h-screen bg-[#262B2C]/90 backdrop-blur-sm`}
                >
                    <h1 className="text-2xl md:text-1xl font-bold text-gray-100 font-poppins px-6 ms-8 pt-4">
                        Dashboard Absensi
                    </h1>

                    <Card isSidebarOpen={isSidebarOpen} />

                    <div className="px-6 ms-4 mt-6 grid grid-cols-1 md:grid-cols-10 gap-4">
                        {/* AttendanceTable */}
                        <div className="col-span-1 md:col-span-6 min-h-[300px] flex flex-col">
                            <AttendanceTable data={attendanceData} />
                        </div>

                        {/* Camera QR */}
                        <div className="col-span-1 md:col-span-4">
                            <CameraQR height={280} onScan={handleScan} />
                            {scanResult && (
                                <div className="text-gray-200 mt-2">
                                    Terakhir scan: {scanResult.nama || "Belum ada scan"}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </MasterLayout>
    );
}
