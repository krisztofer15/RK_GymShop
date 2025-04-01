import { X } from "lucide-react";

type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category_id: string;
};

type Props = {
  editingProduct: Product | null;
  categoryMap: Record<string, string>;
  onClose: () => void;
  onSubmit: (productData: {
    name: string;
    price: number;
    description: string;
    image: string;
    category_id: string;
  }) => void;
};

export default function ProductFormModal({
  editingProduct,
  categoryMap,
  onClose,
  onSubmit,
}: Props) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-[90%] sm:w-full max-w-md p-6 relative">
        <h3 className="text-xl font-semibold mb-4">
          {editingProduct ? "Termék szerkesztése" : "Új termék hozzáadása"}
        </h3>

        {/* Bezáró gomb */}
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
          onClick={onClose}
        >
          <X size={24} />
        </button>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const formData = new FormData(form);

            onSubmit({
              name: String(formData.get("name")),
              price: Number(formData.get("price")),
              description: String(formData.get("description")),
              image: String(formData.get("image")),
              category_id: String(formData.get("category_id")),
            });

            form.reset();
          }}
        >
          {/* ────────── FORM ────────── */}
          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">Név</label>
            <input
              type="text"
              name="name"
              defaultValue={editingProduct?.name || ""}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">Leírás</label>
            <textarea
              name="description"
              defaultValue={editingProduct?.description || ""}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">Ár</label>
            <input
              type="number"
              name="price"
              step="0.01"
              defaultValue={editingProduct?.price || ""}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">Kép URL</label>
            <input
              type="text"
              name="image"
              defaultValue={editingProduct?.image || ""}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Kategória</label>
            <select
              name="category_id"
              defaultValue={editingProduct?.category_id || ""}
              required
              className="w-full border px-3 py-2 rounded"
            >
              <option value="">-- Válassz kategóriát --</option>
              {Object.entries(categoryMap).map(([id, name]) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-[#FF6000] text-white px-4 py-2 rounded hover:bg-orange-600"
            >
              {editingProduct ? "Mentés" : "Létrehozás"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
            >
              Mégse
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
