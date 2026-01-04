using FlowHerAPI.Data;
using Microsoft.EntityFrameworkCore;

namespace FlowHerAPI;

public static class DbInitializer
{
    public static void Initialize(IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

        // Apply migrations
        context.Database.Migrate();

        // Database is created and seeded via EF Core migrations
        Console.WriteLine("Database initialized successfully!");
    }
}
