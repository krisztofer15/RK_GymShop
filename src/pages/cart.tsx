import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import { Trash, Plus, Minus } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { PostgrestError } from "@supabase/supabase-js";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import { FreeMode, Autoplay } from "swiper/modules";
import InfoModal from "./components/InfoModal";

type CartItem = {
  id: string;
  product: {
    id: string;
    name: string;
    price: number;
    description: string;
  };
  quantity: number;
};

type RecommendedProduct = {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
};

type SupabaseResponse<T> = {
  data: T | null;
  error: PostgrestError | null;
};

export default function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [recommendedItems, setRecommendedItems] = useState<
    RecommendedProduct[]
  >([]);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoCodeId, setPromoCodeId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [infoModal, setInfoModal] = useState({
    isOpen: false,
    message: "",
    title: ""
  });
  const router = useRouter();

  const fetchCartItems = useCallback(async () => {
    setLoading(true);

    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData || !userData.user) {
      router.push("/login");
      return;
    }

    // Beállítjuk a userId-t
    setUserId(userData.user.id);

    const { data, error } = await supabase
      .from("cart_items")
      .select(
        `
                id,
                quantity,
                product:products (id, name, price, description)
            `
      )
      .eq("user_id", userData.user.id);

    if (error) {
      console.error("Error fetching cart items:", error);
    } else if (data) {
      // Csoportosítjuk a termékeket az `product.id` alapján
      const groupedItems = data.reduce((acc, item: any) => {
        const existingItem = acc.find((i) => i.product.id === item.product.id);
        if (existingItem) {
          existingItem.quantity += item.quantity;
        } else {
          acc.push(item);
        }
        return acc;
      }, [] as CartItem[]);

      setCartItems(groupedItems);
    }

    setLoading(false);
  }, [router]);

  useEffect(() => {
    fetchCartItems();

    const fetchRecommendedItems = async () => {
      const { data, error }: SupabaseResponse<RecommendedProduct[]> =
        await supabase
          .from("products")
          .select("id, name, price, description, image");

      if (error) {
        console.error("Error fetching recommended items:", error);
      } else if (data) {
        setRecommendedItems(data.sort(() => 0.5 - Math.random()).slice(0, 10));
      }
    };

    fetchRecommendedItems();
  }, [router, fetchCartItems]);

  const handleAddToCart = async (product: RecommendedProduct) => {
    try {
      // Ellenőrizzük, hogy van-e bejelentkezett felhasználó
      if (!userId) {
        console.error("No user logged in");
        router.push("/login");
        return;
      }

      const existingItem = cartItems.find(
        (item) => item.product.id === product.id
      );

      if (existingItem) {
        await handleUpdateQuantity(
          existingItem.product.id,
          existingItem.quantity + 1
        );
      } else {
        const { data, error } = await supabase
          .from("cart_items")
          .insert({
            product_id: product.id,
            quantity: 1,
            user_id: userId  // Hozzáadjuk a user_id mezőt
          })
          .select("id");

        if (error) {
          console.error("Error adding item to cart:", error);
        } else if (data) {
          setCartItems([
            ...cartItems,
            {
              id: data[0].id,
              product: product,
              quantity: 1,
            },
          ]);
        }
      }

      localStorage.setItem("cart", JSON.stringify(cartItems));
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  const handleRemoveItem = async (productId: string) => {
    try {
      const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("product_id", productId);

      if (error) {
        console.error("Error removing item:", error);
      } else {
        setCartItems(cartItems.filter((item) => item.product.id !== productId));
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  const handleUpdateQuantity = async (
    productId: string,
    newQuantity: number
  ) => {
    if (newQuantity < 1) return;

    try {
      // Frissítjük a termék összes rekordját
      const { error } = await supabase
        .from("cart_items")
        .update({ quantity: newQuantity })
        .eq("product_id", productId);

      if (error) {
        console.error("Error updating quantity:", error);
      } else {
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item.product.id === productId
              ? { ...item, quantity: newQuantity }
              : item
          )
        );
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  const applyPromoCode = async () => {
    const total = calculateTotal();
    const { data: userData } = await supabase.auth.getUser();

    if (!userData?.user) {
      setInfoModal({
        isOpen: true,
        message: "Be kell jelentkezned a kuponkód alkalmazásához.",
        title: "Figyelmeztetés"
      });
      return;
    }

    const response = await fetch("/api/promos/apply", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        promo_code: promoCode,
        user_id: userData.user.id,
        cart_total: total,
      }),
    });

    const result = await response.json();

    if (response.ok) {
      setDiscount(result.discount);
      setPromoCodeId(result.promo_code_id);
    } else {
      setInfoModal({
        isOpen: true,
        message: result.message,
        title: "Hiba"
      });
    }
  };

  //******************************************* */
  const handleProceedToCheckout = async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) {
      router.push("/login");
      return;
    }
  
    const user_id = userData.user.id;
    const subtotal = calculateTotal();
    const final_total = subtotal - discount;
  
    // Átalakítjuk a cartItems tömböt az API-hoz
    const cart_items = cartItems.map((item) => ({
      product_id: item.product.id,
      quantity: item.quantity,
      price: item.product.price,
    }));
  
    try {
      const response = await fetch("/api/orders/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id,
          cart_items,
          subtotal,
          discount,
          final_total,
          promo_code_id: promoCodeId,
        }),
      });
  
      const result = await response.json();
  
      if (response.ok && result.order_id) {
        localStorage.setItem("order_id", result.order_id);
        router.push(`/shipping?order_id=${result.order_id}`);
      } else {
        alert("Hiba történt a rendelés létrehozásakor.");
        console.error(result.message);
      }
    } catch (err) {
      console.error("Hiba történt:", err);
      alert("Szerverhiba történt. Próbáld újra.");
    }
  };
  

  const extendedItems =
  recommendedItems.length < 10
    ? Array(50).fill(recommendedItems).flat()
    : recommendedItems;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">
        Your Shopping Cart
      </h1>

      {loading ? (
        <p className="text-gray-500 animate-pulse">Loading...</p>
      ) : cartItems.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white shadow rounded-lg p-4">
              <div className="divide-y divide-gray-100">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between py-4 hover:bg-gray-50"
                  >
                    <div className="flex-grow">
                      <h2 className="text-base font-semibold text-gray-800">
                        {item.product.name}
                      </h2>
                      <p className="text-xs text-gray-500">
                        {item.product.description}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() =>
                            handleUpdateQuantity(
                              item.product.id,
                              item.quantity - 1
                            )
                          }
                          className="p-1 bg-gray-200 rounded-full hover:bg-gray-300 transition"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleUpdateQuantity(
                              item.product.id,
                              item.quantity + 1
                            )
                          }
                          className="p-1 bg-gray-200 rounded-full hover:bg-gray-300 transition"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <p className="text-sm font-semibold text-[#FF6000]">
                        ${item.product.price.toFixed(2)}
                      </p>
                      <button
                        onClick={() => handleRemoveItem(item.product.id)}
                        className="p-1 bg-[#FF6000] text-white rounded-full hover:bg-[#FFA559] transition"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6 space-y-6">
              <div className="flex justify-between">
                <span className="text-sm font-semibold text-gray-700">
                  Subtotal
                </span>
                <span className="text-lg font-bold text-gray-900">
                  ${(calculateTotal() - discount).toFixed(2)}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Promo Code
                </label>
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6000]"
                  placeholder="Enter your promo code"
                />
              </div>
              <button
                onClick={applyPromoCode}
                className="w-20 py-2 bg-[#FF6000] text-white text-sm rounded-lg hover:bg-[#FFA559] transition"
              >
                Apply
              </button>
              <button
                onClick={handleProceedToCheckout}
                className="w-full py-3 bg-[#FF6000] text-white text-sm rounded-lg hover:bg-[#FFA559] transition"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>

          {/* RecommendedItems */}

          <div className="mt-16 max-w-[1200px] mx-auto">
            <h2 className="text-lg font-bold text-gray-900 mb-6">
              Recommended for you
            </h2>
            <Swiper
              spaceBetween={15}
              slidesPerView={2}
              breakpoints={{
                640: { slidesPerView: 2 }, // Mobilon 2 kártya
                1024: { slidesPerView: 3 }, // Tableten 3 kártya
                1280: { slidesPerView: 4 }, // Nagyobb képernyőn max 4 kártya
              }}
              freeMode={true}
              loop={false}
              speed={12000} // Mozgás sebessége (minél nagyobb, annál lassabb)
              autoplay={{
                delay: 0, // Azonnal indul
                disableOnInteraction: false,
              }}
              allowTouchMove={false}
              modules={[Autoplay, FreeMode]}
              className="w-full overflow-hidden"
            >
              {extendedItems.map((item, index) => (
                <SwiperSlide key={index} className="!w-[220px] flex-shrink-0">
                  <div className="p-4 bg-white shadow rounded-lg text-center min-w-[180px] max-w-[220px] h-[300px] flex flex-col">
                    {/* Kép */}
                    <div className="w-full h-[120px] flex items-center justify-center mb-2 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="object-contain rounded-md max-h-full max-w-full"
                      />
                    </div>
                    <h3 className="text-base font-semibold text-gray-800 mb-1 line-clamp-1">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2 h-10 overflow-hidden mb-2">
                      {item.description}
                    </p>
                    <p className="text-sm text-[#FF6000] mb-2">
                      ${item.price.toFixed(2)}
                    </p>
                    <div className="mt-auto">
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="w-full px-4 py-2 bg-[#FF6000] text-white text-xs rounded-lg hover:bg-[#FFA559] transition"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </>
      )}
      
      {/* Info Modal */}
      <InfoModal 
        isOpen={infoModal.isOpen}
        message={infoModal.message}
        title={infoModal.title}
        onClose={() => setInfoModal(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
