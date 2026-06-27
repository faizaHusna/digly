import { useState, useEffect } from "react";
import axios from "axios";
import AdminLayout from "../../components/admin/AdminLayout";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalStock: 0, // 🔥 1. Daftarkan properti state penampung stok baru
    totalUsers: 0,
    activeLoans: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const token = localStorage.getItem("digly_token");
        
        const response = await axios.get("http://localhost:5000/api/admin/stats", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setStats(response.data);
      } catch (err) {
        console.error("Gagal memuat statistik sistem dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  return (
    <AdminLayout>
      <h1 className="text-5xl text-[#3E2F26] mb-2"
        style={{ fontFamily: '"Cormorant Garamond", serif' }}
      >
        Dashboard
      </h1>

      <p className="text-[#6B5B4D] mb-8">
        Overview of Digly library system
      </p>

      {/* 🔥 2. Grid diubah dari grid-cols-3 menjadi grid-cols-4 */}
      <div className="grid grid-cols-4 gap-6">
        <Card title="Total Books (Titles)" value={stats.totalBooks} loading={loading} />
        
        {/* 🔥 3. Sisipkan kartu penunjuk total stok buku di database */}
        <Card title="Total Book Stock" value={`${stats.totalStock} Pcs`} loading={loading} />
        
        <Card title="Total Users" value={stats.totalUsers} loading={loading} />
        <Card title="Active Loans" value={stats.activeLoans} loading={loading} />
      </div>
    </AdminLayout>
  );
}

function Card({ title, value, loading }) {
  return (
    <div className="bg-[#FFFDF9] border border-[#E7DDD0] rounded-2xl p-6 shadow-sm transition-all hover:shadow-md">
      <p className="text-[#6B5B4D] text-sm uppercase tracking-wider font-medium">{title}</p>
      
      {loading ? (
        <div className="h-9 w-16 bg-gray-200 animate-pulse rounded-md mt-2"></div>
      ) : (
        <h2 className="text-4xl text-[#3E2F26] mt-2 font-bold font-serif">{value}</h2>
      )}
    </div>
  );
}