// pages/payment.tsx

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabaseClient";
import { Loader2 } from "lucide-react";

export default function Payment() {
  const router = useRouter();
  const [orderId, setOrderId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const [finalTotal, setFinalTotal] = useState<number | null>(null);

  useEffect(() => {
    const fetchOrderInfo = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return router.push("/login");
      setUserId(user.id);

      const storedOrderId = router.query.order_id || localStorage.getItem("order_id");
      if (!storedOrderId || typeof storedOrderId !== "string") return router.push("/cart");
      setOrderId(storedOrderId);

      // Rendelés összegének lekérdezése
      const { data: order, error } = await supabase
        .from("orders")
        .select("final_total")
        .eq("id", storedOrderId)
        .maybeSingle();

      if (order) {
        setFinalTotal(order.final_total);
      }
    };

    fetchOrderInfo();
  }, [router]);

  const handlePayment = async () => {
    if (!orderId || !userId || !paymentMethod) return;
    setLoading(true);
  
    const response = await fetch("/api/payment/payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        order_id: orderId,
        user_id: userId,
        payment_method: paymentMethod,
        payment_status: "paid", // Simulated payment
      }),
    });
  
    const result = await response.json();
    setLoading(false);
  
    if (response.ok) {
      // ✅ Kosár törlése Supabase-ből
      const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("user_id", userId);
  
      if (error) {
        console.error("Error clearing cart after payment:", error);
      } else {
        console.log("Cart successfully cleared after payment.");
      }
  
      // 🧹 Töröljük a localStorage-ból az order_id-t is
      localStorage.removeItem("order_id");
  
      router.push("/thank-you"); // Thank-you oldal
    } else {
      alert(result.message || "Payment failed.");
    }
  };  

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 p-6">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Complete Your Payment
        </h1>

        {finalTotal !== null && (
          <div className="mb-6 text-center">
            <p className="text-lg text-gray-700">
              Amount to pay:{" "}
              <span className="font-bold text-[#FF6000]">
                ${finalTotal.toFixed(2)}
              </span>
            </p>
          </div>
        )}

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Payment Method
          </label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full border rounded-md px-4 py-2 focus:ring-2 focus:ring-[#FF6000]"
          >
            <option value="credit_card">Credit Card</option>
            <option value="paypal">PayPal</option>
            <option value="cod">Cash on Delivery</option>
          </select>
        </div>

        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full bg-[#FF6000] hover:bg-[#FFA559] text-white py-2 rounded-md font-semibold transition"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <Loader2 className="animate-spin mr-2" size={18} />
              Processing...
            </span>
          ) : (
            "Pay Now"
          )}
        </button>
      </div>
    </div>
  );
}

