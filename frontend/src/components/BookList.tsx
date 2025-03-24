import { useEffect, useState } from "react";
import { Book } from "../types/Book";
import { useNavigate } from "react-router-dom";

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

  /**
   * Fetches books from the backend API whenever page size, page number, or sorting order changes.
   */
  useEffect(() => {
    const GetBooks = async () => {
      const categoryParams = selectedCategories
        .map((cat) => `bookCategories=${encodeURIComponent(cat)}`)
        .join("&");
      try {
        // API call to fetch books with sorting and pagination parameters
        const response = await fetch(
          `https://localhost:5000/Book/AllBooks?pageSize=${pageSize}&pageNum=${pageNum}&sortBy=title&sortOrder=${sortOrder}${selectedCategories.length ? `&${categoryParams}` : ""}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch books");
        }
        const data = await response.json();

        // Update state with the fetched data
        setBooks(data.books);
        setTotalPages(Math.ceil(data.totalBooks / pageSize)); // Calculate total pages
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    GetBooks();
  }, [pageSize, pageNum, sortOrder, selectedCategories]); // Dependencies ensure API call runs when values change

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

      {/* Pagination Controls */}
      <div className="d-flex justify-content-center mt-3">
        <nav>
          <ul className="pagination">
            {/* Previous Button */}
            <li className={`page-item ${pageNum === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => setPageNum(pageNum - 1)}
              >
                Previous
              </button>
            </li>

            {/* Page Number Buttons */}
            {[...Array(totalPages)].map((_, index) => (
              <li
                key={index + 1}
                className={`page-item ${pageNum === index + 1 ? "active" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => setPageNum(index + 1)}
                >
                  {index + 1}
                </button>
              </li>
            ))}

            {/* Next Button */}
            <li
              className={`page-item ${pageNum === totalPages ? "disabled" : ""}`}
            >
              <button
                className="page-link"
                onClick={() => setPageNum(pageNum + 1)}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Page Size Selector */}
      <div className="text-center mt-3">
        <label className="me-2">
          <strong>Results per page:</strong>
        </label>
        <select
          className="form-select d-inline w-auto"
          value={pageSize}
          onChange={(p) => {
            setPageSize(Number(p.target.value)); // Update page size
            setPageNum(1); // Reset to first page when changing page size
          }}
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
        </select>
      </div>
    </div>
  );
}

export default BookList;
