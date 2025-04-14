import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { hasAccess } from "../helpers/roleGuard";
import { supabase } from "../lib/supabaseClient";
import ProductTable from "./components/SalesManager/ProductTable";
import ProductFormModal from "./components/Admin/ProductFormModal";
import Pagination from "./components/SalesManager/Pagination";
import Sidebar from "./components/SalesManager/Sibebar";
import ConfirmModal from "./components/SalesManager/ConfirmModal";
import toast from "react-hot-toast";

type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category_id: string;
};

export default function ProductDashboard() {
  const router = useRouter();
  const [activePage, setActivePage] = useState("products");
  const [collapsed, setCollapsed] = useState(false);
  const [productList, setProductList] = useState<Product[]>([]);
  const [categoryMap, setCategoryMap] = useState<Record<string, string>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    productId: "",
    message: "",
  });
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchProducts = async () => {
      const { data: products, error } = await supabase
        .from("products")
        .select("*");

      if (!error && products) {
        setProductList(products);
      }
    };

    const fetchCategories = async () => {
      const { data: categories, error } = await supabase
        .from("categories")
        .select("id, name");

      if (!error && categories) {
        const map: Record<string, string> = {};
        categories.forEach((cat) => {
          map[cat.id] = cat.name;
        });
        setCategoryMap(map);
      }
    };

    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const role = user?.role;

    if (!hasAccess(role, ["sales_manager"])) {
      router.push("/");
    }
  }, [router]);

  useEffect(() => {
    // automatikus scroll felfelé lapozáskor
    const container = document.getElementById("main-content");
    container?.scrollIntoView({ behavior: "smooth" });
  }, [currentPage]);

  const handleDeleteConfirm = (productId: string) => {
    const product = productList.find((p) => p.id === productId);
    setConfirmModal({
      isOpen: true,
      productId,
      message: `Biztosan törölni szeretnéd a(z) "${product?.name}" terméket?`,
    });
  };

  const handleDelete = async (productId: string) => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const deleteToast = toast.loading("Termék törlése folyamatban...");

    try {
      const res = await fetch("/api/products/delete-product", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user?.id,
          product_id: productId,
        }),
      });

      const data = await res.json();
      
      if (res.ok) {
        setProductList((prev) => prev.filter((p) => p.id !== productId));
        toast.success("Termék sikeresen törölve!", { id: deleteToast });
      } else {
        toast.error(data.message || "Hiba történt törléskor.", { id: deleteToast });
      }
    } catch (error) {
      toast.error("Váratlan hiba történt a törlés során.", { id: deleteToast });
    } finally {
      setConfirmModal({ isOpen: false, productId: "", message: "" });
    }
  };

  // Lapozáshoz szükséges kiszámolások
  const totalPages = Math.ceil(productList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = productList.slice(startIndex, endIndex);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Megerősítő modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, productId: "", message: "" })}
        onConfirm={() => handleDelete(confirmModal.productId)}
        message={confirmModal.message}
      />

      {/* SIDEBAR */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        activePage={activePage}
        setActivePage={setActivePage}
      />

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8 overflow-y-auto min-h-screen">
        {/* Hamburger menü gomb mobilon */}
        <div className="flex items-center justify-between mb-4 md:hidden">
          <button 
            onClick={() => setCollapsed(!collapsed)} 
            className="p-2 rounded-md hover:bg-gray-100 focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          <h1 className="text-xl font-bold text-[#FF6000]">
            Sales Manager Dashboard
          </h1>
        </div>

        {/* Cím - csak asztali nézetben */}
        <h1 className="text-2xl font-bold text-[#FF6000] mb-6 hidden md:block">
          Sales Manager Dashboard
        </h1>

        {/* Termékek kezelése */}
        <div className="bg-white p-6 rounded shadow-md">
          <h2 className="text-xl font-semibold text-[#FF6000] mb-4">
            Termékek kezelése
          </h2>

          {/* Új termék gomb */}
          <div className="mb-4">
            <button
              className="bg-[#FF6000] text-white px-2 py-1 rounded hover:bg-orange-600"
              onClick={() => {
                setEditingProduct(null);
                setShowForm(true);
              }}
            >
              + Új termék hozzáadása
            </button>
          </div>

          {/* TERMÉK TÁBLA */}
          <ProductTable
            products={paginatedProducts}
            categoryMap={categoryMap}
            onEdit={(product) => {
              setEditingProduct(product);
              setShowForm(true);
            }}
            onDelete={handleDeleteConfirm}
          />

          {/* Lapozás */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />

          {/* Termék létrehozás/szerkesztés űrlap */}
          {showForm && (
            <ProductFormModal
              editingProduct={editingProduct}
              categoryMap={categoryMap}
              onClose={() => {
                setShowForm(false);
                setEditingProduct(null);
              }}
              onSubmit={async (formData) => {
                const user = JSON.parse(localStorage.getItem("user") || "{}");

                const payload = {
                  user_id: user.id,
                  ...formData,
                  ...(editingProduct
                    ? { product_id: editingProduct.id }
                    : {}),
                };

                const saveToast = toast.loading(
                  editingProduct ? "Termék módosítása folyamatban..." : "Új termék létrehozása folyamatban..."
                );

                try {
                  const res = await fetch(
                    editingProduct
                      ? "/api/products/update-product"
                      : "/api/products/create-product",
                    {
                      method: editingProduct ? "PUT" : "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(payload),
                    }
                  );

                  const data = await res.json();
                  
                  if (res.ok) {
                    setShowForm(false);
                    setEditingProduct(null);
                    const { data: products } = await supabase
                      .from("products")
                      .select("*");
                    setProductList(products || []);
                    toast.success(
                      editingProduct 
                        ? "Termék sikeresen módosítva!" 
                        : "Új termék sikeresen létrehozva!", 
                      { id: saveToast }
                    );
                  } else {
                    toast.error(data.message || "Hiba történt mentéskor.", { id: saveToast });
                  }
                } catch (error) {
                  toast.error("Váratlan hiba történt a mentés során.", { id: saveToast });
                }
              }}
            />
          )}
        </div>
      </main>
    </div>
  );
}