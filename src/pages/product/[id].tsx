import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { supabase } from "../../lib/supabaseClient";
import ScreenWrapper from "../../helpers/ScreenWrapper";
import { 
  ProductImage, 
  ProductInfo, 
  ProductActions, 
  Navbar, 
  Breadcrumb, 
  Footer, 
  LoadingSpinner, 
  NotFound,
  Product
} from "../components/ProductDetails";

export default function ProductDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  // Felhasználói szerepkör lekérése és kosár elemek betöltése
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

  // Termék lekérése
  useEffect(() => {
    const fetchProduct = async () => {
      if (id) {
        try {
          const { data, error } = await supabase
            .from("products")
            .select("*")
            .eq("id", id)
            .single();

          if (error) {
            console.error("Error fetching product:", error);
            setLoading(false);
            return;
          }

          // Termék adatok formázása
          if (data) {
            // Több kép kezelése (ha van)
            const productWithImages = {
              ...data,
              images: data.image ? [data.image] : []
            };
            
            setProduct(productWithImages);
          }
        } catch (err) {
          console.error("Unexpected error:", err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProduct();
  }, [id]);

  // Keresés kezelése
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term.trim()) {
      router.push(`/search?q=${encodeURIComponent(term)}`);
    }
  };

  return (
    <ScreenWrapper>
      <Navbar 
        cartItemCount={cartItemCount} 
        userRole={userRole} 
        searchTerm={searchTerm} 
        setSearchTerm={handleSearch}
      />
      
      <Breadcrumb productName={product?.name || null} />
      
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <LoadingSpinner />
        ) : !product ? (
          <NotFound />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Product Image */}
            <div className="lg:col-span-1">
              <ProductImage product={product} />
            </div>
            
            {/* Product Info */}
            <div className="lg:col-span-1">
              <ProductInfo product={product} />
            </div>
            
            {/* Product Actions */}
            <div className="lg:col-span-1">
              <ProductActions 
                product={product} 
                userId={userId} 
                cartItemCount={cartItemCount} 
                setCartItemCount={setCartItemCount} 
              />
            </div>
          </div>
        )}
      </div>
      
      <Footer />
    </ScreenWrapper>
  );
}
