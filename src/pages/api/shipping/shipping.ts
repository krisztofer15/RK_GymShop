import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    let { order_id, user_id, address, city, postal_code, country } = req.body;

    console.log("Received data:", req.body);

    if (!order_id || !user_id || !address || !city || !postal_code || !country) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    // 🟢 UUID konverzió - biztosítsuk, hogy UUID legyen
    try {
        order_id = order_id.toString().trim();
        user_id = user_id.toString().trim();
    } catch (err) {
        return res.status(400).json({ message: "Invalid UUID format" });
    }

    console.log("Converted order_id:", order_id);
    console.log("Converted user_id:", user_id);

    // 📌 Ellenőrizzük, hogy valódi UUID-e
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(order_id) || !uuidRegex.test(user_id)) {
        return res.status(400).json({ message: 'Invalid UUID format' });
    }

    try {
        console.log('Inserting shipping details:', { order_id, user_id, address, city, postal_code, country });

        const { error } = await supabase
            .from('shipping_details')
            .insert([{ order_id, user_id, address, city, postal_code, country }]);

        if (error) {
            console.error('Failed to insert shipping details:', error);
            return res.status(500).json({ message: 'Failed to save shipping details', error });
        }

        res.status(200).json({ message: 'Shipping details saved successfully' });
    } catch (err) {
        console.error('Unexpected error:', err);
        res.status(500).json({ message: 'Unexpected server error', error: err });
    }
}
