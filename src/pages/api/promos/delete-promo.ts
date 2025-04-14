// pages/api/promos/delete-promo.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../../lib/supabaseClient";
import { checkUserRole } from "../utils/checkRole";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { user_id, promo_code_id } = req.body;

  const isAdmin = await checkUserRole(user_id, ["admin"]);
  if (!isAdmin) {
    return res.status(403).json({ message: "Nincs jogosultságod a kupon törléséhez." });
  }

  const { error } = await supabase
    .from("promo_codes")
    .delete()
    .eq("id", promo_code_id);

  if (error) {
    return res.status(500).json({ message: "Hiba történt törléskor.", error });
  }

  res.status(200).json({ message: "Kupon sikeresen törölve." });
}
