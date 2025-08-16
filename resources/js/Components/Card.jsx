import { Users, UserCheck, Clock } from "lucide-react";
import "@/../css/Card.css"; // CSS terpisah untuk efek animasi gradient

const cardData = [
    { title: "Karyawan Hadir", value: 35, icon: UserCheck, gradient: "from-green-400 via-green-500 to-emerald-600" },
    { title: "Jumlah Karyawan", value: 40, icon: Users, gradient: "from-blue-400 via-blue-500 to-indigo-600" },
    { title: "Terlambat", value: 5, icon: Clock, gradient: "from-red-400 via-red-500 to-rose-600" },
    { title: "Karyawan Belum Hadir", value: 5, icon: Clock, gradient: "from-orange-400 via-red-500 to-rose-600" },
];

export default function Card({ isSidebarOpen = false, sidebarWidth = 250 }) {
    return (
        <div
            className="w-full flex justify-center"
            style={{
                marginLeft: isSidebarOpen ? `${sidebarWidth}px` : '0',
                transition: 'margin-left 0.3s ease-in-out, width 0.3s ease-in-out',
                maxWidth: `calc(100% - ${isSidebarOpen ? sidebarWidth + 32 : 32}px)`,
            }}
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full px-4">
                {cardData.map((card, idx) => {
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
            <style>{`
                .card-animated {
                    box-sizing: border-box;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    width: 100%;
                    transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
                }
                .grid {
                    max-width: 100%;
                    box-sizing: border-box;
                }
                @media (max-width: 640px) {
                    .card-animated {
                        min-height: 100px;
                    }
                    .card-animated h2 {
                        font-size: 1rem;
                    }
                    .card-animated p {
                        font-size: 2.5rem;
                    }
                }
            `}</style>
        </div>
    );
}
