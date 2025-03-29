import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { hasAccess } from "../helpers/roleGuard";
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  Percent,
  Menu,
  Package,
  DollarSign,
} from "lucide-react";
// 🔽 import a file tetején bővítve
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";
import Image from "next/image";

export default function AdminDashboard() {
  const router = useRouter();
  const [activePage, setActivePage] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const role = user?.role;

    if (!hasAccess(role, ["admin"])) {
      router.push("/");
    }
  }, [router]);

  const ordersPerDay = [
    { day: "H", orders: 5 },
    { day: "K", orders: 9 },
    { day: "Sz", orders: 7 },
    { day: "Cs", orders: 11 },
    { day: "P", orders: 6 },
    { day: "Szo", orders: 3 },
    { day: "V", orders: 2 },
  ];

  const userRoles = [
    { name: "Admin", value: 3 },
    { name: "User", value: 85 },
    { name: "Sales Manager", value: 10 },
  ];

  const revenueData = [
    { date: "Márc 1", revenue: 120 },
    { date: "Márc 5", revenue: 300 },
    { date: "Márc 10", revenue: 240 },
    { date: "Márc 15", revenue: 380 },
    { date: "Márc 20", revenue: 270 },
    { date: "Márc 25", revenue: 500 },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* SIDEBAR */}
      <div
        className={`bg-white shadow-md h-screen sticky top-0 p-4 transition-all ${
          collapsed ? "w-16" : "w-64"
        }`}
      >
        <div className="flex justify-between items-center mb-8">
          {!collapsed && (
            <Image src="/images/Logo_original.png" width={45} height={45} alt="logo" />
          )}
          <button onClick={() => setCollapsed(!collapsed)}>
            <Menu size={20} />
          </button>
        </div>

        <nav className="space-y-4">
          <button
            onClick={() => setActivePage("dashboard")}
            className={`flex items-center gap-3 px-3 py-2 rounded-md w-full text-left transition ${
              activePage === "dashboard"
                ? "bg-[#FF6000] text-white font-semibold"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <LayoutDashboard size={18} />
            {!collapsed && "Statisztikák"}
          </button>
          <button
            onClick={() => router.push("/admin-dashboard/users")}
            className="flex items-center gap-3 px-3 py-2 rounded-md w-full text-left text-gray-700 hover:bg-gray-100 transition"
          >
            <Users size={18} />
            {!collapsed && "Felhasználók"}
          </button>
          <button
            onClick={() => router.push("/admin-dashboard/orders")}
            className="flex items-center gap-3 px-3 py-2 rounded-md w-full text-left text-gray-700 hover:bg-gray-100 transition"
          >
            <ShoppingBag size={18} />
            {!collapsed && "Rendelések"}
          </button>
          <button
            onClick={() => router.push("/admin-dashboard/coupons")}
            className="flex items-center gap-3 px-3 py-2 rounded-md w-full text-left text-gray-700 hover:bg-gray-100 transition"
          >
            <Percent size={18} />
            {!collapsed && "Kuponok"}
          </button>
        </nav>
      </div>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-[#FF6000] mb-6">
          Admin Dashboard
        </h1>

        {/* 🧠 Top statisztikai kártyák */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white shadow-md p-5 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">Összes felhasználó</span>
              <Users size={20} className="text-[#FF6000]" />
            </div>
            <p className="text-2xl font-bold">126</p>
          </div>

          <div className="bg-white shadow-md p-5 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">Összes termék</span>
              <Package size={20} className="text-[#FF6000]" />
            </div>
            <p className="text-2xl font-bold">72</p>
          </div>

          <div className="bg-white shadow-md p-5 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">Aktív rendelések</span>
              <ShoppingBag size={20} className="text-[#FF6000]" />
            </div>
            <p className="text-2xl font-bold">23</p>
          </div>

          <div className="bg-white shadow-md p-5 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">Bevétel (30 nap)</span>
              <DollarSign size={20} className="text-[#FF6000]" />
            </div>
            <p className="text-2xl font-bold">$4,870</p>
          </div>
        </div>

        {/* 📊 Diagramok szekció (később) */}
        {/* 📊 Diagram szekció */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Oszlopdiagram - rendelések */}
          <div className="bg-white p-6 shadow-md rounded-lg">
            <h2 className="text-md font-semibold mb-4 text-[#FF6000]">
              Rendelések / nap
            </h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={ordersPerDay}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="orders" fill="#FF6000" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Kördiagram - szerepkör megoszlás */}
          <div className="bg-white p-6 shadow-md rounded-lg">
            <h2 className="text-md font-semibold mb-4 text-[#FF6000]">
              Felhasználók szerepkör szerint
            </h2>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={userRoles}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={70}
                  label
                >
                  <Cell fill="#FF6000" />
                  <Cell fill="#FFA559" />
                  <Cell fill="#FFB26B" />
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Vonaldiagram - bevétel */}
          <div className="bg-white p-6 shadow-md rounded-lg">
            <h2 className="text-md font-semibold mb-4 text-[#FF6000]">
              Bevétel változás (30 nap)
            </h2>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={revenueData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#FF6000"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  );
}
