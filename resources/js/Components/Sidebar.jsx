import { useState } from "react";
import { Link } from "@inertiajs/react";

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="flex">
            {/* Tombol Toggle */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 m-2 bg-blue-600 text-white rounded-md focus:outline-none"
            >
                {isOpen ? "✖" : "☰"}
            </button>

            {/* Sidebar */}
            <div
                className={`fixed top-0 left-0 h-full bg-gray-800 text-white w-64 transform ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                } transition-transform duration-300 ease-in-out z-50`}
            >
                <div className="p-4 text-lg font-bold border-b border-gray-700">
                    My Sidebar
                </div>
                <nav className="flex flex-col p-4 space-y-2">
                    <Link href="/" className="hover:bg-gray-700 p-2 rounded">
                        Dashboard
                    </Link>
                    <Link href="/profile" className="hover:bg-gray-700 p-2 rounded">
                        Profile
                    </Link>
                    <Link href="/settings" className="hover:bg-gray-700 p-2 rounded">
                        Settings
                    </Link>
                </nav>
            </div>

            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black opacity-50 z-40"
                    onClick={() => setIsOpen(false)}
                ></div>
            )}
        </div>
    );
};

export default Sidebar;
