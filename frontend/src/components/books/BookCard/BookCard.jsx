import { useNavigate } from "react-router-dom";

function BookCard({ id, title, author, category, cover_image, stock }) {
  const navigate = useNavigate();

  return (
    <div className="overflow-hidden rounded-2xl border border-[#E7DDD0] bg-[#FFFDF9] transition hover:-translate-y-1 hover:shadow-lg">

      <div
        onClick={() => navigate(`/books/${id}`)}
        className="cursor-pointer"
      >
        <div className="flex h-64 items-center justify-center bg-[#EFE7DC]">
          {cover_image ? (
            <img
              src={cover_image}
              alt={title}
              className="h-44 w-32 rounded-md border border-[#D8CDBF] object-cover transition hover:scale-105 shadow-sm"
            />
          ) : (
            <div className="flex h-44 w-32 items-center justify-center rounded-md border border-[#D8CDBF] bg-[#F8F5F0] text-[#8B6F47] transition hover:scale-105">
              Book Cover
            </div>
          )}
        </div>

        <div className="p-5">
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-[#F3ECE2] px-3 py-1 text-xs text-[#6B4F3A]">
              {category}
            </span>
            
            <span className={`text-xs font-semibold ${stock > 0 ? "text-green-600" : "text-red-500"}`}>
              {stock > 0 ? `Stok: ${stock}` : "Habis"}
            </span>
          </div>

          <h3 className="mt-4 text-lg font-semibold text-[#3E2F26] line-clamp-1">
            {title}
          </h3>

          <p className="mt-1 text-sm text-[#7A6A5A]">{author}</p>
        </div>
      </div>

      <div className="px-5 pb-5">
        <button
          onClick={() => navigate(`/books/${id}`)}
          className="mt-3 w-full rounded-full border border-[#6B4F3A] py-2 text-sm font-medium text-[#6B4F3A] transition hover:bg-[#6B4F3A] hover:text-white"
        >
          View Details
        </button>
      </div>
    </div>
  );
}

export default BookCard;