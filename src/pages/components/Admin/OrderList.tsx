import { useEffect, useState } from "react";
import Pagination from "./Pagination"; // ha máshol van, igazítsd az elérési utat

type Order = {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  subtotal: number;
  discount: number;
  final_total: number;
  status: string;
  created_at: string;
};

export default function OrderList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/orders/admin-orders");
        const data = await res.json();
        if (res.ok) {
          setOrders(data.orders || []);
        } else {
          console.error(data.message);
        }
      } catch (err) {
        console.error("Hiba a rendelések lekérésekor", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const groupedOrders = orders.reduce((acc: Record<string, Order[]>, order) => {
    if (!acc[order.user_id]) {
      acc[order.user_id] = [];
    }
    acc[order.user_id].push(order);
    return acc;
  }, {});

  const groupedUsers = Object.entries(groupedOrders);
  const totalPages = groupedUsers.length;
  const currentUserData = groupedUsers[currentPage - 1]; // csak 1 user per oldal

  return (
    <div className="bg-white p-6 rounded shadow-md">
      <h2 className="text-xl font-semibold text-[#FF6000] mb-4">Rendelések</h2>

      {loading ? (
        <p className="text-gray-500">Betöltés...</p>
      ) : orders.length === 0 || !currentUserData ? (
        <p className="text-gray-500">Nincsenek rendelések.</p>
      ) : (
        <>
          <div className="border rounded-lg shadow-sm bg-gray-100 p-4">
            <p className="font-semibold text-[#FFA559] text-sm mb-2">
              {currentUserData[1][0].user_name} – {currentUserData[1][0].user_email}
            </p>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-2">
              {currentUserData[1].map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded p-3 shadow-sm flex justify-between items-center text-sm"
                >
                  <div>
                    <p className="font-medium">
                      Végösszeg: ${order.final_total.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(order.created_at).toLocaleString("hu-HU")}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      order.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 🔸 Saját Pagination komponensed használata */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
}
