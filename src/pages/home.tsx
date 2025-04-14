import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Search,
  ShoppingCart,
  User,
  Box,
  Pill,
  PillBottle,
  Tablets,
  Shirt,
  Donut,
  Wheat,
  Dumbbell,
  X,
  Menu,
  Facebook,
  Instagram,
  Twitter,
} from "lucide-react";
import ScreenWrapper from "../helpers/ScreenWrapper";
import { supabase } from "../lib/supabaseClient";
import Image from "next/image";

type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  rating: number | null;
  category_id: string;
  image: string;
};

type Category = {
  id: string;
  name: string;
};

export default function Home() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [cartItemCount, setCartItemCount] = useState<number>(0);
  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // Felhasználói session ellenőrzése és kosár elemek betöltése
  useEffect(() => {
    const fetchUserAndCart = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUserId(user.id);
        fetchCartItems(user.id);

        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        if (storedUser?.role) {
          setUserRole(storedUser.role);
        }
      } else {
        router.push("/login");
      }
    };

    const fetchCartItems = async (userId: string) => {
      const { data, error } = await supabase
        .from("cart_items")
        .select("id")
        .eq("user_id", userId);

      if (error) {
        console.error("Error fetching cart items:", error);
      } else if (data) {
        setCartItemCount(data.length);
      }
    };

    fetchUserAndCart();
  }, [router]);

  // Termékek és kategóriák lekérése
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      let query = supabase
        .from("products")
        .select("id, name, price, description, rating, category_id, image");

      if (selectedCategory) {
        query = query.eq("category_id", selectedCategory);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching products:", error);
      } else if (data) {
        setProducts(data);
      }
      setLoading(false);
    };

    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name");

      if (error) {
        console.error("Error fetching categories:", error);
      } else if (data) {
        setCategories(data);
      }
    };

    fetchProducts();
    fetchCategories();
  }, [selectedCategory]);

  // Kosárhoz adás
  const handleAddToCart = async (productId: string) => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from("cart_items")
        .insert([{ user_id: userId, product_id: productId, quantity: 1 }]);

      if (error) {
        console.error("Error adding to cart:", error);
      } else {
        setCartItemCount(cartItemCount + 1);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  const handleCategoryClick = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
  };

  const handleCartClick = () => {
    router.push("/cart");
  };

  const handleProfileClick = () => {
    router.push("/profile");
  };

  const handleProductClick = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  const getCategoryIcon = (categoryName: string) => {
    switch (categoryName) {
      case "Vitamins":
        return <Pill size={18} className="group-hover:text-white transition" />;
      case "Shakerek":
        return (
          <PillBottle size={18} className="group-hover:text-white transition" />
        );
      case "Accessories":
        return (
          <Dumbbell size={18} className="group-hover:text-white transition" />
        );
      case "Fitness Clothes":
        return (
          <Shirt size={18} className="group-hover:text-white transition" />
        );
      case "Proteins":
        return (
          <Donut size={18} className="group-hover:text-white transition" />
        );
      case "Grains":
        return (
          <Wheat size={18} className="group-hover:text-white transition" />
        );
      case "Diet Supplements":
        return (
          <Tablets size={18} className="group-hover:text-white transition" />
        );
      default:
        return <Box size={18} className="group-hover:text-white transition" />;
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ScreenWrapper>
      {/* Navbar */}
      <nav className="flex items-center py-3 px-6 shadow-sm sticky top-2 border backdrop-blur-lg rounded-md z-50">
        <div className="flex items-center basis-1/3 justify-start space-x-3 cursor-pointer">
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

      {/* Ide irjuk ki hogy rendelkezik egy WELCOME10 kuponnal, amit egyszer használhat fel */}

      {/* Kategóriasáv */}
      <div className="flex overflow-x-auto justify-center space-x-4 mt-6 px-4 py-2 rounded-lg">
        <div
          className={`group flex flex-col items-center justify-center rounded-lg p-2 w-16 h-16 cursor-pointer bg-[#FF6000]`}
          onClick={() => handleCategoryClick(null)}
        >
          <X size={20} className="text-white transition" />
          <span className="text-xs font-medium text-white mt-1 text-center truncate w-full transition">
            All
          </span>
        </div>

        {categories.map((category) => (
          <div
            key={category.id}
            className={`group flex flex-col items-center justify-center rounded-lg p-2 w-16 h-16 cursor-pointer transition ${
              selectedCategory === category.id
                ? "bg-[#FFA559]"
                : "bg-gray-200 hover:bg-[#FFA559]"
            }`}
            onClick={() => handleCategoryClick(category.id)}
          >
            {getCategoryIcon(category.name)}
            <span
              className={`text-xs font-medium mt-1 text-center truncate w-full transition ${
                selectedCategory === category.id
                  ? "text-white"
                  : "text-gray-400 group-hover:text-white"
              }`}
            >
              {category.name}
            </span>
          </div>
        ))}
      </div>

      <main className="flex-grow">
      {/* Termékek */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 mt-6 px-4">
        {loading ? (
          <div className="col-span-full h-[200px] flex items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 border-3 border-[#FF6000] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs font-medium text-gray-500 mt-2">Betöltés...</p>
            </div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="col-span-full h-[200px] flex items-center justify-center">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-500">Nincsenek találatok</p>
              <p className="text-xs text-gray-400 mt-1">Próbálj más keresési feltételt</p>
            </div>
          </div>
        ) : (
          filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col cursor-pointer"
              onClick={() => handleProductClick(product.id)}
            >
              <div className="relative h-32 overflow-hidden bg-gray-50">
                <Image
                  src={product.image}
                  fill
                  style={{ objectFit: 'contain' }}
                  alt={product.name}
                  className="p-1 transition-transform duration-200 group-hover:scale-105"
                  priority
                />
                <div className="absolute top-1 right-1 bg-[#FF6000] text-white text-[10px] font-medium px-1.5 py-0.5 rounded-sm">
                  ${product.price.toFixed(2)}
                </div>
              </div>
              
              <div className="p-2 flex-1 flex flex-col">
                <h2 className="text-sm font-medium text-gray-800 line-clamp-1 mb-0.5">
                  {product.name}
                </h2>
                
                <div className="flex items-center mb-1">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg 
                        key={i} 
                        className={`w-3 h-3 ${i < Math.round(product.rating || 0) ? 'text-yellow-400' : 'text-gray-200'}`} 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                    ))}
                  </div>
                  <span className="text-[10px] text-gray-400 ml-1">({product.rating ? product.rating.toFixed(1) : '0.0'})</span>
                </div>
                
                <p className="text-xs text-gray-500 line-clamp-2 mb-2 flex-1">
                  {product.description}
                </p>
                
                <div className="flex items-center justify-between mt-auto">
                  <button
                    className="bg-white text-[#FF6000] border border-[#FF6000] hover:bg-[#FF6000] hover:text-white text-xs py-1 px-2 rounded transition-colors duration-200 flex items-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(product.id);
                    }}
                  >
                    <ShoppingCart size={12} className="mr-1" />
                    Kosárba
                  </button>
                  
                  <button 
                    onClick={() => handleProductClick(product.id)}
                    className="text-gray-300 hover:text-[#FF6000] transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      </main>
      {/* Footer */}
      <footer className="mt-20 bg-gray-100 text-gray-700 w-full">
        <div className="container mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* LOGO + DESCRIPTION */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Image
                src="/images/Logo_original.png"
                alt="Logo"
                width={30}
                height={30}
              />
              <span className="text-lg font-bold text-[#FF6000]">
                RK_GymShop
              </span>
            </div>
            <p className="text-sm text-gray-600">
              Ahol az edzés kezdődik. Minőségi termékek sportolóknak.
            </p>
          </div>

          {/* NAVIGATION */}
          <div>
            <h3 className="text-md font-semibold mb-3 text-[#FF6000]">
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
          <div>
            <h3 className="text-md font-semibold mb-3 text-[#FF6000]">
              Kapcsolat
            </h3>
            <p className="text-sm">info@gymshop.hu</p>
            <p className="text-sm">+36 30 123 4567</p>
            <div className="flex space-x-4 mt-3">
              <a href="#" className="hover:text-[#FF6000] transition">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:text-[#FF6000] transition">
                <Instagram size={20} />
              </a>
              <a href="#" className="hover:text-[#FF6000] transition">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* NEWSLETTER */}
          <div>
            <h3 className="text-md font-semibold mb-3 text-[#FF6000]">
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
        <div className="bg-white py-4 text-center text-xs text-gray-400 border-t">
          {new Date().getFullYear()} RK_GymShop. Minden jog fenntartva.
        </div>
      </footer>
    </ScreenWrapper>
  );
}
