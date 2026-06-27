import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Navbar from "../../../components/layout/Navbar/Navbar";
import BookCard from "../../../components/books/BookCard/BookCard";

function Books({ isLoggedIn }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation(); 

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/books?t=${Date.now()}`);
        if (Array.isArray(response.data)) {
          setBooks(response.data);
        }
      } catch (error) {
        console.error("Gagal mengambil data buku di halaman Books:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, [location]);

  const filteredBooks = books.filter((book) => {
    if (!book) return false;
    const titleMatch = book.title?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
    const authorMatch = book.author?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
    const categoryMatch = book.category?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
    return titleMatch || authorMatch || categoryMatch;
  });

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8F5F0] text-[#6B5B4D]">
        Loading All Collection..
      </div>
    );
  }

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} />

      <main className="min-h-screen bg-[#F8F5F0]">
        <div className="mx-auto max-w-7xl px-6 py-10">

          {/* HEADER */}
          <div className="mb-10">
            <h1
              className="text-5xl text-[#3E2F26]"
              style={{ fontFamily: '"Cormorant Garamond", serif' }}
            >
              All Books
            </h1>
            <p className="mt-2 text-[#6B5B4D]">Explore our complete collection of books.</p>
          </div>

          <div className="mb-10">
            <input
              type="text"
              placeholder="Search books..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full max-w-md rounded-full border border-[#D8CDBF] bg-white px-6 py-3 outline-none focus:border-[#8B6F47]"
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filteredBooks.map((book) => (
              <BookCard
                key={`all-books-${book.id}`}
                id={book.id}
                title={book.title}
                author={book.author}
                category={book.category}
                cover_image={book.cover_image}
                stock={book.stock} 
              />
            ))}
          </div>

        </div>
      </main>
    </>
  );
}

export default Books;