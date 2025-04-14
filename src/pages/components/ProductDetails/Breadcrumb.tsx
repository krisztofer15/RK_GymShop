import { useRouter } from "next/router";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

interface BreadcrumbProps {
  productName: string | null;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ productName }) => {
  const router = useRouter();

  const handleHomeClick = () => {
    router.push("/home");
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-4"
    >
      <div className="flex items-center text-sm text-gray-500">
        <button onClick={handleHomeClick} className="hover:text-[#FF6000] transition-colors">
          Főoldal
        </button>
        <ChevronRight size={14} className="mx-2" />
        <span className="text-gray-700 font-medium">
          {productName || "Termék részletek"}
        </span>
      </div>
    </motion.div>
  );
};

export default Breadcrumb;
