import { motion } from "framer-motion";

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-64">
      <motion.div 
        animate={{ 
          rotate: 360,
          scale: [1, 1.1, 1]
        }} 
        transition={{ 
          rotate: { duration: 1.5, repeat: Infinity, ease: "linear" },
          scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
        }}
        className="w-16 h-16 border-4 border-[#FF6000] border-t-transparent rounded-full"
      />
    </div>
  );
};

export default LoadingSpinner;
