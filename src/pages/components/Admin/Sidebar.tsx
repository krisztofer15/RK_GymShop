import Image from "next/image";
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  Percent,
  Menu,
  Package,
} from "lucide-react";

export default function Sidebar({
  collapsed,
  setCollapsed,
  activePage,
  setActivePage,
}: any) {
  const isCollapsed = typeof window !== "undefined" && window.innerWidth >= 1024 ? collapsed : false;

  return (
    <div
      className={`bg-white shadow-md p-4 transition-all flex flex-col
      ${isCollapsed ? "w-16" : "w-full lg:w-64"} min-h-full`}
    >
      <div className="flex justify-between items-center mb-8">
        {/* Csak asztali nézetben jelenjen meg a logo és menü gomb */}
        <div className="hidden lg:flex w-full justify-between items-center">
          {!collapsed && (
            <Image
              src="/images/Logo_original.png"
              width={45}
              height={45}
              alt="logo"
            />
          )}
          <button onClick={() => setCollapsed(!collapsed)}>
            <Menu size={20} />
          </button>
        </div>
        {/* Mobilon megjelenhet fixen a logó */}
        <div className="lg:hidden">
          <Image
            src="/images/Logo_original.png"
            width={45}
            height={45}
            alt="logo"
          />
        </div>
      </div>

      <nav className="space-y-4">
        <SidebarButton
          icon={<LayoutDashboard size={18} />}
          label="Statisztikák"
          active={activePage === "dashboard"}
          onClick={() => setActivePage("dashboard")}
          collapsed={isCollapsed}
        />
        <SidebarButton
          icon={<Users size={18} />}
          label="Felhasználók"
          active={activePage === "users"}
          onClick={() => setActivePage("users")}
          collapsed={isCollapsed}
        />
        <SidebarButton
          icon={<ShoppingBag size={18} />}
          label="Rendelések"
          active={activePage === "orders"}
          onClick={() => setActivePage("orders")}
          collapsed={isCollapsed}
        />
        <SidebarButton
          icon={<Percent size={18} />}
          label="Kuponok"
          active={activePage === "coupons"}
          onClick={() => setActivePage("coupons")}
          collapsed={isCollapsed}
        />
        <SidebarButton
          icon={<Package size={18} />}
          label="Termékek kezelése"
          active={activePage === "products"}
          onClick={() => setActivePage("products")}
          collapsed={isCollapsed}
        />
      </nav>
    </div>
  );
}

function SidebarButton({ icon, label, active, onClick, collapsed }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2 rounded-md w-full text-left transition
      ${active ? "bg-[#FF6000] text-white font-semibold" : "text-gray-700 hover:bg-gray-100"}`}
    >
      {icon}
      {!collapsed && label}
    </button>
  );
}
