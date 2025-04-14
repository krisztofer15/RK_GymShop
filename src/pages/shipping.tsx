import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabaseClient";
import { motion } from "framer-motion";
import {
  MapPin,
  Building,
  Mail,
  Globe,
  Loader2,
  PackageCheck,
} from "lucide-react";

export default function Shipping() {
  const [userId, setUserId] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const [orderTotal, setOrderTotal] = useState<number | null>(null);
  const [orderDiscount, setOrderDiscount] = useState<number | null>(null);
  const [orderSubtotal, setOrderSubtotal] = useState<number | null>(null);
  const [usedPromoCode, setUsedPromoCode] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkUserAndOrder = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return router.push("/login");
      setUserId(user.id);

      const storedOrderId = localStorage.getItem("order_id");
      if (!storedOrderId) return router.push("/cart");

      setOrderId(storedOrderId);

      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .select("subtotal, discount, final_total, promo_code_id")
        .eq("id", storedOrderId)
        .maybeSingle();

      if (orderData) {
        setOrderTotal(orderData.final_total);
        setOrderDiscount(orderData.discount);
        setOrderSubtotal(orderData.subtotal);

        // Kuponkód lekérése az aktuális rendeléshez
        if (orderData.promo_code_id) {
          const { data: promoData, error: promoError } = await supabase
            .from("promo_codes")
            .select("code")
            .eq("id", orderData.promo_code_id)
            .maybeSingle();

          if (promoData?.code) {
            setUsedPromoCode(promoData.code);
          }
        }
      }
    };
    checkUserAndOrder();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    if (!validateInputs()) return;

    // e.preventDefault();
    if (!userId || !orderId) return;
    setLoading(true);

    const response = await fetch("/api/shipping/shipping", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        order_id: orderId,
        address,
        city,
        postal_code: postalCode,
        country,
      }),
    });

    const result = await response.json();
    setLoading(false);

    if (response.ok) {
      router.push(`/payment?order_id=${orderId}`);
    } else {
      alert(result.message || "Error submitting shipping details");
    }
  };

  const validateInputs = () => {
    const newErrors: { [key: string]: string } = {};

    if (address.trim().length < 5) {
      newErrors.address = "Address must be at least 5 characters.";
    }

    if (!/^[\p{L}\s]{2,}$/u.test(city)) {
      newErrors.city =
        "City must contain only letters and be at least 2 characters.";
    }

    if (!/^\d{4,}$/.test(postalCode)) {
      newErrors.postalCode = "Postal code must be at least 4 digits.";
    }

    if (!/^[\p{L}\s]{2,}$/u.test(country)) {
      newErrors.country =
        "Country must contain only letters and be at least 2 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Motion Variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        delay: 0.2,
      },
    },
  };
  

  return (
    <div className="relative h-full min-h-screen w-full bg-white py-10 px-4 flex justify-center items-center">
      <div className="absolute inset-0 bg-[radial-gradient(#d1d5db_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] z-0"></div>

      {/* Tartalom */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative z-10 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        {/* Order Summary */}
        <div className="bg-white shadow-md rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <PackageCheck className="w-5 h-5 text-[#FF6000]" />
            Order Summary
          </h2>
          <div className="text-sm text-gray-600">
            <p>
              Make sure your shipping details are correct before proceeding to
              payment.
            </p>
            <ul className="mt-6 space-y-2">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#FF6000]" />
                Shipping to:{" "}
                <span className="font-medium text-gray-900">
                  {address || "..."}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Building className="w-4 h-4 text-[#FF6000]" />
                City:{" "}
                <span className="font-medium text-gray-900">
                  {city || "..."}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#FF6000]" />
                Postal Code:{" "}
                <span className="font-medium text-gray-900">
                  {postalCode || "..."}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#FF6000]" />
                Country:{" "}
                <span className="font-medium text-gray-900">
                  {country || "..."}
                </span>
              </li>
            </ul>

            {orderTotal !== null && (
              <div className="mt-6 border-t pt-4 text-sm text-gray-700 space-y-1">
                {orderDiscount &&
                  orderDiscount > 0 &&
                  orderSubtotal !== null && (
                    <>
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span className="text-gray-900">
                          ${orderSubtotal.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>
                          Discount
                          {usedPromoCode && (
                            <span className="text-xs text-gray-500 ml-1">
                              (Code:{" "}
                              <span className="text-[#FF6000] font-medium">
                                {usedPromoCode}
                              </span>
                              )
                            </span>
                          )}
                          :
                        </span>
                        <span className="text-green-600 font-medium">
                          - ${orderDiscount.toFixed(2)}
                        </span>
                      </div>
                    </>
                  )}
                <div className="flex justify-between font-semibold text-gray-800 border-t pt-2">
                  <span>Total:</span>
                  <span className="text-[#FF6000] font-bold">
                    ${orderTotal.toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Shipping Form */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">
            Shipping Details
          </h2>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!validateInputs()) return;
              handleSubmit(e);
            }}
            className="flex flex-col"
          >
            {/* Address */}
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              onBlur={() => {
                if (address.trim().length < 5) {
                  setErrors((prev) => ({
                    ...prev,
                    address: "Address must be at least 5 characters.",
                  }));
                } else {
                  setErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors.address;
                    return newErrors;
                  });
                }
              }}
              placeholder="Address"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF6000] mb-2"
            />
            {errors.address && (
              <p className="text-red-500 text-sm mb-3">{errors.address}</p>
            )}

            {/* City */}
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onBlur={() => {
                if (!/^[\p{L}\s]{2,}$/u.test(city)) {
                  setErrors((prev) => ({
                    ...prev,
                    city: "City must contain only letters and be at least 2 characters.",
                  }));
                } else {
                  setErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors.city;
                    return newErrors;
                  });
                }
              }}
              placeholder="City"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF6000] mb-2"
            />
            {errors.city && (
              <p className="text-red-500 text-sm mb-3">{errors.city}</p>
            )}

            {/* Postal Code */}
            <input
              type="text"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              onBlur={() => {
                if (!/^\d{4,}$/.test(postalCode)) {
                  setErrors((prev) => ({
                    ...prev,
                    postalCode: "Postal code must be at least 4 digits.",
                  }));
                } else {
                  setErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors.postalCode;
                    return newErrors;
                  });
                }
              }}
              placeholder="Postal Code"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF6000] mb-2"
            />
            {errors.postalCode && (
              <p className="text-red-500 text-sm mb-3">{errors.postalCode}</p>
            )}

            {/* Country */}
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              onBlur={() => {
                if (!/^[\p{L}\s]{2,}$/u.test(country)) {
                  setErrors((prev) => ({
                    ...prev,
                    country:
                      "Country must contain only letters and be at least 2 characters.",
                  }));
                } else {
                  setErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors.country;
                    return newErrors;
                  });
                }
              }}
              placeholder="Country"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF6000] mb-2"
            />
            {errors.country && (
              <p className="text-red-500 text-sm mb-3">{errors.country}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FF6000] hover:bg-[#FFA559] text-white font-semibold py-2 rounded-md transition mt-4"
            >
              {loading ? (
                <span className="flex justify-center items-center">
                  <Loader2 className="animate-spin mr-2" size={18} />
                  Saving...
                </span>
              ) : (
                "Continue to Payment"
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
