import { useState } from "react";
import { Book } from "../types/Book";
import { addBook } from "../api/BooksAPI";

interface NewBookFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const NewBookForm = ({ onSuccess, onCancel }: NewBookFormProps) => {
  const [formData, setFormData] = useState<Book>({
    bookID: 0,
    title: "",
    author: "",
    publisher: "",
    isbn: "",
    category: "",
    pageCount: 0,
    classification: "",
    price: 0,
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addBook(formData);
      onSuccess();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "An unknown error occurred."
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded bg-light">
      <h2 className="mb-3 text-center">Add New Book</h2>
      {errorMessage && (
        <p className="text-danger text-center">{errorMessage}</p>
      )}

      <div className="row row-cols-1 row-cols-md-2 g-3">
        {[
          { label: "Book Title", name: "title", type: "text" },
          { label: "Author", name: "author", type: "text" },
          { label: "Publisher", name: "publisher", type: "text" },
          { label: "ISBN", name: "isbn", type: "text" },
          { label: "Category", name: "category", type: "text" },
          { label: "Page Count", name: "pageCount", type: "number" },
          { label: "Classification", name: "classification", type: "text" },
          { label: "Price", name: "price", type: "number" },
        ].map(({ label, name, type }) => (
          <div className="col" key={name}>
            <label className="form-label">{label}:</label>
            <input
              type={type}
              name={name}
              value={formData[name as keyof Book] as string | number}
              onChange={handleChange}
              className="form-control"
            />
          </div>
        ))}
      </div>

      {/* Add & Cancel Buttons on Same Line */}
      <div className="d-flex justify-content-center gap-2 mt-3">
        <button type="submit" className="btn btn-success px-4">
          Add Book
        </button>
        <button
          type="button"
          className="btn btn-secondary px-4"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default NewBookForm;
