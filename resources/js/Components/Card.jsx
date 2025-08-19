import { Users, UserCheck, Clock } from "lucide-react";
import "@/../css/Card.css"; // CSS animasi gradient

export default function Card({ isSidebarOpen = false, sidebarWidth = 250, cardData = {} }) {
    // Destructuring dengan default values
    const { hadir = 0, jumlah = 0, terlambat = 0, belumHadir = 0 } = cardData;

    const cards = [
        { title: "Karyawan Hadir", value: hadir, icon: UserCheck, gradient: "from-green-400 via-green-500 to-emerald-600" },
        { title: "Jumlah Karyawan", value: jumlah, icon: Users, gradient: "from-blue-400 via-blue-500 to-indigo-600" },
        { title: "Terlambat", value: terlambat, icon: Clock, gradient: "from-red-400 via-red-500 to-rose-600" },
        { title: "Karyawan Belum Hadir", value: belumHadir, icon: Clock, gradient: "from-orange-400 via-red-500 to-rose-600" },
    ];

    return (
        <div
            className="w-full flex justify-center"
            style={{
                marginLeft: isSidebarOpen ? `${sidebarWidth}px` : "0",
                transition: "margin-left 0.3s ease-in-out, width 0.3s ease-in-out",
                maxWidth: `calc(100% - ${isSidebarOpen ? sidebarWidth + 32 : 32}px)`,
            }}
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full px-4">
                {cards.map((card, idx) => {
                    const Icon = card.icon;
                    return (
                        <div
                            key={idx}
                            className={`card-animated bg-gradient-to-br ${card.gradient} text-white rounded-xl shadow-xl transform hover:-translate-y-2 hover:shadow-2xl transition-all duration-500 flex items-center justify-between min-h-[100px]`}
                        >
                            <div className="flex items-center justify-between w-full p-4">
                                {/* Kiri: Icon + Label */}
                                <div className="flex items-center space-x-3">
                                    <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm flex-shrink-0">
                                        <Icon size={20} />
                                    </div>
                                    <h2 className="text-lg font-semibold leading-tight">{card.title}</h2>
                                </div>

                                {/* Kanan: Angka */}
                                <p className="text-3xl font-bold flex-shrink-0">{card.value}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
