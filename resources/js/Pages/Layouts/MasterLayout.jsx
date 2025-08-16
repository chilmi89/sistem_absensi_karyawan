import { useState } from "react";
import Navbar from "@/Components/Navbar";

export default function MasterLayout({ children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="relative min-h-screen flex">
            {/* Navbar / Sidebar */}
            <Navbar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            {/* Konten utama */}
            <main
                className={`transition-all duration-300 flex-1 min-h-screen pt-16 bg-[#262B2C]/90 backdrop-blur-sm ${
                    isSidebarOpen ? "pl-64" : "pl-0"
                }`}
            >
                {children}
            </main>

            {/* Background animasi */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-700 via-pink-600 to-red-500 animate-gradient-x -z-10"></div>
        </div>
    );
}
