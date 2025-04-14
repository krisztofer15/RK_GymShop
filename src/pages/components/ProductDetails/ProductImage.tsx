import { useState } from "react";
import Image from "next/image";
import { Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Product } from "./types";

interface ProductImageProps {
  product: Product;
}

const ProductImage: React.FC<ProductImageProps> = ({ product }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [imageRef, imageInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div 
      ref={imageRef}
      initial={{ opacity: 0, x: -50 }}
      animate={imageInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="bg-white rounded-xl shadow-sm overflow-hidden p-6"
    >
      <div className="relative h-80 w-full bg-gray-50 rounded-lg mb-4 overflow-hidden group">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, rotate: 360 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <Image
              src={product.image || "/images/placeholder.png"}
              alt={product.name}
              fill
              style={{ objectFit: 'contain' }}
              className="p-4 transition-transform duration-300 group-hover:scale-105"
              priority
            />
          </motion.div>
        </AnimatePresence>
        
        {/* Image navigation dots */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
          {[0, 1, 2].map((idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImage(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                selectedImage === idx 
                  ? "bg-[#FF6000] w-5" 
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
        
        {/* Zoom overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="bg-white bg-opacity-90 p-2 rounded-full"
          >
            <Search size={20} className="text-gray-700" />
          </motion.div>
        </div>
      </div>
      
      {/* Thumbnail images */}
      <div className="grid grid-cols-3 gap-2">
        {[0, 1, 2].map((idx) => (
          <motion.button
            key={idx}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedImage(idx)}
            className={`relative h-20 bg-gray-50 rounded-md overflow-hidden border-2 transition-all duration-200 ${
              selectedImage === idx ? "border-[#FF6000]" : "border-transparent hover:border-gray-300"
            }`}
          >
            <Image
              src={product.image || "/images/placeholder.png"}
              alt={`Thumbnail ${idx + 1}`}
              fill
              style={{ objectFit: 'contain' }}
              className="p-2"
            />
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default ProductImage;
