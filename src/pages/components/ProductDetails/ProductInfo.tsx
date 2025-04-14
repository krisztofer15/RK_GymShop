import { useState } from "react";
import { Star, StarHalf, Truck, Shield, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Product } from "./types";

interface ProductInfoProps {
  product: Product;
}

const ProductInfo: React.FC<ProductInfoProps> = ({ product }) => {
  const [activeTab, setActiveTab] = useState<'description' | 'reviews' | 'shipping'>('description');
  const [titleRef, titleInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Tab váltás
  const handleTabChange = (tab: 'description' | 'reviews' | 'shipping') => {
    setActiveTab(tab);
  };

  // Csillagok renderelése az értékeléshez
  const renderRating = (rating: number | null) => {
    if (!rating) return null;
    
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`star-${i}`} size={18} className="fill-yellow-400 text-yellow-400" />
        ))}
        
        {hasHalfStar && <StarHalf size={18} className="fill-yellow-400 text-yellow-400" />}
        
        {[...Array(5 - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
          <Star key={`empty-star-${i}`} size={18} className="text-gray-300" />
        ))}
        
        <span className="ml-2 text-sm text-gray-500">({rating.toFixed(1)})</span>
      </div>
    );
  };

  return (
    <motion.div 
      ref={titleRef}
      initial={{ opacity: 0, y: 30 }}
      animate={titleInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
      className="bg-white rounded-xl shadow-sm p-6 mb-4"
    >
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{product.name}</h1>
          <div className="mb-2">
            {renderRating(product.rating)}
          </div>
        </div>
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-2xl font-bold text-[#FF6000]"
        >
          ${product.price.toFixed(2)}
        </motion.div>
      </div>
      
      {/* Tabs */}
      <div className="mt-6 border-b border-gray-200">
        <div className="flex space-x-6">
          {[
            { id: 'description', label: 'Leírás' },
            { id: 'reviews', label: 'Értékelések' },
            { id: 'shipping', label: 'Szállítás' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id as any)}
              className={`pb-2 text-sm font-medium transition-colors relative ${
                activeTab === tab.id 
                  ? 'text-[#FF6000]' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF6000]" 
                />
              )}
            </button>
          ))}
        </div>
      </div>
      
      {/* Tab Content */}
      <div className="py-4">
        <AnimatePresence mode="wait">
          {activeTab === 'description' && (
            <motion.div
              key="description"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </motion.div>
          )}
          
          {activeTab === 'reviews' && (
            <motion.div
              key="reviews"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-medium mr-3">JK</div>
                  <div>
                    <p className="font-medium text-gray-800">János K.</p>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} className={i < 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />
                      ))}
                    </div>
                  </div>
                </div>
                <span className="text-xs text-gray-500">2 napja</span>
              </div>
              <p className="text-gray-600 text-sm">Kiváló termék, nagyon elégedett vagyok vele. Gyors szállítás, jó minőség.</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-medium mr-3">BP</div>
                  <div>
                    <p className="font-medium text-gray-800">Balázs P.</p>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} className={i < 5 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />
                      ))}
                    </div>
                  </div>
                </div>
                <span className="text-xs text-gray-500">1 hete</span>
              </div>
              <p className="text-gray-600 text-sm">Tökéletes! Pontosan azt kaptam, amit vártam. Ajánlom mindenkinek.</p>
            </motion.div>
          )}
          
          {activeTab === 'shipping' && (
            <motion.div
              key="shipping"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="flex items-start">
                <Truck className="text-[#FF6000] mr-3 mt-1" size={18} />
                <div>
                  <p className="font-medium text-gray-800">Ingyenes szállítás</p>
                  <p className="text-gray-600 text-sm">15.000 Ft feletti rendelés esetén</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Clock className="text-[#FF6000] mr-3 mt-1" size={18} />
                <div>
                  <p className="font-medium text-gray-800">Gyors kézbesítés</p>
                  <p className="text-gray-600 text-sm">2-3 munkanapon belül</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Shield className="text-[#FF6000] mr-3 mt-1" size={18} />
                <div>
                  <p className="font-medium text-gray-800">Garancia</p>
                  <p className="text-gray-600 text-sm">14 napos pénzvisszafizetési garancia</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ProductInfo;
