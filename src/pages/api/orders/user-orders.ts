import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    let { user_id, status, start_date, end_date } = req.query;

    if (!user_id || typeof user_id !== 'string') {
        return res.status(400).json({ message: 'Missing or invalid user ID' });
    }

    // UUID ellenőrzés
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(user_id.trim())) {
        return res.status(400).json({ message: 'Invalid UUID format' });
    }

    try {
        console.log('Fetching orders for user:', user_id, 'with status:', status, 'Date range:', start_date, end_date);

        let query = supabase
            .from('orders')
            .select(`
                id,
                subtotal,
                discount,
                final_total,
                status,
                created_at,
                order_items:order_items(id, product_id, quantity, price)
            `)
            .eq('user_id', user_id.trim())
            .order('created_at', { ascending: false });

        // 🟢 Státusz szűrés
        if (status && typeof status === 'string') {
            query = query.eq('status', status);
        }

        // 🟢 Dátum szerinti szűrés
        const today = new Date();
        const deafultStartDate = new Date();
        deafultStartDate.setDate(today.getDate() - 30);

        if (!start_date || !end_date) {
            start_date = deafultStartDate.toISOString();
            end_date = today.toISOString();
        }

        query = query.gte('created_at', start_date).lte('created_at', end_date);

        const { data, error } = await query;

        if (error) {
            console.error('Failed to retrieve orders:', error);
            return res.status(500).json({ message: 'Failed to retrieve orders', error });
        }

        res.status(200).json({ orders: data });

    } catch (err) {
        console.error('Unexpected error:', err);
        res.status(500).json({ message: 'Unexpected server error', error: err });
    }
}
