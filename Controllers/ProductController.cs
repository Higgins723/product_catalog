using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using product_catalog.Models;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace product_catalog.Controllers
{
    [Route("api/products")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly ProductContext _context;

        public ProductController(ProductContext context)
        {
            _context = context;
            if(_context.Products.Count() == 0)
            {
                _context.Products.Add(new Product { Name = "Cool Product", Description = "This product can tell you the time", Quantity = 23 });
                _context.Products.Add(new Product { Name = "Toaster", Description = "Just a toaster, does good job", Quantity = 3 });
                _context.SaveChanges();
            }
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
        {
            return await _context.Products.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProductItem(long id)
        {
            var product = await _context.Products.FindAsync(id);

            if (product == null)
            {
                return NotFound();
            }

            return product;
        }

        [HttpPost]
        public async Task<ActionResult<Product>> PostProduct(Product p)
        {
            if (_context.Products.Any(o => o.Name == p.Name))
            {
                return BadRequest();
            }
            else
            {
                _context.Products.Add(p);
                await _context.SaveChangesAsync();
                return CreatedAtAction(nameof(GetProducts), new { id = p.Id }, p);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutProductItem(long id, Product p)
        {
            if (id != p.Id)
            {
                return BadRequest();
            }

            _context.Entry(p).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProductItem(long id)
        {
            var todoItem = await _context.Products.FindAsync(id);

            if (todoItem == null)
            {
                return NotFound();
            }

            _context.Products.Remove(todoItem);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
