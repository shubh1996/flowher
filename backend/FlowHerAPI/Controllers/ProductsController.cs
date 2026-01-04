using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FlowHerAPI.Data;
using FlowHerAPI.DTOs;
using FlowHerAPI.Models;

namespace FlowHerAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IWebHostEnvironment _environment;

    public ProductsController(ApplicationDbContext context, IWebHostEnvironment environment)
    {
        _context = context;
        _environment = environment;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ProductDto>>> GetProducts()
    {
        var products = await _context.Products
            .Include(p => p.Images)
            .Include(p => p.ComboOptions)
            .Include(p => p.QuantityOptions)
            .ToListAsync();

        var productDtos = products.Select(p => new ProductDto
        {
            Id = p.Id,
            Name = p.Name,
            Description = p.Description,
            BasePrice = p.BasePrice,
            Images = p.Images.OrderBy(i => i.Order).Select(i => i.ImageUrl).ToList(),
            Category = p.Category,
            EcoFriendly = p.EcoFriendly,
            SustainabilityInfo = p.SustainabilityInfo,
            ComboOptions = p.ComboOptions.Select(c => new ComboOptionDto
            {
                Id = c.Id.ToString(),
                Name = c.Name,
                Price = c.Price,
                Image = c.ImageUrl,
                Category = c.Category
            }).ToList(),
            QuantityOptions = p.QuantityOptions.Select(q => new QuantityOptionDto
            {
                Stems = q.Stems,
                PriceModifier = q.PriceModifier
            }).ToList(),
            InStock = p.InStock
        }).ToList();

        return Ok(productDtos);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ProductDto>> GetProduct(int id)
    {
        var product = await _context.Products
            .Include(p => p.Images)
            .Include(p => p.ComboOptions)
            .Include(p => p.QuantityOptions)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (product == null)
            return NotFound();

        var productDto = new ProductDto
        {
            Id = product.Id,
            Name = product.Name,
            Description = product.Description,
            BasePrice = product.BasePrice,
            Images = product.Images.OrderBy(i => i.Order).Select(i => i.ImageUrl).ToList(),
            Category = product.Category,
            EcoFriendly = product.EcoFriendly,
            SustainabilityInfo = product.SustainabilityInfo,
            ComboOptions = product.ComboOptions.Select(c => new ComboOptionDto
            {
                Id = c.Id.ToString(),
                Name = c.Name,
                Price = c.Price,
                Image = c.ImageUrl,
                Category = c.Category
            }).ToList(),
            QuantityOptions = product.QuantityOptions.Select(q => new QuantityOptionDto
            {
                Stems = q.Stems,
                PriceModifier = q.PriceModifier
            }).ToList(),
            InStock = product.InStock
        };

        return Ok(productDto);
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<ActionResult<ProductDto>> CreateProduct([FromBody] CreateProductRequest request)
    {
        var product = new Product
        {
            Name = request.Name,
            Description = request.Description,
            BasePrice = request.BasePrice,
            Category = request.Category,
            EcoFriendly = request.EcoFriendly,
            SustainabilityInfo = request.SustainabilityInfo,
            InStock = request.InStock,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Products.Add(product);
        await _context.SaveChangesAsync();

        // Add combo options
        foreach (var combo in request.ComboOptions)
        {
            _context.ComboOptions.Add(new ComboOption
            {
                ProductId = product.Id,
                Name = combo.Name,
                Price = combo.Price,
                ImageUrl = combo.Image,
                Category = combo.Category
            });
        }

        // Add quantity options
        foreach (var quantity in request.QuantityOptions)
        {
            _context.QuantityOptions.Add(new QuantityOption
            {
                ProductId = product.Id,
                Stems = quantity.Stems,
                PriceModifier = quantity.PriceModifier
            });
        }

        await _context.SaveChangesAsync();

        // Load the product with related data
        var createdProduct = await _context.Products
            .Include(p => p.Images)
            .Include(p => p.ComboOptions)
            .Include(p => p.QuantityOptions)
            .FirstAsync(p => p.Id == product.Id);

        var productDto = new ProductDto
        {
            Id = createdProduct.Id,
            Name = createdProduct.Name,
            Description = createdProduct.Description,
            BasePrice = createdProduct.BasePrice,
            Images = createdProduct.Images.OrderBy(i => i.Order).Select(i => i.ImageUrl).ToList(),
            Category = createdProduct.Category,
            EcoFriendly = createdProduct.EcoFriendly,
            SustainabilityInfo = createdProduct.SustainabilityInfo,
            ComboOptions = createdProduct.ComboOptions.Select(c => new ComboOptionDto
            {
                Id = c.Id.ToString(),
                Name = c.Name,
                Price = c.Price,
                Image = c.ImageUrl,
                Category = c.Category
            }).ToList(),
            QuantityOptions = createdProduct.QuantityOptions.Select(q => new QuantityOptionDto
            {
                Stems = q.Stems,
                PriceModifier = q.PriceModifier
            }).ToList(),
            InStock = createdProduct.InStock
        };

        return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, productDto);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateProduct(int id, [FromBody] CreateProductRequest request)
    {
        var product = await _context.Products
            .Include(p => p.ComboOptions)
            .Include(p => p.QuantityOptions)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (product == null)
            return NotFound();

        product.Name = request.Name;
        product.Description = request.Description;
        product.BasePrice = request.BasePrice;
        product.Category = request.Category;
        product.EcoFriendly = request.EcoFriendly;
        product.SustainabilityInfo = request.SustainabilityInfo;
        product.InStock = request.InStock;
        product.UpdatedAt = DateTime.UtcNow;

        // Update combo options
        _context.ComboOptions.RemoveRange(product.ComboOptions);
        foreach (var combo in request.ComboOptions)
        {
            _context.ComboOptions.Add(new ComboOption
            {
                ProductId = product.Id,
                Name = combo.Name,
                Price = combo.Price,
                ImageUrl = combo.Image,
                Category = combo.Category
            });
        }

        // Update quantity options
        _context.QuantityOptions.RemoveRange(product.QuantityOptions);
        foreach (var quantity in request.QuantityOptions)
        {
            _context.QuantityOptions.Add(new QuantityOption
            {
                ProductId = product.Id,
                Stems = quantity.Stems,
                PriceModifier = quantity.PriceModifier
            });
        }

        await _context.SaveChangesAsync();

        return NoContent();
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProduct(int id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null)
            return NotFound();

        _context.Products.Remove(product);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("{id}/images")]
    public async Task<ActionResult<string>> UploadProductImage(int id, IFormFile file)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null)
            return NotFound();

        if (file == null || file.Length == 0)
            return BadRequest("No file uploaded");

        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();

        if (!allowedExtensions.Contains(extension))
            return BadRequest("Invalid file type");

        var fileName = $"{Guid.NewGuid()}{extension}";
        var imagesPath = Path.Combine(_environment.WebRootPath, "images");

        if (!Directory.Exists(imagesPath))
            Directory.CreateDirectory(imagesPath);

        var filePath = Path.Combine(imagesPath, fileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        var imageUrl = $"/images/{fileName}";

        var maxOrder = await _context.ProductImages
            .Where(i => i.ProductId == id)
            .MaxAsync(i => (int?)i.Order) ?? -1;

        var productImage = new ProductImage
        {
            ProductId = id,
            ImageUrl = imageUrl,
            Order = maxOrder + 1
        };

        _context.ProductImages.Add(productImage);
        await _context.SaveChangesAsync();

        return Ok(new { imageUrl });
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{productId}/images/{imageId}")]
    public async Task<IActionResult> DeleteProductImage(int productId, int imageId)
    {
        var image = await _context.ProductImages
            .FirstOrDefaultAsync(i => i.Id == imageId && i.ProductId == productId);

        if (image == null)
            return NotFound();

        // Delete physical file
        var filePath = Path.Combine(_environment.WebRootPath, image.ImageUrl.TrimStart('/'));
        if (System.IO.File.Exists(filePath))
        {
            System.IO.File.Delete(filePath);
        }

        _context.ProductImages.Remove(image);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
