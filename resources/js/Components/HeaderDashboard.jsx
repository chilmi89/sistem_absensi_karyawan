import { useEffect, useState } from "react";

export default function HeaderDashboard() {
  const colors = ["text-red-500", "text-yellow-400", "text-green-500", "text-blue-500", "text-purple-500"];
  const [colorIndex, setColorIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setColorIndex((prev) => (prev + 1) % colors.length);
    }, 500); // ganti warna tiap 500ms
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="pt-1 overflow-hidden">
      <h1
        className={`text-4xl font-bold mb-2 ms-4 ${colors[colorIndex]}`}
      >
        Dashboard Admin
      </h1>
    </div>
  );
}
