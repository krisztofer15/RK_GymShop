import { useState } from 'react';
import { useRouter } from 'next/router';
import { Mail, Lock } from 'lucide-react';
import Image from 'next/image';
import { supabase } from '../lib/supabaseClient';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || 'Invalid email or password');
                setLoading(false);
                return;
            }

            // Session tárolása Supabase segítségével
            await supabase.auth.setSession({
                access_token: data.session.access_token,
                refresh_token: data.session.refresh_token,
            });

            // Felhasználó adatainak mentése localStorage-ba
            localStorage.setItem('user', JSON.stringify(data.user));

            // Sikeres bejelentkezés után átirányítás a Home oldalra
            router.push('/');
        } catch (err) {
            console.error('Error occurred:', err);
            setError('Unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative h-full w-full bg-white">
            <div className="absolute h-full w-full bg-[radial-gradient(#d1d5db_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
            <div className="flex items-center justify-center min-h-screen relative z-10">
                <div className="w-full max-w-sm p-6 bg-white rounded-xl shadow-md">
                    <div className="flex justify-center mb-4">
                        <Image
                            src="/images/Logo_original.png"
                            width={60}
                            height={60}
                            alt="Logo"
                            className="rounded-md"
                        />
                    </div>
                    <h1 className="text-xl font-bold text-center text-[#1D1617] mb-4">Bejelentkezés</h1>
                    {error && <p className="text-red-500 text-center mb-3 font-medium">{error}</p>}
                    <form onSubmit={handleLogin}>
                        <div className="mb-4">
                            <label className="block mb-1 text-[#454545] text-sm">Email</label>
                            <div className="flex items-center border rounded-lg p-2 bg-gray-50 focus-within:border-[#FF6000] focus-within:ring-1 focus-within:ring-[#FF6000]">
                                <Mail className="text-[#FF6000] mr-2" />
                                <input
                                    type="email"
                                    placeholder="Add meg az email címed"
                                    className="w-full bg-transparent text-sm placeholder-gray-400 focus:outline-none"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="block mb-1 text-[#454545] text-sm">Jelszó</label>
                            <div className="flex items-center border rounded-lg p-2 bg-gray-50 focus-within:border-[#FF6000] focus-within:ring-1 focus-within:ring-[#FF6000]">
                                <Lock className="text-[#FF6000] mr-2" />
                                <input
                                    type="password"
                                    placeholder="Add meg a jelszavad"
                                    className="w-full bg-transparent text-sm placeholder-gray-400 focus:outline-none"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            className={`w-full text-white bg-[#1D1617] hover:bg-[#FF6000] py-2.5 rounded-lg shadow font-medium text-sm transition-transform transform hover:scale-105 ${
                                loading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            disabled={loading}
                        >
                            {loading ? 'Bejelentkezés...' : 'Bejelentkezés'}
                        </button>
                    </form>
                    <p className="mt-4 text-center text-[#454545] text-sm">
                        Nincs még fiókod?{' '}
                        <span
                            onClick={() => router.push('/register')}
                            className="text-[#FF6000] font-bold cursor-pointer hover:underline"
                        >
                            Regisztrálj
                        </span>
                        !
                    </p>
                </div>
            </div>
        </div>
    );
}
