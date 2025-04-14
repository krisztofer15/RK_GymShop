import { Facebook, Instagram, Twitter } from "lucide-react";
import Image from "next/image";

const Footer: React.FC = () => {
  return (
    <footer className="mt-48 bg-gray-100 text-gray-700 w-full h-screen/2">
      <div className="container mx-auto px-4 py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 h-full">
        {/* LOGO + DESCRIPTION */}
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <Image
              src="/images/Logo_original.png"
              alt="Logo"
              width={30}
              height={30}
            />
            <span className="text-base font-bold text-[#FF6000]">
              RK_GymShop
            </span>
          </div>
          <p className="text-sm text-gray-600">
            Ahol az edzés kezdődik. Minőségi termékek sportolóknak.
          </p>
        </div>

        {/* NAVIGATION */}
        <div className="flex-1">
          <h3 className="text-base font-semibold mb-3 text-[#FF6000]">
            Navigáció
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/home" className="hover:text-[#FF6000]">
                Főoldal
              </a>
            </li>
            <li>
              <a href="/profile" className="hover:text-[#FF6000]">
                Profil
              </a>
            </li>
            <li>
              <a href="/cart" className="hover:text-[#FF6000]">
                Kosár
              </a>
            </li>
          </ul>
        </div>

        {/* CONTACT */}
        <div className="flex-1">
          <h3 className="text-base font-semibold mb-3 text-[#FF6000]">
            Kapcsolat
          </h3>
          <p className="text-sm">info@gymshop.hu</p>
          <p className="text-sm">+36 30 123 4567</p>
          <div className="flex space-x-4 mt-3">
            <a href="#" className="hover:text-[#FF6000] transition">
              <Facebook size={18} />
            </a>
            <a href="#" className="hover:text-[#FF6000] transition">
              <Instagram size={18} />
            </a>
            <a href="#" className="hover:text-[#FF6000] transition">
              <Twitter size={18} />
            </a>
          </div>
        </div>

        {/* NEWSLETTER */}
        <div className="flex-1">
          <h3 className="text-base font-semibold mb-3 text-[#FF6000]">
            Hírlevél
          </h3>
          <p className="text-sm mb-2">Iratkozz fel az újdonságokért!</p>
          <input
            type="email"
            placeholder="Email címed..."
            className="w-full px-3 py-2 border rounded-md text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-[#FF6000]"
          />
          <button className="w-full bg-[#FF6000] text-white py-2 rounded-md text-sm hover:bg-[#FFA559] transition">
            Feliratkozás
          </button>
        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="bg-white py-3 text-center text-sm text-gray-500 border-t">
        {new Date().getFullYear()} RK_GymShop. Minden jog fenntartva.
      </div>
    </footer>
  );
};

export default Footer;
