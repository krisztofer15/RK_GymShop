import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../../lib/supabaseClient";
import { checkUserRole } from "../utils/checkRole";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const {
    user_id,
    promo_code_id,
    code,
    discount_percentage,
    minimum_amount,
    single_use,
    valid_until,
  } = req.body;

  // Jogosultság ellenőrzés
  const isAdmin = await checkUserRole(user_id, ["admin"]);
  if (!isAdmin) {
    return res.status(403).json({ message: "Nincs jogosultságod a kupon módosításához." });
  }

  const { error } = await supabase
    .from("promo_codes")
    .update({
      code,
      discount_percentage,
      minimum_amount,
      single_use,
      valid_until
    })
    .eq("id", promo_code_id);

  if (error) {
    return res.status(500).json({ message: "Hiba a kupon frissítésekor.", error });
  }

  res.status(200).json({ message: "Kupon sikeresen frissítve." });
}
