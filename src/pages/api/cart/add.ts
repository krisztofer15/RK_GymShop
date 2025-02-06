import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { user_id, product_id, quantity } = req.body;

    if (!user_id || !product_id || !quantity) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const { error } = await supabase
        .from('cart_items')
        .insert([{ user_id, product_id, quantity }]);

    if (error) {
        return res.status(500).json({ message: 'Failed to add item to cart', error });
    }

    res.status(200).json({ message: 'Item added to cart' });
}