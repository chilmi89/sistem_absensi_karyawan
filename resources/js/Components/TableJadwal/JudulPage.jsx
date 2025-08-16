import { useEffect, useState } from "react";

export default function JudulPage() {
    const [color, setColor] = useState("rgb(255,0,0)");

    useEffect(() => {
        let r = 255, g = 0, b = 0;
        let step = 0;

        const interval = setInterval(() => {
            step += 0.03; // kecepatan perubahan warna
            r = Math.floor(127 * (Math.sin(step) + 1));
            g = Math.floor(127 * (Math.sin(step + 2) + 1));
            b = Math.floor(127 * (Math.sin(step + 4) + 1));
            setColor(`rgb(${r},${g},${b})`);
        }, 30);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="pt-2 flex justify-start">
            <h1
                className="text-4xl font-bold mb-2"
                style={{ color: color, transition: "color 0.03s linear" }}
            >
                Jadwal Page
            </h1>
        </div>
    );
}
