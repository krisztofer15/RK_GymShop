import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    let { order_id, user_id, payment_method, payment_status } = req.body;

    console.log("Received payment data:", req.body);

    if (!order_id || !user_id || !payment_method || !payment_status) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    // UUID formátum ellenőrzés
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(order_id) || !uuidRegex.test(user_id)) {
        return res.status(400).json({ message: 'Invalid UUID format' });
    }

    try {
        // Ellenőrizzük, hogy az order_id létezik-e
        const { data: orderExists, error: orderError } = await supabase
            .from('orders')
            .select('id')
            .eq('id', order_id)
            .single();

        if (orderError || !orderExists) {
            return res.status(404).json({ message: 'Order not found' });
        }

        console.log('Processing payment:', { order_id, user_id, payment_method, payment_status });

        // Fizetés rögzítése
        const { error: insertError } = await supabase
            .from('payments')
            .insert([{ order_id, user_id, payment_method, payment_status }]);

        if (insertError) {
            console.error('Failed to insert payment:', insertError);
            return res.status(500).json({ message: 'Failed to process payment', error: insertError });
        }

        // Rendelés státusz frissítése
        const { error: updateError } = await supabase
            .from('orders')
            .update({ status: payment_status === 'paid' ? 'completed' : 'failed' })
            .eq('id', order_id);

        if (updateError) {
            console.error('Failed to update order status:', updateError);
            return res.status(500).json({ message: 'Failed to update order status', error: updateError });
        }

        return res.status(200).json({ message: 'Payment processed successfully' });
    } catch (err) {
        console.error('Unexpected error:', err);
        return res.status(500).json({ message: 'Unexpected server error', error: err });
    }
}
