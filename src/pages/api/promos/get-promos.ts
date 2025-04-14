// pages/api/promos/get-promos.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../../lib/supabaseClient";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { data, error } = await supabase
    .from("promo_codes")
    .select("*")
    .order("valid_until", { ascending: true });

  if (error) {
    return res.status(500).json({ message: "Hiba a kuponok lekérdezésekor.", error });
  }

  res.status(200).json({ promos: data });
}
