import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Pencil, Check, X, LogOut, Package, ClipboardList} from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';

type User = {
    id: string;
    name: string;
    email: string;
    created: string;
};

type Order = {
    id: string;
    subtotal: number;
    discount: number;
    final_total: number;
    status: string;
    created_at: string;
};

export default function Profile() {
    const [user, setUser] = useState<User | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const router = useRouter();

    useEffect(() => {
        const fetchUserAndOrders = async () => {
            const { data: { user } } = await supabase.auth.getUser();
      
            if (!user) {
              router.push("/login");
              return;
            }

            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const parsed = JSON.parse(storedUser);
                setUser(parsed);
                setName(parsed.name);
                setEmail(parsed.email);
              } else {
                // Set user data
            setUser({
                id: user.id,
                name: user.user_metadata.name ?? "",
                email: user.email ?? "",
                created: user.created_at
              });
              setName(user.user_metadata.name ?? "");
              setEmail(user.email ?? "");
              }
      
            // Fetch orders
            const { data, error } = await supabase
              .from("orders")
              .select("id, subtotal, discount, final_total, status, created_at")
              .eq("user_id", user.id)
              .order("created_at", { ascending: false });
      
            if (error) {
              console.error("Hiba a rendelések lekérdezésekor:", error);
            } else {
              setOrders(data);
            }
          };
      
          fetchUserAndOrders();
    }, [router]);

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
        <div className="flex flex-col md:flex-row items-start justify-center min-h-screen bg-gray-50 p-6 gap-8">
        {/* Profil kártya */}
        <motion.div
            className="w-full md:w-1/3 bg-white shadow rounded-lg p-5"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
        >
            <h1 className="text-xl font-semibold text-gray-800 flex items-center">
                <ClipboardList className="mr-2 text-[#FF6000]" size={20} /> Your Profile
            </h1>

            <div className="space-y-3 mt-4">
                <div>
                    <label className="text-gray-500 text-sm">Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#FF6000] focus:outline-none"
                        disabled={!isEditing}
                    />
                </div>

                <div>
                    <label className="text-gray-500 text-sm">Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#FF6000] focus:outline-none"
                        disabled={!isEditing}
                    />
                </div>

                <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Created At:</span>
                    <span className="text-gray-600">{new Date(user.created).toLocaleDateString()}</span>
                </div>
            </div>

            <div className="flex space-x-3 mt-4">
                {isEditing ? (
                    <>
                        <button onClick={handleUpdateProfile} className="flex-1 bg-[#FF6000] text-white py-2 text-sm rounded-lg flex items-center justify-center hover:bg-[#FFA559]">
                            <Check size={16} className="mr-1" /> Save
                        </button>
                        <button onClick={handleEditToggle} className="flex-1 bg-gray-400 text-white py-2 text-sm rounded-lg flex items-center justify-center hover:bg-gray-500">
                            <X size={16} className="mr-1" /> Cancel
                        </button>
                    </>
                ) : (
                    <button onClick={handleEditToggle} className="w-full bg-[#FF6000] text-white py-2 text-sm rounded-lg flex items-center justify-center hover:bg-[#FFA559]">
                        <Pencil size={16} className="mr-1" /> Edit Profile
                    </button>
                )}
            </div>

            <button onClick={handleLogout} className="w-full mt-3 bg-red-500 text-white py-2 text-sm rounded-lg flex items-center justify-center hover:bg-red-600">
                <LogOut size={16} className="mr-1" /> Logout
            </button>
        </motion.div>

        {/* Rendelési előzmények */}
        <motion.div
        className="w-full md:w-2/3 bg-white shadow rounded-lg p-5"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
      >
        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
          <Package className="mr-2 text-[#FF6000]" size={20} /> Order History
        </h2>

        <div className="mmt-4 max-h-[400px] overflow-y-auto pr-2 space-y-3 scroll-smooth">
          {orders.length === 0 ? (
            <p className="text-gray-500 text-sm">No orders yet.</p>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="p-3 border rounded-lg bg-gray-50 hover:bg-gray-100 transition flex justify-between items-center text-sm">
                <div>
                  <p className="font-medium">Order: {order.id.slice(0, 8).toUpperCase()}</p>
                  <p className="text-gray-500">Total: ${order.final_total.toFixed(2)}</p>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-md ${
                  order.status === 'completed'
                    ? 'bg-green-200 text-green-700'
                    : order.status === 'pending'
                    ? 'bg-orange-200 text-orange-700'
                    : 'bg-blue-200 text-blue-700'
                }`}>
                  {order.status.toUpperCase()}
                </span>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>

    );
}
