import { Package, DollarSign } from "lucide-react";

type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category_id: string;
};

type Props = {
  products: Product[];
  categoryMap: Record<string, string>;
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
};

export default function ProductTable({
  products,
  categoryMap,
  onEdit,
  onDelete,
}: Props) {
  return (
    <>
      {/* Asztali nézet */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="min-w-full table-auto border border-gray-200">
          <thead className="bg-gray-100">
            <tr className="text-left text-sm text-gray-700">
              <th className="px-4 py-2">Név</th>
              <th className="px-4 py-2">Leírás</th>
              <th className="px-4 py-2">Ár</th>
              <th className="px-4 py-2">Kategória</th>
              <th className="px-4 py-2">Kép</th>
              <th className="px-4 py-2">Műveletek</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t">
                <td className="px-4 py-2 text-sm font-medium">{product.name}</td>
                <td className="px-4 py-2 text-sm">{product.description}</td>
                <td className="px-4 py-2 text-sm">
                  ${product.price.toFixed(2)}
                </td>
                <td className="px-4 py-2 text-sm">
                  {categoryMap[product.category_id] || "?"}
                </td>
                <td className="px-4 py-2">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-10 w-10 object-cover rounded"
                  />
                </td>
                <td className="px-4 py-2 text-sm align-middle">
                  <div className="flex items-center gap-2">
                    <button
                      className="text-xs bg-[#FF6000] text-white px-2 py-1 rounded hover:bg-[#FFA559]"
                      onClick={() => onEdit(product)}
                    >
                      Szerkesztés
                    </button>
                    <button
                      className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      onClick={() => onDelete(product.id)}
                    >
                      Törlés
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobil nézet */}
      <div className="sm:hidden space-y-4 mt-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-md p-4"
          >
            <div className="flex items-center gap-4 mb-2">
              <img
                src={product.image}
                alt={product.name}
                className="w-16 h-16 object-cover rounded"
              />
              <div>
                <h3 className="font-bold text-lg">{product.name}</h3>
                <p className="text-sm text-gray-500 line-clamp-2">
                  {product.description}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm mb-1 text-gray-700">
              <DollarSign size={16} className="text-[#FF6000]" />
              <span>
                <b>Ár:</b> ${product.price.toFixed(2)}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm mb-2 text-gray-700">
              <Package size={16} className="text-[#FF6000]" />
              <span>
                <b>Kategória:</b> {categoryMap[product.category_id] || "?"}
              </span>
            </div>

            <div className="flex gap-2">
              <button
                className="text-xs bg-[#FF6000] text-white px-3 py-1 rounded hover:bg-[#FFA559]"
                onClick={() => onEdit(product)}
              >
                Szerkesztés
              </button>
              <button
                className="text-xs bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                onClick={() => onDelete(product.id)}
              >
                Törlés
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
