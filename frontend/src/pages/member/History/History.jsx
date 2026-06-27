import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Navbar from "../../../components/layout/Navbar/Navbar";
import BookCard from "../../../components/books/BookCard/BookCard";

function History({ isLoggedIn }) {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem("digly_token");
      const response = await axios.get("http://localhost:5000/api/member/history", {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });

      console.log("Data History dari Backend:", response.data);

      setBorrowedBooks(response.data);
    } catch (err) {
      console.error("Gagal memuat riwayat peminjaman:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchHistory();
    } else {
      setLoading(false);
    }
  }, [isLoggedIn, location]);

  const handleReturnBook = async (borrowingId) => {
    if (!window.confirm("Apakah Anda yakin ingin mengembalikan buku ini?")) return;

    try {
      const token = localStorage.getItem("digly_token");
      const response = await axios.post(
        "http://localhost:5000/api/member/return",
        { borrowing_id: borrowingId }, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(response.data.message || "Buku berhasil dikembalikan!");
      
      fetchHistory(); 
    } catch (err) {
      alert(err.response?.data?.message || "Gagal mengembalikan buku.");
    }
  };

  if (loading) {
    return <div className="p-10 text-center text-[#6B5B4D]">Loading history...</div>;
  }

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} />

      <main className="min-h-screen bg-[#F8F5F0]">
        <div className="mx-auto max-w-7xl px-6 py-10">

          <h1
            className="text-5xl text-[#3E2F26]"
            style={{ fontFamily: '"Cormorant Garamond", serif' }}
          >
            Borrow History
          </h1>

          <p className="mt-2 text-[#6B5B4D]">
            Books you have borrowed
          </p>

          {borrowedBooks.length === 0 ? (
            <div className="mt-16 flex flex-col items-center justify-center text-center">
              <p className="text-[#6B5B4D]">
                No books borrowed yet.
              </p>
            </div>
          ) : (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {borrowedBooks.map((loan) => (
                <div key={loan.borrowing_id} className="flex flex-col justify-between border border-[#E7DDD0] bg-[#FFFDF9] p-4 rounded-2xl shadow-sm">
                  
                  <BookCard
                    id={loan.book_id} 
                    title={loan.title}
                    author={loan.author}
                    category={loan.category}
                    cover_image={loan.cover_image}
                    stock={loan.stock}
                  />

                  <div className="mt-3">
                    <p className="text-xs text-[#8B6F47] mb-2">
                      Status: <span className={`font-semibold capitalize ${loan.status === 'borrowed' ? 'text-amber-600' : 'text-green-600'}`}>{loan.status}</span>
                    </p>
                    
                    {loan.status === "borrowed" ? (
                      <button
                        onClick={() => handleReturnBook(loan.borrowing_id)} 
                        className="w-full rounded-full bg-[#6B4F3A] py-2 text-sm text-white transition hover:bg-[#5A4230]"
                      >
                        Return Book
                      </button>
                    ) : (
                      <button
                        disabled
                        className="w-full rounded-full bg-gray-200 py-2 text-sm text-gray-500 cursor-not-allowed"
                      >
                        Returned
                      </button>
                    )}
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>
      </main>
    </>
  );
}

export default History;