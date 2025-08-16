import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function Guest({ children }) {
    return (
        <div className="min-h-screen flex items-center justify-center absolute inset-0 bg-gradient-to-r from-purple-900 via-pink-900 to-red-900 animate-gradient-x -z-10  p-4 text-gray-600">
            {/* Container utama */}
            <div className="w-full max-w-md bg-gray-900 shadow-md rounded-lg overflow-hidden">
                {/* Logo + Title */}
                <div className="flex flex-col items-center justify-center pt-6">
                    <Link href="/" className="w-full px-32 flex items-center ">
                        <ApplicationLogo
                            className="w-10 h-10 ms-0"
                            style={{ animationDuration: '3s' }}
                        />
                        <span className="text-4xl font-bold text-gray-100">
                            Login
                        </span>
                    </Link>
                </div>

                {/* Konten/Form */}
                <div className="px-6 py-8">
                    {children}
                </div>
            </div>
        </div>
    );
}
