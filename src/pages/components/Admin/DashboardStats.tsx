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
  import { DollarSign, Users, Package, ShoppingBag } from "lucide-react";
  
  export default function DashboardStats() {
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
      <>
        {/* Top statisztikai kártyák */}
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
  
        {/* Diagram szekció */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
      </>
    );
  }
  