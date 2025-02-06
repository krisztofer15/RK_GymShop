import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabaseClient';

export default async function applyPromo(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { promo_code, user_id, cart_total } = req.body;

    // Ellenőrizd, hogy a kupon létezik-e és megfelel-e a feltételeknek
    const { data: promo, error } = await supabase
        .from('promo_codes')
        .select('*')
        .eq('code', promo_code)
        .single();

    if (error || !promo) {
        return res.status(404).json({ message: 'Invalid promo code' });
    }

    // Ha van minimum érték, ellenőrizzük
    if (promo.minimum_amount && cart_total < promo.minimum_amount) {
        return res.status(400).json({ message: `Minimum ${promo.minimum_amount}$ is required for this promo.` });
    }

    // Ellenőrizzük, hogy egyszer használatos kupon esetén már felhasználta-e
    if (promo.single_use) {
        const { data: userPromo } = await supabase
            .from('user_promos')
            .select('id')
            .eq('user_id', user_id)
            .eq('promo_code_id', promo.id)
            .eq('is_used', true)
            .single();

        if (userPromo) {
            return res.status(400).json({ message: 'This promo code has already been used.' });
        }
    }

    // Minden feltétel teljesült, visszatérünk a kedvezmény értékével
    return res.status(200).json({
        discount: (promo.discount_percentage / 100) * cart_total,
        new_total: cart_total - (promo.discount_percentage / 100) * cart_total,
    });
}