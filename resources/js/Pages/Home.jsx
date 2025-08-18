import { useState, useEffect } from "react";
import Card from "@/Components/Card";
import AttendanceTable from "@/Components/AttendanceTable";
import MasterLayout from "./Layouts/MasterLayout";
import CameraQR from "@/Components/Camera";

import "@/../css/Home.css";
import "@/../css/AttendanceTable.css";
import HeaderDashboard from "@/Components/HeaderDashboard";

export default function Home() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [jadwalAbsensiAdmin, setJadwalAbsensiAdmin] = useState([]);
    const [attendanceData, setAttendanceData] = useState([]);
    const [scanResult, setScanResult] = useState(null);

    const [selectedDate, setSelectedDate] = useState("");


    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("/absensi", {
                    method: "GET",
                    headers: { "Accept": "application/json" },
                    credentials: "same-origin"
                });
                if (!res.ok) throw new Error("Gagal load jadwal admin: " + res.status);

                const json = await res.json();

                setAttendanceData(Array.isArray(json.data) ? json.data : []);
                setJadwalAbsensiAdmin(Array.isArray(json.availableDates) ? json.availableDates : []);
            } catch (err) {
                console.error(err);
            }
        };

        fetchData();
    }, []);


    const handleScan = (data) => {
        const d = data.data || data;
        console.log("Hasil QR scan:", d);

        
        setAttendanceData(prev => {
            const exists = prev.find(item => item.id === d.id);
            if (exists) {
                return prev.map(item => item.id === d.id ? d : item);
            } else {
                return [...prev, d];
            }
        });

        setScanResult(d);
    };

    return (
        <MasterLayout>
            <div className="px-6 pt-4 flex flex-col gap-6 min-h-[calc(100vh-4rem)]">
                {/* Judul */}
                <HeaderDashboard />

                {/* Card summary */}
                <Card />

                {/* Grid Tabel + Camera */}
                <div className="grid grid-cols-1 md:grid-cols-10 gap-4">
                    {/* Tabel */}
                    <div className="col-span-1 md:col-span-6 flex flex-col">
                        <AttendanceTable
                            data={attendanceData}
                            availableDates={jadwalAbsensiAdmin}
                            onDateSelect={(date) => setSelectedDate(date)} // <-- tangkap tanggal
                        />
                    </div>

                    {/* CameraQR */}
                    <div className="col-span-1 md:col-span-4 flex flex-col items-stretch">
                        <CameraQR
                            height={280}
                            onScan={handleScan}
                            selectedDate={selectedDate} // <-- teruskan tanggal
                        />
                        {!selectedDate && (
                            <div className="text-yellow-400 mt-2 text-center">
                                Pilih tanggal terlebih dahulu agar user bisa melakukan scan QR
                            </div>
                        )}
                        {scanResult && selectedDate && (
                            <div className="text-gray-200 mt-2">
                                Terakhir scan: {scanResult.nama || "Belum ada scan"}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </MasterLayout>
    );
}
