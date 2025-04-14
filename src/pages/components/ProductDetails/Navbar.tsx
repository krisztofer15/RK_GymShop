import { useState } from "react";
import { useRouter } from "next/router";
import { Search, ShoppingCart, User, Menu } from "lucide-react";
import Image from "next/image";

interface NavbarProps {
  cartItemCount: number;
  userRole: string | null;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  cartItemCount, 
  userRole, 
  searchTerm, 
  setSearchTerm 
}) => {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleCartClick = () => {
    router.push("/cart");
  };

  const handleProfileClick = () => {
    router.push("/profile");
  };

  const handleHomeClick = () => {
    router.push("/home");
  };

  return (
    <nav className="flex items-center py-3 px-6 shadow-sm sticky top-2 border backdrop-blur-lg rounded-md z-50">
      <div className="flex items-center basis-1/3 justify-start space-x-3 cursor-pointer" onClick={handleHomeClick}>
        <Image
          src="/images/Logo_original.png"
          width={40}
          height={40}
          alt="Logo"
          priority
        />
        <span className="hidden md:block text-xl font-semibold text-[#FF6000]">
          RK_GymShop
        </span>
      </div>

      <div className="flex basis-1/3 justify-center">
        <div className="w-full max-w-lg relative">
          <input
            type="text"
            placeholder="Keresés termékek között..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-100 border border-gray-200 rounded-full py-2 px-4 pl-10 text-sm text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF6000]"
          />
          <Search
            className="absolute left-3 top-2.5 text-gray-400"
            size={20}
          />
        </div>
      </div>

      <div className="flex basis-1/3 justify-end items-center relative">
        {/* DESKTOP Gomb (admin / sales_manager) */}
        {(userRole === "admin" || userRole === "sales_manager") && (
          <button
            onClick={() =>
              userRole === "admin"
                ? router.push("/admin-dashboard")
                : router.push("/product-dashboard")
            }
            className="hidden md:inline-block text-sm font-medium text-white bg-[#FF6000] hover:bg-[#FFA559] px-3 py-1 rounded transition mr-4"
          >
            {userRole === "admin" ? "Admin panel" : "Termékek kezelése"}
          </button>
        )}

        {/* DESKTOP ikonok */}
        <div className="hidden md:flex items-center space-x-4">
          <button
            onClick={handleCartClick}
            className="text-gray-700 hover:text-[#FF6000] transition relative"
          >
            <ShoppingCart size={24} />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md">
                {cartItemCount}
              </span>
            )}
          </button>

          <button
            onClick={handleProfileClick}
            className="text-gray-700 hover:text-[#FF6000] transition"
          >
            <User size={24} />
          </button>
        </div>

        {/* MOBIL: Hamburger ikon */}
        <div className="md:hidden relative flex items-center justify-center">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-gray-700 hover:text-[#FF6000] transition"
          >
            <Menu size={24} />
          </button>

          {/* Mobil lenyíló menü */}
          {menuOpen && (
            <div className="absolute top-full right-0 mt-2 bg-white rounded shadow-lg z-50 py-2 w-48">
              {(userRole === "admin" || userRole === "sales_manager") && (
                <button
                  onClick={() =>
                    router.push(
                      userRole === "admin"
                        ? "/admin-dashboard"
                        : "/product-dashboard"
                    )
                  }
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  {userRole === "admin" ? "Admin panel" : "Termékek kezelése"}
                </button>
              )}
              <button
                onClick={handleProfileClick}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Profil
              </button>
              <button
                onClick={handleCartClick}
                className="w-full flex justify-between items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 relative"
              >
                Kosár
                {cartItemCount > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow">
                    {cartItemCount}
                  </span>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
