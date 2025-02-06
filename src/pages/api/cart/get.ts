import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { user_id } = req.query;

    if (!user_id) {
        return res.status(400).json({ message: 'Missing user_id' });
    }

    const { data, error } = await supabase
        .from('cart_items')
        .select('id, product_id, quantity, products(name, price, image)')
        .eq('user_id', user_id);

    if (error) {
        return res.status(500).json({ message: 'Failed to retrieve cart', error });
    }

    res.status(200).json(data);
}