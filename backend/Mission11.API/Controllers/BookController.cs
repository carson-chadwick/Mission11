using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using mission11api.Data;

namespace mission11api.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class BookController : ControllerBase
    {
        private BookDbContext _bookContext;

        public BookController(BookDbContext temp) => _bookContext = temp;

        [HttpGet("AllBooks")]
        public IEnumerable<Book> GetBooks()
        {
            var something = _bookContext.Books.ToList();
            return something;
        }
        
    }
}
