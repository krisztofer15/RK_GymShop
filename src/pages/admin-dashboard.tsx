import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { hasAccess } from "../helpers/roleGuard";
import { supabase } from "../lib/supabaseClient";
import DashboardStats from "./components/Admin/DashboardStats";
import ProductTable from "./components/Admin/ProductTable";
import ProductFormModal from "./components/Admin/ProductFormModal";
import Pagination from "./components/Admin/Pagination";
import UserList from "./components/Admin/UserList";
import OrderList from "./components/Admin/OrderList";
import CouponList from "./components/Admin/CouponList";
import Sidebar from "./components/Admin/Sidebar";

type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category_id: string;
};

export default function AdminDashboard() {
  const router = useRouter();
  const [activePage, setActivePage] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [productList, setProductList] = useState<Product[]>([]);
  const [categoryMap, setCategoryMap] = useState<Record<string, string>>({});
  const [currentPage, setCurrentPage] = useState(1); // új: aktuális oldal
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const itemsPerPage = 6; // új: elemek száma oldalon

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

    if (activePage === "products") {
      fetchProducts();
      fetchCategories();
    }
  }, [activePage]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const role = user?.role;

    if (!hasAccess(role, ["admin"])) {
      router.push("/");
    }
  }, [router]);

  useEffect(() => {
    // automatikus scroll felfelé lapozáskor
    const container = document.getElementById("main-content");
    container?.scrollIntoView({ behavior: "smooth" });
  }, [currentPage]);

  const handleDelete = async (productId: string) => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

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
    } else {
      alert(data.message || "Hiba történt törléskor.");
    }
  };

  // Lapozáshoz szükséges kiszámolások
  const totalPages = Math.ceil(productList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = productList.slice(startIndex, endIndex);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* SIDEBAR */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        activePage={activePage}
        setActivePage={setActivePage}
      />

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8 overflow-y-auto min-h-screen">
        <h1 className="text-2xl font-bold text-[#FF6000] mb-6">
          Admin Dashboard
        </h1>

        {activePage === "dashboard" && <DashboardStats />}

        {activePage === "users" && <UserList />}

        {activePage === "orders" && <OrderList />}

        {activePage === "coupons" && <CouponList />}

        {/* Termékek kezelése */}
        {activePage === "products" && (
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

            {/* TERMÉK TÁBLA - helyettesíti az asztali és mobil nézetet */}
            <ProductTable
              products={paginatedProducts}
              categoryMap={categoryMap}
              onEdit={(product) => {
                setEditingProduct(product);
                setShowForm(true);
              }}
              onDelete={handleDelete}
            />

            {/* Lapozás */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />

            {/* 🧾 Termék létrehozás/szerkesztés űrlap */}
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
                  } else {
                    alert(data.message || "Hiba történt mentéskor.");
                  }
                }}
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
}
