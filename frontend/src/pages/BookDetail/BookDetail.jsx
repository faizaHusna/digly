import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../components/layout/Navbar/Navbar";

function BookDetail({ isLoggedIn }) {
  const { id } = useParams(); // Ini berisi parameter dari URL (bisa berupa ISBN string atau ID)
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBorrowing, setIsBorrowing] = useState(false);
  const [hasBorrowed, setHasBorrowed] = useState(false);

  // Fungsi untuk memuat ulang detail buku (Dibuat terpisah agar bisa dipanggil kembali)
  const fetchBookDetail = async () => {
    try {
      // Menggunakan id/isbn asli dari useParams agar konsisten
      const response = await axios.get(`http://localhost:5000/api/books/${id}?t=${Date.now()}`);
      setBook(response.data);
    } catch (err) {
      console.error("Gagal mengambil deskripsi:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchBookDetail();
  }, [id]);

  const handleBorrowClick = async () => {
    if (!isLoggedIn) {
      alert("Anda harus masuk akun (Sign In) terlebih dahulu untuk meminjam buku!");
      navigate("/login");
      return;
    }

    setIsBorrowing(true);
    try {
      const token = localStorage.getItem("digly_token");
      
      // Mengirimkan ISBN yang murni dari URL/state buku untuk diolah oleh memberController baru kita
      const targetIsbn = book?.isbn || id;

      const response = await axios.post(
        "http://localhost:5000/api/member/borrow",
        { book_id: targetIsbn },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(response.data.message || "Buku berhasil dipinjam!");
      setHasBorrowed(true);

      // Memanggil fungsi fetch ulang dari API dibanding hanya memotong state, 
      // agar data di layar sinkron sempurna dengan database MySQL
      await fetchBookDetail();

    } catch (err) {
      console.error("Detail Eror Axios:", err.response);
      alert(err.response?.data?.message || "Gagal memproses peminjaman buku.");
    } finally {
      setIsBorrowing(false);
    }
  };

  if (loading) {
    return <div className="p-10 text-center text-[#6B5B4D]">Loading...</div>;
  }

  if (!book) {
    return (
      <div className="p-10 text-center text-[#6B5B4D]">
        Book not found
      </div>
    );
  }

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} />

      <main className="min-h-screen bg-[#F8F5F0]">
        <div className="mx-auto max-w-4xl px-6 py-16">

          <button
            onClick={() => navigate(-1)}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#D8CDBF] bg-[#FFFDF9] px-5 py-2.5 text-sm font-medium text-[#6B4F3A] shadow-sm transition hover:bg-[#6B4F3A] hover:text-white hover:shadow-md"
          >
            ← Back
          </button>

          <div className="rounded-3xl border border-[#E7DDD0] bg-[#FFFDF9] p-10">

            <span className="text-sm uppercase tracking-[0.2em] text-[#8B6F47]">
              {book.category}
            </span>

            <h1
              className="mt-4 text-5xl text-[#3E2F26]"
              style={{ fontFamily: '"Cormorant Garamond", serif' }}
            >
              {book.title}
            </h1>

            <p className="mt-3 text-lg text-[#6B5B4D]">
              by {book.author}
            </p>

            <div className="mt-10 flex h-80 w-56 items-center justify-center overflow-hidden rounded-2xl border border-[#D8CDBF] bg-[#EFE7DC] shadow-md">
              {book.cover_image ? (
                <img src={book.cover_image} alt={book.title} className="h-full w-full object-cover" />
              ) : (
                <span className="text-[#8B6F47]">No Cover</span>
              )}
            </div>

            <p className="mt-6 leading-7 text-[#6B5B4D]">
              {book.description}
            </p>

            <div className="mt-6 flex flex-wrap gap-4 text-sm text-[#6B5B4D]">
              <span className="rounded-full bg-[#F3ECE2] px-3 py-1">
                {book.year}
              </span>
              <span className="rounded-full bg-[#F3ECE2] px-3 py-1">
                {book.pages} pages
              </span>
              <span className={`rounded-full px-3 py-1 font-medium ${book.stock > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                {book.stock > 0 ? `Stock: ${book.stock} available` : "Out of Stock"}
              </span>
            </div>

            <button
              onClick={handleBorrowClick}
              disabled={isBorrowing || (isLoggedIn && (hasBorrowed || book.stock <= 0))}
              className={`mt-8 rounded-full px-5 py-2 text-white transition ${isBorrowing || (isLoggedIn && (hasBorrowed || book.stock <= 0))
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#6B4F3A] hover:bg-[#5A4230]"
                }`}
            >
              {isBorrowing
                ? "Processing..."
                : !isLoggedIn
                  ? "Borrow Book"
                  : hasBorrowed
                    ? "Already Borrowed"
                    : book.stock <= 0
                      ? "Out of Stock"
                      : "Borrow Book"
              }
            </button>
          </div>

        </div>
      </main>
    </>
  );
}

export default BookDetail;