import { supabase } from '../../../lib/supabaseClient';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Only POST requests are allowed' });
    }

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }

    if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    try {
        // Felhasználó regisztrálása és session kezelése
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name,
                },
            },
        });

        if (authError) {
            return res.status(500).json({ message: 'Error registering user', error: authError.message });
        }

        // Felhasználó adatainak mentése a `users` táblába
        const { error: insertError } = await supabase.from('users').insert([
            {
                id: authData.user?.id,
                name,
                email,
            },
        ]);

        if (insertError) {
            return res.status(500).json({ message: 'Error saving user data', error: insertError.message });
        }

        // Sikeres regisztráció és session visszaadása
        res.status(201).json({
            message: 'User registered successfully',
            user: authData.user,
            session: authData.session, // Session-t visszaadjuk
        });
    } catch (err: unknown) {
        if (err instanceof Error) {
            res.status(500).json({ message: 'Unexpected error', error: err.message });
        } else {
            res.status(500).json({ message: 'Unexpected error', error: 'Unknown error occurred' });
        }
    }
}
