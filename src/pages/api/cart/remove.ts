import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'DELETE') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { cart_item_id } = req.body;

    if (!cart_item_id) {
        return res.status(400).json({ message: 'Missing cart_item_id' });
    }

    const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', cart_item_id);

    if (error) {
        return res.status(500).json({ message: 'Failed to remove item from cart', error });
    }

    res.status(200).json({ message: 'Item removed from cart' });
}