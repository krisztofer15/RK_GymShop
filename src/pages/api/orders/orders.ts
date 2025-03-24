import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { user_id, cart_items, subtotal, discount, final_total, promo_code_id } = req.body;

    if (!user_id || !cart_items || cart_items.length === 0) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        // 🟢 Debug log: megnézzük, hogy milyen adatokat küldünk a Supabase-nek
        console.log('Creating order with data:', { user_id, subtotal, discount, final_total });

        // 🟢 Rendelés mentése
        const { data, error } = await supabase
            .from('orders')
            .insert([{ user_id, subtotal, discount, final_total, status: 'pending', promo_code_id }])
            .select();

        if (error) {
            console.error('Supabase insert error:', error);
            return res.status(500).json({ message: 'Failed to create order', error });
        }

        // 🟢 Ellenőrizzük, hogy a Supabase visszaadott-e adatot
        if (!data || data.length === 0) {
            console.error('No data returned from Supabase orders insert');
            return res.status(500).json({ message: 'Order creation failed, no data returned' });
        }

        const order_id = data[0].id;

        // 🟢 Debug log: megnézzük a rendelés ID-t
        console.log('Order created with ID:', order_id);

        // 🟢 A rendelés termékeinek mentése
        const orderItems = cart_items.map((item: any) => ({
            order_id,
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.price
        }));

        console.log('Inserting order items:', orderItems);

        const { error: orderError } = await supabase.from('order_items').insert(orderItems);
        if (orderError) {
            console.error('Failed to add order items:', orderError);
            return res.status(500).json({ message: 'Failed to add order items', error: orderError });
        }

        res.status(200).json({ order_id });

    } catch (err) {
        console.error('Unexpected error:', err);
        res.status(500).json({ message: 'Unexpected server error', error: err });
    }
}
