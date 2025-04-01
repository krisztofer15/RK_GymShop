import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../../lib/supabaseClient";
import { checkUserRole } from "../../../pages/api/utils/checkRole";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { user_id, target_id, new_role_id } = req.body;

  // Csak admin jogosultság
  const isAdmin = await checkUserRole(user_id, ["admin"]);
  if (!isAdmin) {
    return res.status(403).json({ message: "Nincs jogosultság szerepkör módosításához." });
  }

  // Ne módosítsa saját szerepkörét
  if (user_id === target_id) {
    return res.status(403).json({ message: "Saját szerepkör nem módosítható." });
  }

  // Ellenőrizd, hogy van-e már bejegyzés a user_roles táblában
  const { data: existing, error: fetchError } = await supabase
    .from("user_roles")
    .select("*")
    .eq("user_id", target_id)
    .single();

  if (fetchError && fetchError.code !== "PGRST116") {
    return res.status(500).json({ message: "Hiba a szerepkör lekérdezésekor.", error: fetchError });
  }

  let updateError;

  if (existing) {
    // Frissítjük a meglévő rekordot
    const { error } = await supabase
      .from("user_roles")
      .update({ role_id: new_role_id })
      .eq("user_id", target_id);
    updateError = error;
  } else {
    // Létrehozunk egy új rekordot
    const { error } = await supabase.from("user_roles").insert({
      user_id: target_id,
      role_id: new_role_id,
    });
    updateError = error;
  }

  if (updateError) {
    return res.status(500).json({ message: "Hiba a szerepkör frissítésekor.", error: updateError });
  }

  return res.status(200).json({ message: "Szerepkör sikeresen frissítve." });
}
