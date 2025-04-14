import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // 🔶 Összes rendelés lekérdezése
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (ordersError) throw ordersError;

    // 🔶 Felhasználók lekérdezése (id + name/email)
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, name, email');

    if (usersError) throw usersError;

    // 🔶 Összekapcsolás (user név/email hozzárendelése a rendeléshez)
    const enrichedOrders = orders.map((order) => {
      const user = users.find((u) => u.id === order.user_id);
      return {
        ...order,
        user_name: user?.name || 'Ismeretlen felhasználó',
        user_email: user?.email || '',
      };
    });

    res.status(200).json({ orders: enrichedOrders });
  } catch (error) {
    console.error('Hiba az admin rendelések lekérésénél:', error);
    res.status(500).json({
      message: 'Hiba a rendelések lekérésekor',
      error,
    });
  }
}
