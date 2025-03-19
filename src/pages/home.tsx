import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Search, ShoppingCart, User, Box, Pill, PillBottle, Tablets, Shirt, Donut, Wheat, Dumbbell, X } from "lucide-react";
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


    // Felhasználói session ellenőrzése és kosár elemek betöltése
    useEffect(() => {
        const fetchUserAndCart = async () => {
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                setUserId(user.id);
                fetchCartItems(user.id);
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
            let query = supabase.from("products").select("id, name, price, description, rating, category_id, image");

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
            const { data, error } = await supabase.from("categories").select("id, name");

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
            const { error } = await supabase.from("cart_items").insert([
                { user_id: userId, product_id: productId, quantity: 1 },
            ]);

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
                return <PillBottle size={18} className="group-hover:text-white transition" />;
            case "Accessories":
                return <Dumbbell size={18} className="group-hover:text-white transition" />;
            case "Fitness Clothes":
                return <Shirt size={18} className="group-hover:text-white transition" />;
            case "Proteins":
                return <Donut size={18} className="group-hover:text-white transition" />;
            case "Grains":
                return <Wheat size={18} className="group-hover:text-white transition" />;
            case "Diet Supplements":
                return <Tablets size={18} className="group-hover:text-white transition" />;
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
                    <Image src="/images/Logo_original.png" width={40} height={40} alt="Logo" priority />
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
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                    </div>
                </div>

                <div className="flex basis-1/3 justify-end space-x-4">
                    <button
                        onClick={handleCartClick}
                        className="flex items-center text-gray-700 hover:text-[#FF6000] transition relative"
                    >
                        <ShoppingCart size={24} />
                        {cartItemCount > 0 && (
                            <span className="ml-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                {cartItemCount}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={handleProfileClick}
                        className="flex items-center text-gray-700 hover:text-[#FF6000] transition"
                    >
                        <User size={24} />
                    </button>
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
                            selectedCategory === category.id ? "bg-[#FFA559]" : "bg-gray-200 hover:bg-[#FFA559]"
                        }`}
                        onClick={() => handleCategoryClick(category.id)}
                    >
                        {getCategoryIcon(category.name)}
                        <span
                            className={`text-xs font-medium mt-1 text-center truncate w-full transition ${
                                selectedCategory === category.id ? "text-white" : "text-gray-400 group-hover:text-white"
                            }`}
                        >
                            {category.name}
                        </span>
                    </div>
                ))}
            </div>

            {/* Termékek */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8 px-4">
                {loading ? (
                    <p className="text-center col-span-3 text-sm font-medium text-gray-500">Loading...</p>
                ) : filteredProducts.length === 0 ? (
                    <p className="text-center col-span-3 text-sm font-medium text-gray-500">
                        Nincsenek találatok.
                    </p>
                ) : (
                    filteredProducts.map((product) => (
                        <div
                            key={product.id}
                            className="bg-white rounded-xl p-4 shadow-lg transition-transform hover:scale-105 hover:shadow-xl cursor-pointer flex items-center"
                            style={{ height: "200px" }}
                        >
                            <div className="flex-1">
                                <h2 className="text-lg font-semibold text-[#1D1617] mb-2">{product.name}</h2>
                                <p className="text-xs text-gray-500 mb-3 line-clamp-2">{product.description}</p>
                                <p className="text-xl font-bold text-[#FF6000] mb-1">${product.price.toFixed(2)}</p>
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
        </ScreenWrapper>
    );
}
