import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
        return res.status(401).json({ message: 'Not authenticated' });
    }

    const user_id = userData.user.id;

    const { data, error } = await supabase
    .from('cart_items')
    .select(`
        id, 
        quantity, 
        product:products (id, name, price, image)
    `)
    .eq("user_id", user_id);

    if (error) {
        return res.status(500).json({ message: 'Failed to retrieve cart', error });
    }

    res.status(200).json(data);
}