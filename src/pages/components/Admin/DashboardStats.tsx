import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
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

type Role = {
  name: string;
};

type UserRoleWithName = {
  role_id: number;
  roles: Role | null;
};

export default function DashboardStats() {
  const [userCount, setUserCount] = useState<number | null>(null);
  const [productCount, setProductCount] = useState<number | null>(null);
  const [activeOrdersCount, setActiveOrdersCount] = useState<number | null>(null);
  const [revenue, setRevenue] = useState<number | null>(null);
  const [revenueData, setRevenueData] = useState<{ date: string; revenue: number }[]>([]);
  const [userRolesData, setUserRolesData] = useState<{ name: string; value: number }[]>([]);
  const [ordersPerDayData, setOrdersPerDayData] = useState<{ date: string; orders: number }[]>([]);

  // Korrigált százalékos adat kiszámítás
  const getPercentageData = () => {
    const total = userRolesData.reduce((sum, item) => sum + item.value, 0);
    const result = userRolesData.map((item) => ({
      ...item,
      percentRaw: (item.value / total) * 100,
      percent: Math.floor((item.value / total) * 100),
    }));

    const totalPercent = result.reduce((sum, item) => sum + item.percent, 0);
    const diff = 100 - totalPercent;
    if (diff > 0 && result.length > 0) {
      result[result.length - 1].percent += diff;
    }

    return result;
  };

  // Felhasználók száma
  useEffect(() => {
    const fetchUserCount = async () => {
      const { count } = await supabase
        .from("users")
        .select("*", { count: "exact", head: true });
      if (typeof count === "number") setUserCount(count);
    };
    fetchUserCount();
  }, []);

  // Termékek száma
  useEffect(() => {
    const fetchProductCount = async () => {
      const { count } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true });
      if (typeof count === "number") setProductCount(count);
    };
    fetchProductCount();
  }, []);

  // Aktív rendelések
  useEffect(() => {
    const fetchActiveOrders = async () => {
      const { count } = await supabase
        .from("orders")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending");
      if (typeof count === "number") setActiveOrdersCount(count);
    };
    fetchActiveOrders();
  }, []);

  // Bevétel 30 napra
  useEffect(() => {
    const fetchRevenue = async () => {
      const { data } = await supabase
        .from("orders")
        .select("final_total, created_at, status");

      if (data) {
        const today = new Date();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(today.getDate() - 30);

        const filtered = data.filter(
          (order) =>
            order.status === "completed" &&
            new Date(order.created_at) >= thirtyDaysAgo
        );

        const totalRevenue = filtered.reduce(
          (sum, order) => sum + (order.final_total || 0), 0
        );
        setRevenue(totalRevenue);

        const daily: Record<string, number> = {};
        filtered.forEach(order => {
          const date = new Date(order.created_at);
          const key = date.toLocaleDateString("hu-HU", {
            month: "short",
            day: "2-digit",
          });
          daily[key] = (daily[key] || 0) + Number(order.final_total || 0);
        });

        const chartData = Object.entries(daily).map(([date, revenue]) => ({
          date,
          revenue,
        }));

        setRevenueData(chartData);
      }
    };
    fetchRevenue();
  }, []);

  // Szerepkörök
  useEffect(() => {
    const fetchUserRoles = async () => {
      const { data } = await supabase
        .from("user_roles")
        .select("role_id, roles(name)")
        .order("role_id", { ascending: true });

      if (data) {
        const typedData = data as unknown as UserRoleWithName[];
        const roleCounts: Record<string, number> = {};

        typedData.forEach(item => {
          const roleName = item.roles?.name || "ismeretlen";
          roleCounts[roleName] = (roleCounts[roleName] || 0) + 1;
        });

        const formatted = Object.entries(roleCounts).map(([name, value]) => ({
          name,
          value,
        }));

        setUserRolesData(formatted);
      }
    };
    fetchUserRoles();
  }, []);

  // 14 napos rendelés / nap
  useEffect(() => {
    const fetchOrdersPerDay = async () => {
      const { data } = await supabase.from("orders").select("created_at");

      if (data) {
        const today = new Date();
        const fourteenDaysAgo = new Date();
        fourteenDaysAgo.setDate(today.getDate() - 13);

        const dailyCount: Record<string, number> = {};
        for (let i = 0; i < 14; i++) {
          const date = new Date(fourteenDaysAgo);
          date.setDate(fourteenDaysAgo.getDate() + i);
          const key = date.toLocaleDateString("hu-HU", {
            month: "short",
            day: "2-digit",
          });
          dailyCount[key] = 0;
        }

        data.forEach(order => {
          const createdAt = new Date(order.created_at);
          if (createdAt >= fourteenDaysAgo && createdAt <= today) {
            const key = createdAt.toLocaleDateString("hu-HU", {
              month: "short",
              day: "2-digit",
            });
            dailyCount[key] = (dailyCount[key] || 0) + 1;
          }
        });

        const formattedData = Object.entries(dailyCount).map(([date, orders]) => ({
          date,
          orders,
        }));

        setOrdersPerDayData(formattedData);
      }
    };

    fetchOrdersPerDay();
  }, []);

  if (
    userCount === null ||
    productCount === null ||
    activeOrdersCount === null
  ) return null;

  return (
    <>
      {/* Top statisztikák */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard label="Összes felhasználó" icon={<Users size={20} className="text-[#FF6000]" />} value={userCount} />
        <StatCard label="Összes termék" icon={<Package size={20} className="text-[#FF6000]" />} value={productCount} />
        <StatCard label="Aktív rendelések" icon={<ShoppingBag size={20} className="text-[#FF6000]" />} value={activeOrdersCount} />
        <StatCard label="Bevétel (30 nap)" icon={<DollarSign size={20} className="text-[#FF6000]" />} value={`$${revenue?.toLocaleString("en-US", { minimumFractionDigits: 2 })}`} />
      </div>

      {/* Diagram szekció */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartCard title="Rendelések / nap">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={ordersPerDayData}>
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="orders" fill="#FF6000" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Felhasználók szerepkör szerint">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={getPercentageData()}
                dataKey="value"
                nameKey="name"
                outerRadius={70}
                label={({ cx, cy, midAngle, innerRadius, outerRadius, index }) => {
                  const percent = getPercentageData()[index]?.percent ?? 0;
                  const RADIAN = Math.PI / 180;
                  const radius = innerRadius + (outerRadius - innerRadius) / 2;
                  const x = cx + radius * Math.cos(-midAngle * RADIAN);
                  const y = cy + radius * Math.sin(-midAngle * RADIAN);
                  return (
                    <text
                      x={x}
                      y={y}
                      fill="white"
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize={12}
                      fontWeight={600}
                    >
                      {`${percent}%`}
                    </text>
                  );
                }}
                labelLine={false}
              >
                {getPercentageData().map(({ name }, index) => {
                  const colorMap: Record<string, string> = {
                    admin: "#FF6000",
                    user: "#FFA559",
                    sales_manager: "#FFB26B",
                  };
                  return <Cell key={`cell-${index}`} fill={colorMap[name] || "#ccc"} />;
                })}
              </Pie>
              <Legend formatter={(value) =>
                (value as string).charAt(0).toUpperCase() + (value as string).slice(1).replace("_", " ")
              } />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Bevétel változás (30 nap)">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={revenueData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#FF6000" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </>
  );
}

// Statisztikai kártya komponens
function StatCard({ label, icon, value }: { label: string, icon: React.ReactNode, value: string | number }) {
  return (
    <div className="bg-white shadow-md p-5 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-500">{label}</span>
        {icon}
      </div>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

// Általános kártya
function ChartCard({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="bg-white p-6 shadow-md rounded-lg">
      <h2 className="text-md font-semibold mb-4 text-[#FF6000]">{title}</h2>
      {children}
    </div>
  );
}
