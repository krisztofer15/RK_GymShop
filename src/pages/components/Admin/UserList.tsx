import { useEffect, useState } from "react";
import Pagination from "./Pagination";
import { Crown, Award, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import ConfirmModal from "./ConfirmModal";

type User = {
  id: string;
  name: string;
  email: string;
  created: string;
  role: string;
};

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const itemsPerPage = 9;

  const loggedInUser = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/users/get-users");
        const data = await res.json();

        if (res.ok) {
          const sorted = data.users.sort((a: User, b: User) =>
            a.name.localeCompare(b.name)
          );
          setUsers(sorted);
        } else {
          toast.error(data.message || "Hiba a felhasználók lekérésekor.");
        }
      } catch (error) {
        console.error("Hiba:", error);
        toast.error("Nem sikerült betölteni a felhasználókat.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const totalPages = Math.ceil(users.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = users.slice(startIndex, endIndex);

  const renderRole = (role: string) => {
    if (role === "admin") {
      return (
        <span className="flex items-center gap-1 text-amber-400 font-semibold">
          <Crown size={16} /> admin
        </span>
      );
    }
    if (role === "sales_manager") {
      return (
        <span className="flex items-center gap-1 text-gray-400 font-medium">
          <Award size={16} /> sales_manager
        </span>
      );
    }
    return <span className="text-gray-700">{role}</span>;
  };

  const handleDeleteClick = (targetId: string) => {
    setUserToDelete(targetId);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;

    const res = await fetch("/api/users/delete-user", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: loggedInUser.id,
        target_user_id: userToDelete,
      }),
    });

    const data = await res.json();
    if (res.ok) {
      setUsers((prev) => prev.filter((u) => u.id !== userToDelete));
      toast.success("Felhasználó sikeresen törölve.");
    } else {
      toast.error(data.message || "Hiba történt törléskor.");
    }

    setConfirmOpen(false);
    setUserToDelete(null);
  };

  const roleMap: Record<string, number> = {
    user: 1,
    sales_manager: 2,
    admin: 3,
  };

  const handleRoleChange = async (targetId: string, newRole: string) => {
    const newRoleId = roleMap[newRole];

    const res = await fetch("/api/users/update-role", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: loggedInUser.id,
        target_id: targetId,
        new_role_id: newRoleId,
      }),
    });

    const data = await res.json();
    if (res.ok) {
      toast.success("Szerepkör frissítve.");
      setUsers((prev) =>
        prev.map((u) =>
          u.id === targetId ? { ...u, role: newRole } : u
        )
      );
    } else {
      toast.error(data.message || "Hiba a szerepkör módosításakor.");
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow-md relative">
      <h2 className="text-xl font-semibold text-[#FF6000] mb-4">Felhasználók</h2>

      {loading ? (
        <p className="text-gray-500">Betöltés...</p>
      ) : users.length === 0 ? (
        <p className="text-gray-500">Nincsenek felhasználók.</p>
      ) : (
        <>
          {/* Asztali nézet */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="min-w-full table-auto border border-gray-200">
              <thead className="bg-gray-100 text-sm text-gray-700 text-left">
                <tr>
                  <th className="w-1/4 px-4 py-2">Név</th>
                  <th className="w-1/4 px-4 py-2">Email</th>
                  <th className="w-1/4 px-4 py-2">Regisztrált</th>
                  <th className="w-1/4 px-4 py-2">Szerepkör</th>
                  <th className="px-4 py-2">Művelet</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((user) => (
                  <tr key={user.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm">{user.name}</td>
                    <td className="px-4 py-2 text-sm">{user.email}</td>
                    <td className="px-4 py-2 text-sm">
                      {new Date(user.created).toLocaleDateString("hu-HU")}
                    </td>
                    <td className="px-4 py-2 text-sm">
                      {user.id === loggedInUser.id ? (
                        renderRole(user.role)
                      ) : (
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          className="border rounded px-2 py-1 text-sm"
                        >
                          <option value="user">user</option>
                          <option value="sales_manager">sales_manager</option>
                          <option value="admin">admin</option>
                        </select>
                      )}
                    </td>
                    <td className="px-4 py-2">
                      {user.id !== loggedInUser.id && user.role !== "admin" && (
                        <button
                          onClick={() => handleDeleteClick(user.id)}
                          className="text-red-500 hover:text-red-700"
                          title="Törlés"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobil nézet */}
          <div className="lg:hidden space-y-4">
            {paginatedUsers.map((user) => (
              <div key={user.id} className="border rounded-md p-4 shadow-sm bg-gray-50">
                <p className="text-sm font-semibold text-gray-700">Név: {user.name}</p>
                <p className="text-sm">Email: {user.email}</p>
                <p className="text-sm">
                  Regisztrált: {new Date(user.created).toLocaleDateString("hu-HU")}
                </p>
                <p className="text-sm">
                  Szerepkör:{" "}
                  {user.id === loggedInUser.id ? (
                    renderRole(user.role)
                  ) : (
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      className="border rounded px-2 py-1 text-sm mt-1"
                    >
                      <option value="user">user</option>
                      <option value="sales_manager">sales_manager</option>
                      <option value="admin">admin</option>
                    </select>
                  )}
                </p>

                {user.id !== loggedInUser.id && user.role !== "admin" && (
                  <div className="mt-2">
                    <button
                      onClick={() => handleDeleteClick(user.id)}
                      className="text-xs bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Felhasználó törlése
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Modal */}
          <ConfirmModal
            isOpen={confirmOpen}
            onClose={() => setConfirmOpen(false)}
            onConfirm={confirmDelete}
            message="Biztosan törölni szeretnéd ezt a felhasználót?"
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
}



// „Az adatbázisban számokat tárolunk a szerepkörökhöz (role_id), mert idegen kulcs. A frontend viszont felhasználóbarát stringeket használ (admin, user stb.), ezért készítettem egy roleMap nevű objektumot, ami biztosítja a kettő közötti megfeleltetést. Így a backend stabil, a UI pedig jól olvasható marad.”