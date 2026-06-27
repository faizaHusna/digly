import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/layout/Navbar/Navbar";
import BookCard from "../../components/books/BookCard/BookCard";

function Home({ isLoggedIn, user, setIsLoggedIn, setUser }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const location = useLocation();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/books?t=${Date.now()}`);
        setBooks(response.data);
      } catch (error) {
        console.error("Gagal mengambil data buku:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [location]);

  const featuredBooks = books.slice(0, 4);
  const recentBooks = [...books].reverse().slice(0, 4);

  const searchResults = books.filter((book) => {
    const matchCategory =
      selectedCategory === "All" || book.category === selectedCategory;

    const matchSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchCategory && matchSearch;
  });

  const isSearching = searchQuery.trim() !== "";
  const isEmptySearch = searchResults.length === 0;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8F5F0] text-[#6B5B4D]">
        Loading Books Catalog...
      </div>
    );
  }

  return (
    <>
      <Navbar
        isLoggedIn={isLoggedIn}
        user={user}
        setIsLoggedIn={setIsLoggedIn}
        setUser={setUser}
      />

      <main className="min-h-screen bg-[#F8F5F0]">
        <div className="mx-auto max-w-7xl px-6 py-10">

          <section className="rounded-3xl border border-[#E7DDD0] bg-[#FFFDF9] p-8 md:p-12">
            <span className="text-sm uppercase tracking-[0.2em] text-[#8B6F47]">
              Digital Library
            </span>

            <h1
              className="mt-4 text-5xl leading-tight text-[#3E2F26] md:text-6xl"
              style={{ fontFamily: '"Cormorant Garamond", serif' }}
            >
              Where Stories Meet Stillness
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#6B5B4D]">
              Digly provides a comfortable digital space to explore books,
              expand knowledge, and enjoy reading anytime, anywhere.
            </p>

            <div className="mt-8 flex flex-col gap-3 md:flex-row">
              <input
                type="text"
                placeholder="Search by title, author, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 rounded-full border border-[#D8CDBF] bg-white px-6 py-3 outline-none transition focus:border-[#8B6F47]"
              />
            </div>
          </section>


          {isSearching && (
            <section className="mt-16">
              <h2
                className="text-4xl font-semibold text-[#3E2F26]"
                style={{ fontFamily: '"Cormorant Garamond", serif' }}
              >
                Search Results
              </h2>

              <p className="mt-2 text-[#6B5B4D]">
                Results for "{searchQuery}"
              </p>

              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {isEmptySearch ? (
                  <p className="text-[#6B5B4D]">No books found.</p>
                ) : (
                  searchResults.map((book) => (
                    <BookCard
                      key={book.id}
                      id={book.id}
                      title={book.title}
                      author={book.author}
                      category={book.category}
                      cover_image={book.cover_image}
                      stock={book.stock}
                    />
                  ))
                )}
              </div>
            </section>
          )}


          <section className="mt-16">
            <div className="mb-8">
              <h2
                className="text-4xl font-semibold text-[#3E2F26]"
                style={{ fontFamily: '"Cormorant Garamond", serif' }}
              >
                Featured Collection
              </h2>

              <p className="mt-2 text-[#6B5B4D]">
                Carefully selected books worth exploring.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredBooks.map((book) => (
                <BookCard
                  key={`featured-${book.id}`}
                  id={book.id}
                  title={book.title}
                  author={book.author}
                  category={book.category}
                  cover_image={book.cover_image}
                  stock={book.stock}
                />
              ))}
            </div>
          </section>


          <section className="mt-20 pb-12">
            <div className="mb-8">
              <h2
                className="text-4xl font-semibold text-[#3E2F26]"
                style={{ fontFamily: '"Cormorant Garamond", serif' }}
              >
                Recently Added
              </h2>

              <p className="mt-2 text-[#6B5B4D]">
                Discover the latest additions to the Digly library.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {recentBooks.map((book) => (
                <BookCard
                  key={`recent-${book.id}`}
                  id={book.id}
                  title={book.title}
                  author={book.author}
                  category={book.category}
                  cover_image={book.cover_image}
                  stock={book.stock}
                />
              ))}
            </div>
          </section>

        </div>
      </main>
    </>
  );
}

export default Home;