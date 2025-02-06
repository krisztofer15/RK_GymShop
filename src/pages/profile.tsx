import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Pencil, Check, X, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

type User = {
    id: string;
    name: string;
    email: string;
    created: string;
};

export default function Profile() {
    const [user, setUser] = useState<User | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const router = useRouter();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser: User = JSON.parse(storedUser);
            console.log('User object:', parsedUser);
            setUser(parsedUser);
            setName(parsedUser.name);
            setEmail(parsedUser.email);
        }
    }, []);

    const handleUpdateProfile = async () => {
        if (!user) return;

        try {
            const response = await fetch('/api/auth/updateProfile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: user.id, name, email }),
            });

            if (!response.ok) {
                const data = await response.json();
                setMessage(`Error: ${data.message}`);
                return;
            }

            const updatedUser = { ...user, name, email };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
            setMessage('Profile updated successfully');
            setIsEditing(false);
        } catch (err) {
            console.error('Error updating profile:', err);
            setMessage('Error updating profile');
        }
    };

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
        setMessage('');
    };

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        localStorage.removeItem('user');
        router.push('/');
    };

    if (!user) {
        return <p>Loading...</p>;
    }

    return (
        <div className="flex items-center justify-center min-h-screen">
            <motion.div
                className="max-w-lg w-full bg-white p-8 rounded-2xl shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
            >
                <h1 className="text-3xl font-extrabold text-[#1D1617] mb-8 text-center">
                    Your Profile
                </h1>

                {/* Profile Info Section */}
                <div className="space-y-6">
                    {/* Name */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="flex items-center justify-between"
                    >
                        <span className="text-[#454545] font-medium">Name:</span>
                        {isEditing ? (
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="flex-1 ml-4 p-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#FF6000] focus:outline-none"
                            />
                        ) : (
                            <span className="text-[#1D1617]">{user.name}</span>
                        )}
                    </motion.div>

                    {/* Email */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="flex items-center justify-between"
                    >
                        <span className="text-[#454545] font-medium">Email:</span>
                        {isEditing ? (
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="flex-1 ml-4 p-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#FF6000] focus:outline-none"
                            />
                        ) : (
                            <span className="text-[#1D1617]">{user.email}</span>
                        )}
                    </motion.div>

                    {/* Created Date */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="flex items-center justify-between"
                    >
                        <span className="text-[#454545] font-medium">Created At:</span>
                        <span className="text-gray-500">
                            {new Date(user.created).toLocaleDateString()}
                        </span>
                    </motion.div>
                </div>

                {/* Update & Edit Buttons */}
                <div className="flex space-x-4 mt-8 justify-center">
                    {isEditing ? (
                        <>
                            <motion.button
                                onClick={handleUpdateProfile}
                                className="bg-[#FF6000] text-white py-2 px-6 rounded-lg flex items-center hover:bg-[#FFA559] transition"
                                whileHover={{ scale: 1.05 }}
                            >
                                <Check className="mr-2" size={20} />
                                Save
                            </motion.button>
                            <motion.button
                                onClick={handleEditToggle}
                                className="bg-gray-400 text-white py-2 px-6 rounded-lg hover:bg-gray-500 transition"
                                whileHover={{ scale: 1.05 }}
                            >
                                <X className="mr-2" size={20} />
                                Cancel
                            </motion.button>
                        </>
                    ) : (
                        <motion.button
                            onClick={handleEditToggle}
                            className="bg-[#FF6000] text-white py-2 px-6 rounded-lg flex items-center hover:bg-[#FFA559] transition"
                            whileHover={{ scale: 1.05 }}
                        >
                            <Pencil className="mr-2" size={20} />
                            Edit
                        </motion.button>
                    )}
                </div>

                {/* Logout Button */}
                <motion.button
                    onClick={handleLogout}
                    className="mt-6 bg-red-500 text-white py-2 px-6 rounded-lg flex items-center justify-center hover:bg-red-600 transition mx-auto"
                    whileHover={{ scale: 1.05 }}
                >
                    <LogOut className="mr-2" size={20} />
                    Logout
                </motion.button>

                {message && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-green-500 text-center mt-4"
                    >
                        {message}
                    </motion.p>
                )}
            </motion.div>
        </div>
    );
}
