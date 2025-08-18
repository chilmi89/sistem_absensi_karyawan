import { Link, usePage } from "@inertiajs/react";
import ApplicationLogo from "./ApplicationLogo";
import { HiHome, HiUser, HiCog, HiUsers, HiChartBar, HiCalendar } from "react-icons/hi";

const Navbar = ({ isOpen, setIsOpen, onSidebarHover, onSidebarLeave }) => {
    const { auth, canLogin, canRegister } = usePage().props;
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(auth?.user?.name || 'User')}&background=random&color=fff`;

    return (
        <>
            {/* Top Navbar */}
            <div className="navbar bg-[#000000] shadow-sm fixed top-0 left-0 right-0 z-50 px-4 py-2">
                <div className="flex-1 items-center flex">
                    {auth?.user && (
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="btn btn-ghost me-2 text-xl bg-lime-400 text-cyan-950"
                            aria-label="Toggle Sidebar"
                        >
                            ☰
                        </button>
                    )}
                    <div className="flex items-center gap-2">
                        <ApplicationLogo className="w-6 h-6" />
                        <span className="text-lg font-bold text-lime-400">
                            <span className="text-lime-400  ">C</span>-Recapt
                        </span>
                    </div>
                </div>

                <div className="flex-none">
                    {auth?.user ? (
                        <div className="dropdown dropdown-end">
                            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                                <div className="w-10 rounded-full overflow-hidden">
                                    <img src={avatarUrl} alt="User Avatar" />
                                </div>
                            </label>
                            <ul
                                tabIndex={0}
                                className="mt-3 p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
                            >
                                <li className="px-2 py-1 text-sm text-gray-500">{auth.user.email}</li>
                                <li>
                                    <Link href="/profile" className="justify-between">
                                        Profile
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href={route("logout")}
                                        method="post"
                                        as="button"
                                        className="text-red-500"
                                    >
                                        Logout
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    ) : (
                        <div className="flex space-x-2">
                            {canLogin && (
                                <Link href={route("login")} className="btn btn-sm bg-lime-400 text-black">
                                    Login
                                </Link>
                            )}
                            {canRegister && (
                                <Link href={route("register")} className="btn btn-sm bg-lime-400 text-black">
                                    Register
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Sidebar */}
            {auth?.user && (
                <>
                    <aside
                        className={`fixed top-0 left-0 h-full w-64 bg-[#000000] text-gray-100 shadow-lg transform transition-transform duration-300 ease-in-out z-40
                        ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
                        onMouseEnter={onSidebarHover}
                        onMouseLeave={onSidebarLeave}
                    >
                        <div className="p-4 flex justify-between items-center border-b border-base-300">
                            <h2 className="text-lg font-bold">Menu</h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="btn btn-sm btn-ghost"
                                aria-label="Close Sidebar"
                            >
                                ✖
                            </button>
                        </div>

                        <nav className="flex flex-col p-4 pt-10 space-y-3">
                            <Link
                                href="/"
                                className="hover:bg-lime-400 p-2 rounded flex items-center gap-3 hover:text-black"
                                onClick={() => setIsOpen(false)}
                            >
                                <HiHome className="w-5 h-5" /> Dashboard
                            </Link>
                            <Link
                                href="/profile"
                                className="hover:bg-lime-400 p-2 rounded flex items-center gap-3 hover:text-black"
                                onClick={() => setIsOpen(false)}
                            >
                                <HiUser className="w-5 h-5" /> Profile
                            </Link>
                            <Link
                                href="/settings"
                                className="hover:bg-lime-400 p-2 rounded flex items-center gap-3 hover:text-black"
                                onClick={() => setIsOpen(false)}
                            >
                                <HiCog className="w-5 h-5" /> Settings
                            </Link>
                            <Link
                                href={route('karyawan.index')}
                                className="hover:bg-lime-400 p-2 rounded flex items-center gap-3 hover:text-black"
                                onClick={() => setIsOpen(false)}
                            >
                                <HiUsers className="w-5 h-5" /> Personality
                            </Link>
                            <Link
                                href={route('admin.productivity')}
                                className="hover:bg-lime-400 p-2 rounded flex items-center gap-3 hover:text-black"
                                onClick={() => setIsOpen(false)}
                            >
                                <HiChartBar className="w-5 h-5" /> Productivity
                            </Link>
                            <Link
                                href={route('admin.jadwal.index')}
                                className="hover:bg-lime-400 p-2 rounded flex items-center gap-3 hover:text-black"
                                onClick={() => setIsOpen(false)}
                            >
                                <HiCalendar className="w-5 h-5" /> JadwalAbsensi
                            </Link>
                        </nav>

                    </aside>

                    {/* Overlay */}
                    {isOpen && (
                        <div
                            className="fixed inset-0 bg-black opacity-50 z-30"
                            onClick={() => setIsOpen(false)}
                        />
                    )}
                </>
            )}
        </>
    );
};

export default Navbar;
