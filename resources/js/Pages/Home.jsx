import { useState, useEffect } from "react";
import Card from "@/Components/Card";
import AttendanceTable from "@/Components/AttendanceTable";
import MasterLayout from "./Layouts/MasterLayout";
import CameraQR from "@/Components/Camera";
import HeaderDashboard from "@/Components/HeaderDashboard";
import { usePage } from "@inertiajs/react";

export default function Home() {
    const { cardData: initialCardData } = usePage().props; // data awal dari backend
    const [cardData, setCardData] = useState(initialCardData);
    const [jadwalAbsensiAdmin, setJadwalAbsensiAdmin] = useState([]);
    const [attendanceData, setAttendanceData] = useState([]);
    const [scanResult, setScanResult] = useState(null);
    const [selectedDate, setSelectedDate] = useState("");

    // Ambil jadwal absensi dan data awal
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("/absensi", {
                    headers: { Accept: "application/json" },
                    credentials: "same-origin",
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

    // Handle scan QR
    const handleScan = async (data) => {
        const d = data.data || data;
        if (!selectedDate) {
            alert("Pilih tanggal terlebih dahulu agar user bisa melakukan scan QR");
            return;
        }

        // Update attendanceData di frontend
        setAttendanceData((prev) => {
            const exists = prev.find(
                (item) => item.id === d.id && item.tanggal === selectedDate
            );
            return exists
                ? prev.map((item) =>
                      item.id === d.id && item.tanggal === selectedDate
                          ? { ...item, ...d }
                          : item
                  )
                : [...prev, { ...d, tanggal: selectedDate }];
        });

        setScanResult(d);

        // Fetch ulang cardData supaya summary update
        try {
            const cardRes = await fetch(`/dashboard/card-data?tanggal=${selectedDate}`, {
                headers: { Accept: "application/json" },
                credentials: "same-origin",
            });
            if (!cardRes.ok) throw new Error("Gagal load card data: " + cardRes.status);
            const cardJson = await cardRes.json();
            setCardData(cardJson.cardData);
        } catch (err) {
            console.error(err);
        }
    };

    // Handle saat tanggal dipilih di AttendanceTable
    const handleDateSelect = async (date) => {
        setSelectedDate(date);

        try {
            // Fetch data Card untuk tanggal yang dipilih
            const cardRes = await fetch(`/dashboard/card-data?tanggal=${date}`, {
                headers: { Accept: "application/json" },
                credentials: "same-origin",
            });
            if (!cardRes.ok) throw new Error("Gagal load card data: " + cardRes.status);
            const cardJson = await cardRes.json();
            setCardData(cardJson.cardData);

            // Fetch data absensi untuk tanggal yang dipilih
            const attendanceRes = await fetch(`/dashboard/attendance?tanggal=${date}`, {
                headers: { Accept: "application/json" },
                credentials: "same-origin",
            });
            if (!attendanceRes.ok) throw new Error("Gagal load attendance data: " + attendanceRes.status);
            const attendanceJson = await attendanceRes.json();
            setAttendanceData(attendanceJson.data);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <MasterLayout>
            <div className="px-6 pt-4 flex flex-col gap-6 min-h-[calc(100vh-4rem)] w-full">
                <HeaderDashboard />

                {/* Card summary */}
                <Card key={selectedDate || "all"} cardData={cardData} />

                <div className="grid grid-cols-1 md:grid-cols-10 gap-4 w-full">
                    <div className="col-span-1 md:col-span-6 flex flex-col w-full">
                        <AttendanceTable
                            data={attendanceData}
                            availableDates={jadwalAbsensiAdmin}
                            onDateSelect={handleDateSelect}
                        />
                    </div>

                    <div className="col-span-1 md:col-span-4 flex flex-col items-stretch w-full">
                        <div className="w-full">
                            <CameraQR height={280} onScan={handleScan} selectedDate={selectedDate} />
                        </div>

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
