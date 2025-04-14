// pages/api/promos/create-promo.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../../lib/supabaseClient";
import { checkUserRole } from "../utils/checkRole";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { user_id, code, discount_percentage, minimum_amount, single_use, valid_until } = req.body;

  const isAdmin = await checkUserRole(user_id, ["admin"]);
  if (!isAdmin) {
    return res.status(403).json({ message: "Nincs jogosultságod a kupon létrehozásához." });
  }

  const { data, error } = await supabase.from("promo_codes").insert([
    {
      code,
      discount_percentage,
      minimum_amount,
      single_use,
      valid_until,
    },
  ])
  .select();

  if (error) {
    return res.status(500).json({ message: "Hiba történt a kupon létrehozásakor.", error });
  }

  res.status(200).json({ message: "Kupon sikeresen létrehozva.", data });
}
