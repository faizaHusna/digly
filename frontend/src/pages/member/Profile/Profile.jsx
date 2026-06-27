import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react"; // 🛠️ Tambahkan useState dan useEffect
import axios from "axios"; // 🛠️ Tambahkan axios
import Navbar from "../../../components/layout/Navbar/Navbar";

function Profile({ isLoggedIn, user, setIsLoggedIn, setUser }) {
  const navigate = useNavigate();
  const [totalDipinjam, setTotalDipinjam] = useState(0); // 🛠️ State lokal untuk menghitung buku aktif

  // 🛠️ Ambil data langsung dari MySQL via API History
  useEffect(() => {
    const fetchTotalBorrowed = async () => {
      const token = localStorage.getItem("digly_token");
      if (isLoggedIn && token) {
        try {
          const response = await axios.get("http://localhost:5000/api/member/history", {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          // Hitung hanya transaksi yang statusnya masih aktif 'borrowed'
          const bukuAktif = response.data.filter(item => item.status === "borrowed");
          setTotalDipinjam(bukuAktif.length);
        } catch (err) {
          console.error("Gagal memuat total peminjaman di profil:", err);
        }
      }
    };

    fetchTotalBorrowed();
  }, [isLoggedIn]);

  const handleSignOut = () => {
    // 🛠️ Amankan proses navigasi terlebih dahulu sebelum menghapus state agar tidak terjadi crash render
    navigate("/");
    
    setTimeout(() => {
      localStorage.removeItem("digly_user");
      localStorage.removeItem("digly_token");
      setUser(null);
      setIsLoggedIn(false);
    }, 50);
  };

  const dapatkanInisial = (nama) => {
    if (!nama) return "G";
    return nama.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();
  };

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} />

      <main className="min-h-screen bg-[#F8F5F0]">
        <div className="mx-auto max-w-5xl px-6 py-10">
          <div className="mb-10">
            <h1 className="text-5xl text-[#3E2F26]" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
              Profile
            </h1>
            <p className="mt-2 text-[#6B5B4D]">Manage your account and view your library activity.</p>
          </div>

          {!isLoggedIn ? (
            <div className="rounded-3xl border border-[#E7DDD0] bg-[#FFFDF9] p-8 shadow-sm">
              <div className="flex flex-col gap-8 md:flex-row md:items-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#EFE7DC] text-[#6B4F3A]">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl text-[#3E2F26]" style={{ fontFamily: '"Cormorant Garamond", serif' }}>No Account Found</h2>
                  <p className="mt-1 text-[#6B5B4D] max-w-xl">You are currently browsing as a guest. Please sign in to view your profile and start borrowing books.</p>
                </div>
              </div>
              <div className="mt-10">
                <button onClick={() => navigate("/login")} className="rounded-full bg-[#6B4F3A] px-6 py-3 text-white transition hover:bg-[#5A4230] font-medium">Sign In</button>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border border-[#E7DDD0] bg-[#FFFDF9] p-8 shadow-sm">
              <div className="flex flex-col gap-8 md:flex-row md:items-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#EFE7DC] text-3xl font-semibold text-[#6B4F3A]">
                  {dapatkanInisial(user?.name)}
                </div>

                <div className="flex-1">
                  <h2 className="text-3xl text-[#3E2F26]" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
                    {user?.name || "Member Digly"}
                  </h2>

                  <p className="mt-1 text-[#6B5B4D]">
                    {user?.email || "email@database.com"}
                  </p>

                  <span className="mt-4 inline-block rounded-full bg-[#F3ECE2] px-4 py-1 text-sm text-[#6B4F3A]">
                    Member
                  </span>
                </div>
              </div>

              <div className="mt-10 grid gap-6 md:grid-cols-2">
                <div className="rounded-2xl bg-[#F8F5F0] p-6">
                  <p className="text-sm uppercase tracking-wider text-[#8B6F47]">Borrowed Books</p>
                  {/* 🔥 Menggunakan angka realtime hasil hitung database */}
                  <h3 className="mt-2 text-4xl font-semibold text-[#3E2F26]">{totalDipinjam}</h3> 
                </div>
                <div className="rounded-2xl bg-[#F8F5F0] p-6">
                  <p className="text-sm uppercase tracking-wider text-[#8B6F47]">Account Status</p>
                  <h3 className="mt-2 text-2xl text-[#3E2F26]">Active Member</h3>
                </div>
              </div>

              <div className="mt-10">
                <button
                  onClick={handleSignOut}
                  className="rounded-full bg-[#6B4F3A] px-6 py-3 text-white transition hover:bg-[#5A4230]"
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

export default Profile;