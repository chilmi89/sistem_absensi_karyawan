import React, { useState } from "react";
import MasterLayout from "@/Pages/Layouts/MasterLayout";
import JadwalTable from "@/Components/TableJadwal/JadwalTable";
import { usePage, router } from "@inertiajs/react";
import { route } from "ziggy-js";
import Pagination from "@/Components/TableJadwal/Pagination";
// import JudulPage from "@/Components/TableJadwal/JudulPage";

export default function JadwalAbsensi() {
    const { auth, jadwal = {} } = usePage().props;
    const currentAdmin = auth?.user;

    const [jadwalState, setJadwalState] = useState(jadwal.data || []);
    const [meta, setMeta] = useState({
        current_page: jadwal.current_page || 1,
        last_page: jadwal.last_page || 1,
    });

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const sidebarWidth = 110;

    const changePage = (page) => {
        router.get(route("admin.jadwal.index"), { page }, {
            preserveState: true,
            onSuccess: (pageData) => {
                setJadwalState(pageData.props.jadwal.data);
                setMeta({
                    current_page: pageData.props.jadwal.current_page,
                    last_page: pageData.props.jadwal.last_page,
                });
            },
            onError: (err) => console.error("Gagal pindah halaman:", err),
        });
    };

    return (

        <>
            <MasterLayout>

                <div className="grid grid-cols-[auto_1fr] gap-4 pt-4 px-6">
                    {/* Kolom pertama: kosong untuk sidebar / spasi */}
                    <div className={`${isSidebarOpen ? "w-[110px]" : "w-0"}`}></div>

                    {/* Kolom kedua: Konten utama */}
                    <div className="flex flex-col gap-4">
                        {/* JudulPage */}

                        {/* Tabel + Pagination */}
                        <div>
                            <JadwalTable
                                jadwalAbsensi={jadwalState}
                                currentAdmin={currentAdmin}
                                onDataChange={setJadwalState}
                            />
                            <Pagination meta={meta} onPageChange={changePage} />
                        </div>
                    </div>
                </div>
            </MasterLayout>

        </>




    );
}
