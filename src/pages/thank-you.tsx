import { useEffect } from "react";
import { useRouter } from "next/router";
import { CheckCircle } from "lucide-react";

export default function ThankYou() {
  const router = useRouter();

  useEffect(() => {
    // Biztonság kedvéért eltávolítjuk a rendelés ID-t localStorage-ból is
    localStorage.removeItem("order_id");
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-4 py-12">
      <div className="bg-white shadow-md rounded-lg p-10 max-w-md w-full text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Thank You for Your Purchase!
        </h1>
        <p className="text-gray-600 mb-6">
          Your payment was successful and your order is being processed.
        </p>

        <button
          onClick={() => router.push("/")}
          className="mt-4 px-6 py-2 bg-[#FF6000] hover:bg-[#FFA559] text-white rounded-md text-sm font-semibold transition"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}
