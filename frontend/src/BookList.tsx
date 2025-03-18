import { useEffect, useState } from "react";
import { Book } from "./types/Book";

function BookList() {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch("https://localhost:5000/Book/AllBooks");
        if (!response.ok) {
          throw new Error("Failed to fetch books");
        }
        const data = await response.json();
        setBooks(data);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };
    fetchBooks();
  }, []);

  return (
    <>
      <h1>Book Inventory</h1>
      <br />
      {books.map((b) => (
        <div id="bookID">
          <h3>{b.title}</h3>
          <ul>
            <li>Author: {b.author} </li>
            <li>Title: {b.title}</li>
            <li>Publisher: </li>
            <li>ISBN: {b.isbn} </li>
            <li>Classification: {b.classification}</li>
            <li>Category: {b.category} </li>
            <li>Page Count: {b.pageCount}</li>
            <li>Price: {b.price} </li>
          </ul>
        </div>
      ))}
    </>
  );
}

export default BookList;
