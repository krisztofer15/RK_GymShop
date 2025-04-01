import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../../lib/supabaseClient";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { user_id, target_user_id } = req.body;

  if (!user_id || !target_user_id) {
    return res.status(400).json({ message: "Hiányzó adatok." });
  }

  // Ne engedjük, hogy saját magát törölje
  if (user_id === target_user_id) {
    return res.status(403).json({ message: "Nem törölheted saját magad." });
  }

  // 1. Lekérjük az aktuális user szerepét
  const { data: userRoleData } = await supabase
    .from("user_roles")
    .select("role_id")
    .eq("user_id", user_id)
    .single();

  if (!userRoleData || userRoleData.role_id !== 3) {
    return res.status(403).json({ message: "Nincs jogosultságod törölni." });
  }

  // 2. Lekérjük a cél user szerepét
  const { data: targetRoleData } = await supabase
    .from("user_roles")
    .select("role_id")
    .eq("user_id", target_user_id)
    .single();

  if (targetRoleData?.role_id === 3) {
    return res.status(403).json({ message: "Nem törölhetsz másik admin felhasználót." });
  }

  // 3. Töröljük a user_roles bejegyzést először
  await supabase.from("user_roles").delete().eq("user_id", target_user_id);

  // 4. Majd a users táblából
  const { error } = await supabase.from("users").delete().eq("id", target_user_id);

  if (error) {
    return res.status(500).json({ message: "Hiba történt törlés közben.", error });
  }

  res.status(200).json({ message: "Felhasználó sikeresen törölve." });
}
