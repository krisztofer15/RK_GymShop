import { supabase } from '../../../lib/supabaseClient';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'PUT') {
        return res.status(405).json({ message: 'Only PUT requests are allowed' });
    }

    const { id, name, email } = req.body;

    if (!id || !name || !email) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Profil frissítése a `users` táblában
        const { error } = await supabase
            .from('users')
            .update({ name, email})
            .eq('id', id);

        if (error) {
            return res.status(500).json({ message: 'Error during profile update', error: error.message });
        }

        res.status(200).json({ message: 'Profile updated successfully' });
    } catch (err: unknown) {
        if (err instanceof Error) {
            res.status(500).json({ message: 'Unexpected error', error: err.message });
        } else {
            res.status(500).json({ message: 'Unexpected error', error: 'Unknown error occurred' });
        }
    }
}