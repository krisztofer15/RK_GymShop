import { supabase } from '../../../lib/supabaseClient';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Only POST requests are allowed' });
    }

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Felhasználó bejelentkeztetése és session lekérése
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (authError) {
            return res.status(401).json({ message: 'Invalid email or password', error: authError.message });
        }

        // Ellenőrizzük a session meglétét
        const { session } = authData;

        if (!session) {
            return res.status(401).json({ message: 'Session not found after login' });
        }

        // Felhasználói adatok lekérése a `users` táblából
        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('id, name, email, created')
            .eq('id', authData.user?.id)
            .single();

        if (userError || !userData) {
            return res.status(404).json({ message: 'User data not found in the database' });
        }

        // Sikeres bejelentkezés és session visszaadása
        res.status(200).json({
            message: 'Login successful',
            user: userData,
            session, // Session visszaadása
        });
    } catch (err: unknown) {
        if (err instanceof Error) {
            res.status(500).json({ message: 'Unexpected error', error: err.message });
        } else {
            res.status(500).json({ message: 'Unexpected error', error: 'Unknown error occurred' });
        }
    }
}
