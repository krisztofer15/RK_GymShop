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
  rating: number;
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

  // const handleProductClick = (productId: string) => {
  //     router.push(`/product/${productId}`);
  // };

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8 px-4">
        {loading ? (
          <div className="col-span-3 h-[300px] flex items-center justify-center">
          <p className="text-sm font-medium text-gray-500">Loading...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="col-span-3 h-[300px] flex items-center justify-center">
    <p className="text-sm font-medium text-gray-500">Nincsenek találatok.</p>
  </div>
        ) : (
          filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl p-4 shadow-lg transition-transform hover:scale-105 hover:shadow-xl cursor-pointer flex items-center"
              style={{ height: "200px" }}
            >
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-[#1D1617] mb-2">
                  {product.name}
                </h2>
                <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                  {product.description}
                </p>
                <p className="text-xl font-bold text-[#FF6000] mb-1">
                  ${product.price.toFixed(2)}
                </p>
                <button
                  className="mt-2 bg-[#FF6000] text-white text-sm py-1 px-3 rounded-md hover:bg-[#FFA559] transition"
                  onClick={() => handleAddToCart(product.id)}
                >
                  Add to Cart
                </button>
              </div>
              <Image
                src={product.image}
                width={120}
                height={120}
                alt={product.name}
                className="rounded-lg"
                priority
              />
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
          © {new Date().getFullYear()} RK_GymShop. Minden jog fenntartva.
        </div>
      </footer>
    </ScreenWrapper>
  );
}
