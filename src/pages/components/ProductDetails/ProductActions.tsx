import { useState } from "react";
import { ShoppingCart, Heart, Minus, Plus, Check, Truck, Shield, Clock, Share2, Facebook, Instagram, Twitter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Product } from "./types";
import { supabase } from "../../../lib/supabaseClient";

interface ProductActionsProps {
  product: Product;
  userId: string | null;
  cartItemCount: number;
  setCartItemCount: (count: number) => void;
}

const ProductActions: React.FC<ProductActionsProps> = ({ 
  product, 
  userId, 
  cartItemCount, 
  setCartItemCount 
}) => {
  const [quantity, setQuantity] = useState(1);
  const [showAddedToCart, setShowAddedToCart] = useState(false);
  const [actionsRef, actionsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Mennyiség növelése/csökkentése
  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  // Kosárhoz adás
  const handleAddToCart = async () => {
    if (!userId || !product) return;

    try {
      const { error } = await supabase
        .from("cart_items")
        .insert([{ user_id: userId, product_id: product.id, quantity: quantity }]);

      if (error) {
        console.error("Error adding to cart:", error);
      } else {
        setCartItemCount(cartItemCount + 1);
        setShowAddedToCart(true);
        setTimeout(() => setShowAddedToCart(false), 3000);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  return (
    <motion.div 
      ref={actionsRef}
      initial={{ opacity: 0, y: 30 }}
      animate={actionsInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
      className="bg-white rounded-xl shadow-sm p-6"
    >
      {/* Quantity Selector */}
      <div className="mb-5">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Mennyiség:</h3>
        <div className="flex items-center">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={decreaseQuantity}
            className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-l-md bg-gray-50 text-gray-600 hover:bg-gray-100"
          >
            <Minus size={14} />
          </motion.button>
          <div className="w-12 h-8 flex items-center justify-center border-t border-b border-gray-300 bg-white text-gray-700">
            {quantity}
          </div>
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={increaseQuantity}
            className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-r-md bg-gray-50 text-gray-600 hover:bg-gray-100"
          >
            <Plus size={14} />
          </motion.button>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="flex-1 bg-[#FF6000] hover:bg-[#FFA559] text-white py-3 px-6 rounded-md flex items-center justify-center transition-colors"
          onClick={handleAddToCart}
        >
          <ShoppingCart size={18} className="mr-2" />
          Kosárba
        </motion.button>
        <motion.button 
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 py-3 px-6 rounded-md flex items-center justify-center transition-colors"
        >
          <Heart size={18} className="mr-2" />
          Kedvencekhez
        </motion.button>
      </div>
      
      {/* Added to cart notification */}
      <AnimatePresence>
        {showAddedToCart && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="mt-4 bg-green-50 text-green-700 p-3 rounded-md flex items-center"
          >
            <Check size={18} className="mr-2" />
            <span>Termék a kosárba helyezve!</span>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Additional Info */}
      <div className="mt-6 pt-4 border-t border-gray-200 grid grid-cols-2 gap-4">
        <div className="flex items-center">
          <Truck size={16} className="text-gray-400 mr-2" />
          <span className="text-sm text-gray-600">Ingyenes szállítás</span>
        </div>
        <div className="flex items-center">
          <Shield size={16} className="text-gray-400 mr-2" />
          <span className="text-sm text-gray-600">Garancia</span>
        </div>
        <div className="flex items-center">
          <Clock size={16} className="text-gray-400 mr-2" />
          <span className="text-sm text-gray-600">Gyors kézbesítés</span>
        </div>
        <div className="flex items-center">
          <Check size={16} className="text-gray-400 mr-2" />
          <span className="text-sm text-gray-600">Készleten</span>
        </div>
      </div>
      
      {/* Social Sharing */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600 mb-2">Megosztás:</p>
        <div className="flex space-x-3">
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="text-blue-600 hover:text-blue-700">
            <Facebook size={20} />
          </motion.button>
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="text-pink-600 hover:text-pink-700">
            <Instagram size={20} />
          </motion.button>
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="text-blue-400 hover:text-blue-500">
            <Twitter size={20} />
          </motion.button>
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="text-gray-600 hover:text-gray-700">
            <Share2 size={20} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductActions;
