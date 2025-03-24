import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabaseClient';

export default async function applyPromo(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { promo_code, user_id, cart_total } = req.body;

    // Ellenőrizzük, hogy a kupon létezik-e és érvényes-e
    const { data: promo, error } = await supabase
        .from('promo_codes')
        .select('*')
        .eq('code', promo_code)
        .single();

    if (error || !promo) {
        return res.status(404).json({ message: 'Invalid promo code' });
    }

    // Ha van minimális összeg követelmény, ellenőrizzük
    if (promo.minimum_amount && cart_total < promo.minimum_amount) {
        return res.status(400).json({ message: `Minimum ${promo.minimum_amount}$ is required for this promo.` });
    }

    // Ha egyszer használatos a kupon, ellenőrizzük, hogy már felhasználta-e
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

    // Kedvezmény számítása
    const discount = (promo.discount_percentage / 100) * cart_total;
    const new_total = cart_total - discount;

    // 🔥 **Mentés a `user_cart` táblába**
    const { data: existingCart } = await supabase
        .from('user_cart')
        .select('id')
        .eq('user_id', user_id)
        .single();

    if (existingCart) {
        // Ha van már kosár, frissítsük
        await supabase
            .from('user_cart')
            .update({ subtotal: cart_total, discount, final_total: new_total, updated_at: new Date() })
            .eq('user_id', user_id);
    } else {
        // Ha még nincs, hozzunk létre egy új bejegyzést
        await supabase.from('user_cart').insert({
            user_id,
            subtotal: cart_total,
            discount,
            final_total: new_total,
            updated_at: new Date(),
        });
    }

    return res.status(200).json({
        discount,
        new_total,
        promo_code_id: promo.id,
    });
}
