import { useEffect, useState } from "react";
import { Book } from "../types/Book";
import { useNavigate } from "react-router-dom";
import { fetchBooks } from "../api/BooksAPI";
import Pagination from "./Pagination";

function BookList({ selectedCategories }: { selectedCategories: string[] }) {
  /**
   * State variables to manage books, pagination, and sorting
   */
  const [books, setBooks] = useState<Book[]>([]); // Stores the list of books
  const [pageSize, setPageSize] = useState<number>(5); // Number of books per page
  const [pageNum, setPageNum] = useState<number>(1); // Current page number
  const [totalPages, setTotalPages] = useState<number>(0); // Total number of pages
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc"); // Sorting order for books
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * Fetches books from the backend API whenever page size, page number, or sorting order changes.
   */
  useEffect(() => {
    const loadBooks = async () => {
      try {
        setLoading(true);
        const data = await fetchBooks(
          pageSize,
          pageNum,
          selectedCategories,
          sortOrder
        ); // Pass sortOrder here
        // Update state with fetched data
        setBooks(data.books);

        // Ensure totalNumBooks is valid before calculating totalPages
        const totalNumBooks = data.totalNumBooks;
        if (typeof totalNumBooks === "number" && totalNumBooks >= 0) {
          setTotalPages(Math.ceil(totalNumBooks / pageSize)); // Calculate total pages
        } else {
          setTotalPages(0); // Set to 0 if totalNumBooks is invalid
        }
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    loadBooks(); // Invoke the function to fetch data
  }, [pageSize, pageNum, selectedCategories, sortOrder]); // Add sortOrder to dependencies

  if (loading) return <p>Loading books...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="container mt-4">
      {/* Sorting Buttons */}
      <div className="text-center mb-3">
        <button
          className={`btn btn-primary me-2 ${sortOrder === "asc" ? "disabled" : ""}`}
          onClick={() => setSortOrder("asc")}
        >
          Sort A-Z
        </button>
        <button
          className={`btn btn-secondary ${sortOrder === "desc" ? "disabled" : ""}`}
          onClick={() => setSortOrder("desc")}
        >
          Sort Z-A
        </button>
      </div>

      {/* Book Cards Section */}
      <div className="row row-cols-1 row-cols-md-2 g-4 justify-content-center">
        {books.map((b) => (
          <div key={b.bookID} className="col d-flex justify-content-center">
            <div
              className="card shadow-sm border-0 rounded w-100 h-100 d-flex flex-column"
              style={{
                maxWidth: books.length === 1 ? "30rem" : "100%", // 🔹 Ensures the last card isn’t too wide or too narrow
                minWidth: books.length === 1 ? "30rem" : "auto", // 🔹 Prevents the last card from shrinking too much
                minHeight: "250px", // 🔹 Prevents stretching
                overflow: "hidden", // 🔹 Keeps text within bounds
                textOverflow: "ellipsis", // 🔹 Prevents ugly line breaks
              }}
            >
              <div className="card-body d-flex flex-column">
                {/* Book Title */}
                <h5 className="card-title text-primary mb-3">{b.title}</h5>
                {/* Book Details */}
                <p className="card-text mb-2">
                  <strong>Author:</strong> {b.author}
                </p>
                <p className="card-text mb-2">
                  <strong>Publisher:</strong> {b.publisher}
                </p>
                <p className="card-text mb-2">
                  <strong>ISBN:</strong> {b.isbn}
                </p>
                <p className="card-text mb-2">
                  <strong>Category:</strong> {b.category}
                </p>
                <p className="card-text mb-2">
                  <strong>Price:</strong> ${b.price.toFixed(2)}
                </p>
                <div className="d-flex justify-content-between align-items-center mt-auto">
                  <button
                    className="btn btn-success w-100"
                    onClick={() =>
                      navigate(`/buy/${b.title}/${b.bookID}/${b.price}`)
                    }
                  >
                    Buy
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Pagination
        currentPage={pageNum}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={setPageNum}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          setPageNum(1);
        }}
      />
    </div>
  );
}

export default BookList;
