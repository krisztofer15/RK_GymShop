import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'PUT') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { cart_item_id, quantity } = req.body;

    if (!cart_item_id || !quantity) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', cart_item_id);

    if (error) {
        return res.status(500).json({ message: 'Failed to update item quantity', error });
    }

    res.status(200).json({ message: 'Quantity updated' });
}