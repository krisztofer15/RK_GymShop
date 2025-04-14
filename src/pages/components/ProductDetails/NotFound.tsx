import { useRouter } from "next/router";
import { X } from "lucide-react";
import { motion } from "framer-motion";

const NotFound: React.FC = () => {
  const router = useRouter();

  const handleHomeClick = () => {
    router.push("/home");
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center py-12 bg-white rounded-xl shadow-sm"
    >
      <motion.div
        animate={{ 
          rotate: [0, 10, -10, 10, 0],
        }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <X size={48} className="mx-auto text-gray-400 mb-4" />
      </motion.div>
      <h2 className="text-xl text-gray-700 mb-2">A termék nem található</h2>
      <p className="text-gray-500 mb-6">Az általad keresett termék nem elérhető vagy nem létezik.</p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleHomeClick}
        className="bg-[#FF6000] hover:bg-[#FFA559] text-white py-2 px-6 rounded-md transition-colors"
      >
        Vissza a főoldalra
      </motion.button>
    </motion.div>
  );
};

export default NotFound;
