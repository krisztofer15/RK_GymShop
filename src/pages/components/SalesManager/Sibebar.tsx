import Image from "next/image";
import { Package, Menu } from "lucide-react";
import { useState, useEffect } from "react";

export default function Sidebar({
  collapsed,
  setCollapsed,
  activePage,
  setActivePage,
}: any) {
  const [isMobile, setIsMobile] = useState(false);

  // Képernyőméret figyelése
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Kezdeti ellenőrzés
    checkIfMobile();
    
    // Ablakméret változásának figyelése
    window.addEventListener('resize', checkIfMobile);
    
    // Tisztítás
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  return (
    <div
      className={`bg-white shadow-md p-4 transition-all flex flex-col ${
        isMobile ? "fixed top-0 left-0 z-50 h-screen" : "h-screen"
      } ${isMobile && collapsed ? "w-16 -translate-x-full opacity-0" : "w-64"}`}
    >
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <Image
            src="/images/Logo_original.png"
            width={45}
            height={45}
            alt="logo"
            className="mr-2"
          />
        </div>
        {isMobile && (
          <button onClick={() => setCollapsed(!collapsed)} className="focus:outline-none">
            <Menu size={20} />
          </button>
        )}
      </div>

      <nav className="space-y-4">
        <SidebarButton
          icon={<Package size={18} />}
          label="Termékek kezelése"
          active={activePage === "products"}
          onClick={() => setActivePage("products")}
          collapsed={isMobile && collapsed}
        />
      </nav>
    </div>
  );
}

function SidebarButton({ icon, label, active, onClick, collapsed }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2 rounded-md w-full text-left transition ${
        active
          ? "bg-[#FF6000] text-white font-semibold"
          : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      {icon}
      {!collapsed && label}
    </button>
  );
}