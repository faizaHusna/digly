import { useState, useEffect } from "react";
import axios from "axios";
import AdminLayout from "../../components/admin/AdminLayout";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // 1. READ: Ambil seluruh data user terdaftar dari MySQL
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("digly_token");
      const response = await axios.get("http://localhost:5000/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
    } catch (err) {
      console.error("Gagal mengambil data users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 2. UPDATE STATUS: Fungsi memblokir atau membuka blokir akun user
  const handleToggleStatus = async (id, name, currentStatus) => {
    const actionText = currentStatus === "active" ? "MEMBLOKIR" : "MENGAKTIFKAN KEMBALI";
    if (window.confirm(`Apakah Anda yakin ingin ${actionText} akun milik "${name}"?`)) {
      try {
        const token = localStorage.getItem("digly_token");
        await axios.put(
          `http://localhost:5000/api/admin/users/status/${id}`, 
          { currentStatus }, 
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert(`Akun ${name} berhasil dimoderasi.`);
        fetchUsers(); // Refresh data tabel
      } catch (err) {
        alert("Gagal memperbarui status user.");
      }
    }
  };

  // 3. DELETE USER: Menghapus akun user secara permanen
  const handleDeleteUser = async (id, name) => {
    if (window.confirm(`⚠️ PERINGATAN: Menghapus "${name}" akan menghapus seluruh data riwayatnya secara permanen. Lanjutkan?`)) {
      try {
        const token = localStorage.getItem("digly_token");
        await axios.delete(`http://localhost:5000/api/admin/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert("User berhasil dihapus.");
        fetchUsers(); // Refresh data tabel
      } catch (err) {
        alert("Gagal menghapus user.");
      }
    }
  };

  // 4. LIVE SEARCH FILTER
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <h1 className="text-5xl text-[#3E2F26] mb-2" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
        Users Management
      </h1>
      <p className="text-[#6B5B4D] mb-6">Manage registered users</p>

      {/* Input Live Search */}
      <input
        type="text"
        placeholder="Search users by name or email..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="px-5 py-3 rounded-full border border-[#D8CDBF] bg-white w-[420px] mb-6 outline-none text-[#6B5B4D]"
      />

      {/* Tabel Data Users */}
      <div className="bg-[#FFFDF9] border border-[#E7DDD0] rounded-2xl p-6 shadow-sm">
        <div className="grid grid-cols-4 font-semibold text-[#3E2F26] mb-4 pb-2 border-b border-[#E7DDD0]">
          <span>Name</span>
          <span>Email</span>
          <span>Status</span>
          <span>Action</span>
        </div>

        {loading ? (
          <div className="text-center py-6 text-[#6B5B4D]">Loading library user data...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-6 text-[#6B5B4D]">No users match the search.</div>
        ) : (
          filteredUsers.map((user) => (
            <div key={user.id} className="grid grid-cols-4 py-3 text-[#6B5B4D] border-t border-[#F2EBE1] items-center">
              <span className="font-medium text-[#3E2F26]">{user.name}</span>
              <span>{user.email}</span>
              
              {/* Badge Status */}
              <span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                  {user.status === "active" ? "Active" : "Blocked"}
                </span>
              </span>

              {/* Tombol Aksi */}
              <span className="space-x-3">
                <button 
                  onClick={() => handleToggleStatus(user.id, user.name, user.status)} 
                  className={`font-medium hover:underline ${user.status === "active" ? "text-amber-700" : "text-emerald-700"}`}
                >
                  {user.status === "active" ? "Block" : "Unblock"}
                </button>
                <button 
                  onClick={() => handleDeleteUser(user.id, user.name)} 
                  className="text-red-700 hover:underline font-medium"
                >
                  Delete
                </button>
              </span>
            </div>
          ))
        )}
      </div>
    </AdminLayout>
  );
}