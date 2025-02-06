import { supabase } from '../../../lib/supabaseClient';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Only POST requests are allowed' });
    }

    try {
        // Felhasználó kijelentkeztetése a Supabase Auth rendszerből
        const { error } = await supabase.auth.signOut();

        if (error) {
            return res.status(500).json({ message: 'Error during logout', error: error.message });
        }

        res.status(200).json({ message: 'Logout successful' });
    } catch (err: unknown) {
        if (err instanceof Error) {
            res.status(500).json({ message: 'Unexpected error', error: err.message });
        } else {
            res.status(500).json({ message: 'Unexpected error', error: 'Unknown error occurred' });
        }
    }
}
