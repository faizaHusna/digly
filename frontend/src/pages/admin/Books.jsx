import { useState, useEffect } from "react";
import axios from "axios";
import AdminLayout from "../../components/admin/AdminLayout";

export default function Books() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // State untuk Modal Form (Tambah & Edit)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState(null);
  
  // State Payload Form
  const [formData, setFormData] = useState({
    isbn: "",
    title: "",
    author: "",
    category: "",
    stock: 0,
    cover_image: ""
  });

  // 1. READ: Ambil data dari database MySQL via API utama Anda
  const fetchBooks = async () => {
    try {
      setLoading(true);
      // Memakai anti-cache timestamp agar data selalu real-time saat dimutasi
      const response = await axios.get(`http://localhost:5000/api/books?t=${Date.now()}`);
      setBooks(response.data);
    } catch (err) {
      console.error("Gagal mengambil data buku admin:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // 2. TRIGGER MODAL: Siapkan form untuk Tambah atau Edit
  const openModal = (book = null) => {
    if (book) {
      setIsEditing(true);
      setSelectedBookId(book.id);
      setFormData({
        isbn: book.isbn || "",
        title: book.title,
        author: book.author,
        category: book.category || "",
        stock: book.stock,
        cover_image: book.cover_image || ""
      });
    } else {
      setIsEditing(false);
      setSelectedBookId(null);
      setFormData({ isbn: "", title: "", author: "", category: "", stock: 0, cover_image: "" });
    }
    setIsModalOpen(true);
  };

  // 3. CREATE & UPDATE: Fungsi submit ke backend admin rute
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("digly_token");
      const headers = { Authorization: `Bearer ${token}` };

      if (isEditing) {
        // Jalur PUT untuk Update Buku
        await axios.put(`http://localhost:5000/api/admin/books/${selectedBookId}`, formData, { headers });
        alert("Buku berhasil diperbarui!");
      } else {
        // Jalur POST untuk Tambah Buku Baru
        await axios.post("http://localhost:5000/api/admin/books", formData, { headers });
        alert("Buku baru berhasil ditambahkan!");
      }
      
      setIsModalOpen(false);
      fetchBooks(); // Memuat ulang isi tabel database terbaru
    } catch (err) {
      alert(err.response?.data?.message || "Terjadi kesalahan sistem.");
    }
  };

  // 4. DELETE: Fungsi hapus record dari database
  const handleDelete = async (id, title) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus buku "${title}" secara permanen dari database?`)) {
      try {
        const token = localStorage.getItem("digly_token");
        await axios.delete(`http://localhost:5000/api/admin/books/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert("Buku sukses dihapus!");
        fetchBooks(); // Tarik ulang data ter-update
      } catch (err) {
        alert("Gagal menghapus buku.");
      }
    }
  };

  // 5. LIVE SEARCH: Filter data lokal berdasarkan ketikan admin
  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <h1 className="text-5xl text-[#3E2F26] mb-2" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
        Books Management
      </h1>
      <p className="text-[#6B5B4D] mb-6">Manage library book collection</p>

      {/* Kontrol Atas (Pencarian & Tambah) */}
      <div className="flex justify-between mb-6">
        <input
          type="text"
          placeholder="Search books by title or author..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-5 py-3 rounded-full border border-[#D8CDBF] bg-white w-[420px] outline-none text-[#6B5B4D]"
        />

        <button 
          onClick={() => openModal()} 
          className="bg-[#6B4F3A] text-white px-6 py-3 rounded-full hover:bg-[#533D2D] transition shadow-sm"
        >
          + Add Book
        </button>
      </div>

      {/* Tabel Data Buku */}
      <div className="bg-[#FFFDF9] border border-[#E7DDD0] rounded-2xl p-6 shadow-sm">
        <div className="grid grid-cols-4 font-semibold text-[#3E2F26] mb-4 pb-2 border-b border-[#E7DDD0]">
          <span>Title</span>
          <span>Author</span>
          <span>Stock</span>
          <span>Action</span>
        </div>

        {loading ? (
          <div className="text-center py-6 text-[#6B5B4D]">Loading library book data...</div>
        ) : filteredBooks.length === 0 ? (
          <div className="text-center py-6 text-[#6B5B4D]">Tidak ada data buku yang tersedia.</div>
        ) : (
          filteredBooks.map((book) => (
            <div key={book.id} className="grid grid-cols-4 py-3 text-[#6B5B4D] border-t border-[#F2EBE1] items-center">
              <span className="font-medium text-[#3E2F26]">{book.title}</span>
              <span>{book.author}</span>
              <span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${book.stock > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                  {book.stock} Pcs
                </span>
              </span>
              <span className="space-x-3">
                <button onClick={() => openModal(book)} className="text-[#8B6F47] hover:underline font-medium">Edit</button>
                <button onClick={() => handleDelete(book.id, book.title)} className="text-[#B45309] hover:underline font-medium">Delete</button>
              </span>
            </div>
          ))
        )}
      </div>

      {/* MODAL FORM OVERLAY (Pop-up Tambah/Edit Buku) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#FFFDF9] border border-[#E7DDD0] w-full max-w-lg rounded-2xl p-6 shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-2xl font-serif text-[#3E2F26] mb-4 font-semibold">
              {isEditing ? "📝 Edit Book Detail" : "➕ Add New Book to Database"}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#6B5B4D] uppercase mb-1">ISBN / Code</label>
                <input
                  type="text" required
                  value={formData.isbn}
                  onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                  className="w-full px-4 py-2 border border-[#D8CDBF] rounded-xl outline-none bg-white text-[#3E2F26]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#6B5B4D] uppercase mb-1">Book Title</label>
                <input
                  type="text" required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-[#D8CDBF] rounded-xl outline-none bg-white text-[#3E2F26]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#6B5B4D] uppercase mb-1">Author</label>
                  <input
                    type="text" required
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full px-4 py-2 border border-[#D8CDBF] rounded-xl outline-none bg-white text-[#3E2F26]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#6B5B4D] uppercase mb-1">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-[#D8CDBF] rounded-xl outline-none bg-white text-[#3E2F26]"
                    placeholder="e.g. Fiction, Novel"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#6B5B4D] uppercase mb-1">Stock Quantity</label>
                  <input
                    type="number" required min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-[#D8CDBF] rounded-xl outline-none bg-white text-[#3E2F26]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#6B5B4D] uppercase mb-1">Cover Image URL</label>
                  <input
                    type="text"
                    value={formData.cover_image}
                    onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                    className="w-full px-4 py-2 border border-[#D8CDBF] rounded-xl outline-none bg-white text-[#3E2F26]"
                    placeholder="https://..."
                  />
                </div>
              </div>

              {/* Aksi Tombol Form */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-[#F2EBE1] mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2 rounded-full border border-[#D8CDBF] text-[#6B5B4D] hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-full bg-[#6B4F3A] text-white hover:bg-[#533D2D] transition shadow-sm"
                >
                  {isEditing ? "Save Changes" : "Save Book"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}