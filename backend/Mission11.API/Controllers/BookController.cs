using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using mission11api.Data;
using System.Linq;

namespace mission11api.Controllers
{
    // Defining the route to access this controller: [controller] is replaced with "book"
    [Route("[controller]")]
    [ApiController] // Indicates that this class is an API controller
    public class BookController : ControllerBase
    {
        // Injecting the BookDbContext to interact with the database
        private BookDbContext _bookContext;

        // Constructor to initialize the BookDbContext
        public BookController(BookDbContext temp) => _bookContext = temp;

        // GET method to retrieve books with pagination and sorting options
        [HttpGet("AllBooks")]
        public IActionResult GetBooks(int pageSize = 5, int pageNum = 1, string sortBy = "title", string sortOrder = "asc", [FromQuery] List<string>? bookCategories = null)
        {
            // Start with a queryable list of all books in the database
            var booksQuery = _bookContext.Books.AsQueryable();

            if (bookCategories != null && bookCategories.Any())
            {
                booksQuery = booksQuery.Where(b => bookCategories.Contains(b.Category));
            }

            // Apply sorting based on 'sortBy' and 'sortOrder' query parameters
            if (sortBy.ToLower() == "title")
            {
                // Sorting by title in ascending or descending order
                booksQuery = sortOrder.ToLower() == "asc"
                    ? booksQuery.OrderBy(b => b.Title) // Ascending order
                    : booksQuery.OrderByDescending(b => b.Title); // Descending order
            }
            // Calculate the total number of books in the database
            var totalNumBooks = booksQuery.Count();

            // Apply pagination: skip the books of previous pages and take the books for the current page
            var books = booksQuery
                .Skip((pageNum - 1) * pageSize)  // Skip books before the current page
                .Take(pageSize)  // Take only the number of books specified by pageSize
                .ToList();  // Execute the query and return the results as a list



            // Return the list of books along with the total number of books
            return Ok(new
            {
                Books = books,  // List of books for the current page
                totalNumBooks = totalNumBooks  // Total number of books in the database
            });
        }

        [HttpGet("GetBookCategories")]
        public IActionResult GetBookCategories ()
        {
            var bookCategories = _bookContext.Books
                .Select(b  => b.Category)
                .Distinct()
                .ToList();

                return Ok(bookCategories);

        }

        [HttpPost("AddBook")]
        public IActionResult AddBook([FromBody] Book newBook)
        {
            try
            {
                // Add the book to the database
                _bookContext.Books.Add(newBook);
                _bookContext.SaveChanges();
                
                // Return the added book as JSON
                return Ok(newBook);  // Make sure to return JSON
            }
            catch (Exception ex)
            {
                // Log the error details
                Console.Error.WriteLine($"Error adding book: {ex.Message}");
                
                // Return a specific error response
                return StatusCode(500, new { message = "Internal server error: Failed to add book" });
            }
        }


        [HttpPut("UpdateBook/{BookID}")]
        public IActionResult UpdateBook(int BookID, [FromBody] Book updatedBook)
        {
            var existingBook = _bookContext.Books.Find(BookID);

            existingBook.Title = updatedBook.Title;
            existingBook.Author = updatedBook.Author;
            existingBook.Publisher = updatedBook.Publisher;
            existingBook.ISBN = updatedBook.ISBN;
            existingBook.Classification = updatedBook.Classification;
            existingBook.Category = updatedBook.Category;
            existingBook.PageCount = updatedBook.PageCount;
            existingBook.Price = updatedBook.Price;


            _bookContext.Books.Update(existingBook);
            _bookContext.SaveChanges();

            return Ok(existingBook);
        }

        [HttpDelete("DeleteBook/{BookID}")]
        public IActionResult DeleteBook(int BookID)
        {
            var book = _bookContext.Books.Find(BookID);

            if (book == null)
            {
                return NotFound(new {message = "book not found"});
            }

            _bookContext.Books.Remove(book);
            _bookContext.SaveChanges();

            return NoContent();
        }
    }
}


