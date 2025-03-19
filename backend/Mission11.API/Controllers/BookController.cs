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
        public IActionResult GetBooks(int pageSize = 5, int pageNum = 1, string sortBy = "title", string sortOrder = "asc")
        {
            // Start with a queryable list of all books in the database
            var booksQuery = _bookContext.Books.AsQueryable();

            // Apply sorting based on 'sortBy' and 'sortOrder' query parameters
            if (sortBy.ToLower() == "title")
            {
                // Sorting by title in ascending or descending order
                booksQuery = sortOrder.ToLower() == "asc"
                    ? booksQuery.OrderBy(b => b.Title) // Ascending order
                    : booksQuery.OrderByDescending(b => b.Title); // Descending order
            }

            // Apply pagination: skip the books of previous pages and take the books for the current page
            var books = booksQuery
                .Skip((pageNum - 1) * pageSize)  // Skip books before the current page
                .Take(pageSize)  // Take only the number of books specified by pageSize
                .ToList();  // Execute the query and return the results as a list

            // Calculate the total number of books in the database
            var totalNumBooks = _bookContext.Books.Count();

            // Return the list of books along with the total number of books
            return Ok(new
            {
                Books = books,  // List of books for the current page
                TotalBooks = totalNumBooks  // Total number of books in the database
            });
        }
    }
}


