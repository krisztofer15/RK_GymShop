import { useState } from "react";
import toast from "react-hot-toast";

type Coupon = {
  id: string;
  code: string;
  discount_percentage: number;
  minimum_amount: number | null;
  single_use: boolean;
  valid_until: string;
};

type Props = {
  editingCoupon: Coupon | null;
  onClose: () => void;
  onSubmit: (formData: Omit<Coupon, "id">) => void;
};

export default function CouponFormModal({ editingCoupon, onClose, onSubmit }: Props) {
  const [form, setForm] = useState<Omit<Coupon, "id">>({
    code: editingCoupon?.code || "",
    discount_percentage: editingCoupon?.discount_percentage || 0,
    minimum_amount: editingCoupon?.minimum_amount ?? null,
    single_use: editingCoupon?.single_use || false,
    valid_until: editingCoupon?.valid_until?.slice(0, 10) || "", // csak yyyy-mm-dd
  });

  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, value, type, checked } = e.target;
  
    if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "number") {
      setForm((prev) => ({ ...prev, [name]: value === "" ? null : parseFloat(value) }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = () => {
    if (!form.code || form.discount_percentage <= 0 || !form.valid_until) {
      toast.error("Kérlek tölts ki minden kötelező mezőt!");
      return;
    }

    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-lg mx-4 shadow-lg">
        <h3 className="text-lg font-semibold mb-4 text-[#FF6000]">
          {editingCoupon ? "Kupon szerkesztése" : "Új kupon létrehozása"}
        </h3>

        <div className="space-y-3">
          <input
            type="text"
            name="code"
            placeholder="Kuponkód"
            value={form.code || ""}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />

          <input
            type="number"
            name="discount_percentage"
            placeholder="% Kedvezmény"
            value={form.discount_percentage ?? ""}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />

          <input
            type="number"
            name="minimum_amount"
            placeholder="Minimum rendelési összeg (opcionális)"
            value={form.minimum_amount ?? ""}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="single_use"
              checked={form.single_use}
              onChange={handleChange}
            />
            Egyszer használható kupon
          </label>

          <input
            type="date"
            name="valid_until"
            value={form.valid_until || ""}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 border rounded text-gray-600">
            Mégsem
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-[#FF6000] text-white rounded hover:bg-orange-600"
          >
            Mentés
          </button>
        </div>
      </div>
    </div>
  );
}
