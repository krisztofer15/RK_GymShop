import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Trash2, Edit3, Plus } from "lucide-react";
import ConfirmModal from "./ConfirmModal";
import CouponFormModal from "./CouponFormModal";
import Pagination from "./Pagination";

type Coupon = {
  id: string;
  code: string;
  discount_percentage: number;
  minimum_amount: number | null;
  single_use: boolean;
  valid_until: string;
};

export default function CouponList() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedCouponId, setSelectedCouponId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const totalPages = Math.ceil(coupons.length / itemsPerPage);
  const paginatedCoupons = coupons.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const loggedInUser = JSON.parse(localStorage.getItem("user") || "{}");

  const fetchCoupons = async () => {
    try {
      const res = await fetch("/api/promos/get-promos");
      const data = await res.json();
      if (res.ok) {
        setCoupons(data.promos || []);
      } else {
        toast.error(data.message || "Hiba a kuponok betöltésekor.");
      }
    } catch {
      toast.error("Nem sikerült betölteni a kuponokat.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleDeleteClick = (couponId: string) => {
    setSelectedCouponId(couponId);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedCouponId) return;

    const res = await fetch("/api/promos/delete-promo", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: loggedInUser.id,
        promo_code_id: selectedCouponId,
      }),
    });

    const data = await res.json();
    if (res.ok) {
      setCoupons((prev) => prev.filter((c) => c.id !== selectedCouponId));
      toast.success("Kupon sikeresen törölve.");
    } else {
      toast.error(data.message || "Hiba történt törléskor.");
    }

    setConfirmOpen(false);
    setSelectedCouponId(null);
  };

  const handleSubmit = async (formData: Omit<Coupon, "id">) => {
    const payload = {
      user_id: loggedInUser.id,
      ...formData,
      ...(editingCoupon ? { promo_code_id: editingCoupon.id } : {}),
    };

    const res = await fetch(
      editingCoupon ? "/api/promos/update-promo" : "/api/promos/create-promo",
      {
        method: editingCoupon ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const data = await res.json();

    if (res.ok) {
      toast.success(editingCoupon ? "Kupon frissítve." : "Kupon létrehozva.");
      setShowForm(false);
      setEditingCoupon(null);
      fetchCoupons();
    } else {
      toast.error(data.message || "Hiba mentéskor.");
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-[#FF6000]">Kuponok</h2>
        <button
          onClick={() => {
            setEditingCoupon(null);
            setShowForm(true);
          }}
          className="flex items-center gap-1 px-3 py-1 bg-[#FF6000] text-white text-sm rounded hover:bg-orange-600"
        >
          <Plus size={16} /> Új kupon
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Betöltés...</p>
      ) : coupons.length === 0 ? (
        <p className="text-gray-500">Nincsenek kuponok.</p>
      ) : (
        <>
          {/* Asztali nézet (tábla) */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="min-w-full table-auto border border-gray-200">
              <thead className="bg-gray-100 text-sm text-gray-700 text-left">
                <tr>
                  <th className="px-4 py-2">Kód</th>
                  <th className="px-4 py-2">% kedvezmény</th>
                  <th className="px-4 py-2">Minimum érték</th>
                  <th className="px-4 py-2">Egyszer használható?</th>
                  <th className="px-4 py-2">Érvényesség</th>
                  <th className="px-4 py-2">Művelet</th>
                </tr>
              </thead>
              <tbody>
                {paginatedCoupons.map((coupon) => (
                  <tr key={coupon.id} className="border-t hover:bg-gray-50 text-sm">
                    <td className="px-4 py-2">{coupon.code}</td>
                    <td className="px-4 py-2">{coupon.discount_percentage}%</td>
                    <td className="px-4 py-2">
                      {coupon.minimum_amount ? `$${coupon.minimum_amount}` : "Nincs"}
                    </td>
                    <td className="px-4 py-2">{coupon.single_use ? "Igen" : "Nem"}</td>
                    <td className="px-4 py-2">
                      {new Date(coupon.valid_until).toLocaleDateString("hu-HU")}
                    </td>
                    <td className="px-4 py-2 flex gap-2">
                      <button
                        className="text-[#FF6000] hover:text-[#FFA559]"
                        onClick={() => {
                          setEditingCoupon(coupon);
                          setShowForm(true);
                        }}
                      >
                        <Edit3 size={18} />
                      </button>
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDeleteClick(coupon.id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobil nézet (kártyás) */}
          <div className="lg:hidden space-y-4">
            {paginatedCoupons.map((coupon) => (
              <div key={coupon.id} className="border rounded-md p-4 shadow-sm bg-gray-50">
                <p className="text-sm font-semibold text-gray-700">Kód: {coupon.code}</p>
                <p className="text-sm">% Kedvezmény: {coupon.discount_percentage}%</p>
                <p className="text-sm">
                  Minimum rendelés:{" "}
                  {coupon.minimum_amount ? `$${coupon.minimum_amount}` : "Nincs"}
                </p>
                <p className="text-sm">Egyszer használható: {coupon.single_use ? "Igen" : "Nem"}</p>
                <p className="text-sm">
                  Érvényes: {new Date(coupon.valid_until).toLocaleDateString("hu-HU")}
                </p>

                <div className="mt-3 flex gap-3">
                  <button
                    className="text-[#FF6000]"
                    onClick={() => {
                      setEditingCoupon(coupon);
                      setShowForm(true);
                    }}
                  >
                    <Edit3 size={18} />
                  </button>
                  <button
                    className="text-red-500"
                    onClick={() => handleDeleteClick(coupon.id)}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
        message="Biztosan törölni szeretnéd ezt a kupont?"
      />

      {showForm && (
        <CouponFormModal
          editingCoupon={editingCoupon}
          onClose={() => {
            setShowForm(false);
            setEditingCoupon(null);
          }}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
