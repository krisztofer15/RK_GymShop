import { supabase } from '../../../lib/supabaseClient';
import { NextApiRequest, NextApiResponse } from 'next';
import { checkUserRole } from '../../api/utils/checkRole';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Only POST requests are allowed' });
    }

    const { user_id, name, price, description, image, category_id } = req.body;

    // Ellenőrizzük, hogy van-e minden mező
    if (!user_id || !name || !price || !description || !image || !category_id) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // 👮‍♂️ Jogosultság ellenőrzése
    const hasPermission = await checkUserRole(user_id, ['admin', 'sales_manager']);

    if (!hasPermission) {
        return res.status(403).json({ message: 'You do not have permission to create products.' });
    }

    try {
        const { error } = await supabase.from('products').insert([
            {
                name,
                price,
                description,
                image,
                category_id
            }
        ]);

        if (error) {
            return res.status(500).json({ message: 'Error inserting product', error: error.message });
        }

        return res.status(201).json({ message: 'Product created successfully' });
    } catch (err) {
        return res.status(500).json({ message: 'Unexpected error occurred' });
    }
}
