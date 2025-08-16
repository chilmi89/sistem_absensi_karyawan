import React from "react";
import MasterLayout from "../Layouts/MasterLayout";
import { usePage } from "@inertiajs/react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";

const COLORS = ["#4ade80", "#facc15", "#f87171", "#60a5fa"];
const monthNames = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];

export default function Productivity() {
  const { statusCounts, monthlyData } = usePage().props;

  // Pie Chart data
  const pieData = Object.keys(statusCounts).map((key) => ({
    name: key,
    value: statusCounts[key],
  }));

  // Bar Chart data (map bulan ke nama)
  const barData = monthlyData.map(item => ({
    bulan: monthNames[item.bulan - 1],
    total: item.total,
  }));

  return (
    <MasterLayout>
      <div className="px-6 pt-4 bg-gradient-to-br text-gray-100">
        <h1 className="text-4xl font-bold mb-10 text-center tracking-wide drop-shadow-lg">
          🚀 Productivity Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Pie Chart */}
          <div className="bg-gray-800/90 backdrop-blur-xl p-4 rounded-2xl shadow-2xl hover:scale-105 transform transition duration-500">
            <h2 className="text-xl font-semibold mb-4 text-center">Status Absensi</h2>
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                {/* Gradient untuk Pie */}
                <defs>
                  {COLORS.map((color, index) => (
                    <linearGradient key={index} id={`grad-${index}`} x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor={color} stopOpacity={0.85}/>
                      <stop offset="100%" stopColor={color} stopOpacity={0.4}/>
                    </linearGradient>
                  ))}
                </defs>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={120}
                  innerRadius={70}
                  paddingAngle={5}
                  stroke="none"
                  label
                  isAnimationActive
                  animationBegin={200}
                  animationDuration={1500}
                >
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={`url(#grad-${index})`} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ED775A",
                    border: "none",
                    borderRadius: "12px",
                    color: "#fff"
                  }}
                  cursor={{ fill: "rgba(255,255,255,0.05)" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart */}
          <div className="bg-gray-800/90 backdrop-blur-xl p-4 rounded-2xl shadow-2xl hover:scale-105 transform transition duration-500">
            <h2 className="text-xl font-semibold mb-4 text-center">Hadir Per Bulan</h2>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={barData}>
                {/* Gradient untuk Bar */}
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4ade80" stopOpacity={0.9}/>
                    <stop offset="100%" stopColor="#16a34a" stopOpacity={0.6}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="bulan" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "none",
                    borderRadius: "12px",
                    color: "#fff"
                  }}
                  cursor={{ fill: "rgba(255,255,255,0.05)" }}
                />
                <Legend />
                <Bar
                  dataKey="total"
                  fill="url(#barGradient)"
                  radius={[10, 10, 0, 0]}
                  barSize={45}
                  isAnimationActive
                  animationBegin={200}
                  animationDuration={1200}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </MasterLayout>
  );
}
