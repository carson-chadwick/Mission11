import { Book } from "../types/Book";

interface FetchBooksResponse {
  books: Book[];
  totalNumBooks: number;
}

const API_URL =
  "https://mission13-carson-backend.azurewebsites.net/Book";

export const fetchBooks = async (
pageSize: number, pageNum: number, selectedCategories: string[], sortOrder: string): Promise<FetchBooksResponse> => {
  try {
    const categoryParams = selectedCategories
      .map((cat) => `bookCategories=${encodeURIComponent(cat)}`)
      .join("&");
    // API call to fetch books with sorting and pagination parameters
    const response = await fetch(
      `${API_URL}/AllBooks?pageSize=${pageSize}&pageNum=${pageNum}&sortBy=title&sortOrder=${sortOrder}${selectedCategories.length ? `&${categoryParams}` : ""}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch books");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching books:", error);
    throw error;
  }
};

export const addBook = async (newBook: Book): Promise<Book> => {
  try {
    const response = await fetch(`${API_URL}/AddBook`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newBook),
    });

    // Check if the response is empty before parsing
    if (!response.ok) {
      const errorResponse = await response.text(); // Get the response as text
      console.error("Error response text:", errorResponse);
      throw new Error(errorResponse || "Failed to add book");
    }

    // Check if the response body is empty before trying to parse JSON
    const responseBody = await response.text();
    if (!responseBody) {
      throw new Error("Received empty response from server");
    }

    // If response has data, parse it as JSON
    const jsonResponse = JSON.parse(responseBody);
    return jsonResponse;
  } catch (error) {
    console.error("Error adding book:", error);
    throw error;
  }
};



export const updateBook = async (
  BookID: number,
  updatedBook: Book
): Promise<Book> => {
  try {
    const response = await fetch(`${API_URL}/UpdateBook/${BookID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedBook),
    });

    return await response.json();
  } catch (error) {
    console.error("Error updating book:", error);
    throw error;
  }
};

export const deleteBook = async (BookId: number): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/DeleteBook/${BookId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delte book");
    }
  } catch (error) {
    console.error("Error deleting book:", error);
    throw error;
  }
};
