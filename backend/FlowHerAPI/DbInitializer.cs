using FlowHerAPI.Data;
using Microsoft.EntityFrameworkCore;

namespace FlowHerAPI;

public static class DbInitializer
{
    public static void Initialize(IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

        // 1. Seed Admin User
        if (!context.Users.Any())
        {
            context.Users.Add(new Models.User
            {
                Username = "admin",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("FlowHer2026!"), // Secure default password
                Role = "Admin",
                CreatedAt = DateTime.UtcNow
            });
            context.SaveChanges();
            Console.WriteLine("Admin user seeded successfully!");
        }

        // 2. Seed Initial Products
        if (!context.Products.Any())
        {
            var peony = new Models.Product
            {
                Name = "Pink Peony Bouquet",
                Description = "Lush, sustainable paper peonies that never fade.",
                BasePrice = 1299,
                Category = "peonies",
                EcoFriendly = true,
                SustainabilityInfo = "Handcrafted from 100% recycled paper.",
                InStock = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            context.Products.Add(peony);
            context.SaveChanges();

            context.ProductImages.Add(new Models.ProductImage
            {
                ProductId = peony.Id,
                ImageUrl = "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&q=80&w=800",
                Order = 0
            });

            context.QuantityOptions.Add(new Models.QuantityOption { ProductId = peony.Id, Stems = 5, PriceModifier = 0 });
            context.QuantityOptions.Add(new Models.QuantityOption { ProductId = peony.Id, Stems = 10, PriceModifier = 800 });

            context.ComboOptions.Add(new Models.ComboOption { ProductId = peony.Id, Name = "Bamboo Vase", Price = 450, Category = "accessory" });

            context.SaveChanges();
            Console.WriteLine("Initial products seeded successfully!");
        }
    }
}
