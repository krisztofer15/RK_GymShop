import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../../lib/supabaseClient";

type UserResponse = {
  id: string;
  name: string;
  email: string;
  created: string;
  user_roles: {
    roles: {
      name: string;
    };
  }[];
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { data, error } = await supabase
    .from("users")
    .select(`
      id,
      name,
      email,
      created,
      user_roles (
        roles (
          name
        )
      )
    `) as unknown as { data: UserResponse[]; error: any };

  if (error) {
    return res.status(500).json({ message: "Hiba a felhasználók lekérdezésekor.", error });
  }

  const formattedUsers = data.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    created: user.created,
    role: user.user_roles?.[0]?.roles?.name || "user",
  }));

  res.status(200).json({ users: formattedUsers });
}
