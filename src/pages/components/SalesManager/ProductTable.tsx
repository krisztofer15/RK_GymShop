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
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Termék
              </th>
              <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ár
              </th>
              <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kategória
              </th>
              <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Műveletek
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0 mr-3">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <Package size={20} className="text-gray-500" />
                        </div>
                      )}
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {product.name}
                    </div>
                  </div>
                </td>
                <td className="py-2 px-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-900">
                    <DollarSign size={16} className="mr-1 text-green-600" />
                    {product.price.toFixed(2)}
                  </div>
                </td>
                <td className="py-2 px-4 whitespace-nowrap text-sm text-gray-500">
                  {categoryMap[product.category_id] || "Ismeretlen kategória"}
                </td>
                <td className="py-2 px-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => onEdit(product)}
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                  >
                    Szerkesztés
                  </button>
                  <button
                    onClick={() => onDelete(product.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Törlés
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={4} className="py-4 text-center text-gray-500">
                  Nincsenek termékek
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobil nézet */}
      <div className="md:hidden space-y-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
          >
            <div className="flex items-center mb-2">
              <div className="h-10 w-10 flex-shrink-0 mr-3">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <Package size={20} className="text-gray-500" />
                  </div>
                )}
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">
                  {product.name}
                </div>
                <div className="text-sm text-gray-500">
                  {categoryMap[product.category_id] || "Ismeretlen kategória"}
                </div>
              </div>
            </div>
            <div className="flex items-center mb-3 text-sm text-gray-900">
              <DollarSign size={16} className="mr-1 text-green-600" />
              {product.price.toFixed(2)}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => onEdit(product)}
                className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded"
              >
                Szerkesztés
              </button>
              <button
                onClick={() => onDelete(product.id)}
                className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded"
              >
                Törlés
              </button>
            </div>
          </div>
        ))}
        {products.length === 0 && (
          <div className="py-4 text-center text-gray-500">
            Nincsenek termékek
          </div>
        )}
      </div>
    </>
  );
}
