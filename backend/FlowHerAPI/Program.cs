using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using FlowHerAPI.Data;
using FlowHerAPI.Services;
using FlowHerAPI;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure Database
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

if (builder.Environment.IsDevelopment())
{
    builder.Services.AddDbContext<ApplicationDbContext>(options =>
        options.UseSqlite(connectionString));
}
else
{
    // Handle URI-style connection string from Render
    if (!string.IsNullOrEmpty(connectionString) && connectionString.StartsWith("postgres"))
    {
        try 
        {
            var uri = new Uri(connectionString);
            var userInfo = uri.UserInfo.Split(':');
            var user = userInfo[0];
            var password = userInfo.Length > 1 ? userInfo[1] : "";
            var host = uri.Host;
            var port = uri.Port > 0 ? uri.Port : 5432;
            var database = uri.AbsolutePath.TrimStart('/');

            connectionString = $"Host={host};Port={port};Database={database};Username={user};Password={password};SSL Mode=Require;Trust Server Certificate=true;Include Error Detail=true";
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error parsing connection string: {ex.Message}");
        }
    }
    
    builder.Services.AddDbContext<ApplicationDbContext>(options =>
        options.UseNpgsql(connectionString));
}

// JWT & Services
var jwtKey = builder.Configuration["Jwt:Key"] ?? "Initial_Default_Key_For_Seed_Only_Change_In_Prod";
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "FlowHerAPI";
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? "FlowHerApp";

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtIssuer,
            ValidAudience = jwtAudience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };
    });

builder.Services.AddAuthorization();
builder.Services.AddScoped<IJwtService, JwtService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        var allowedOrigins = builder.Configuration["AllowedOrigins"]?.Split(',', StringSplitOptions.RemoveEmptyEntries) 
                             ?? Array.Empty<string>();
        
        policy.WithOrigins(allowedOrigins.Union(new[] { "http://localhost:5173", "http://192.168.0.5:5173" }).ToArray())
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });
});

var app = builder.Build();

// Health Check
app.MapGet("/health", async (ApplicationDbContext db) => {
    try {
        var canConnect = await db.Database.CanConnectAsync();
        return Results.Ok(new { Status = "Healthy", Database = canConnect ? "Connected" : "Disconnected" });
    } catch (Exception ex) {
        return Results.Problem($"Database connection failed: {ex.Message}");
    }
});

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowReactApp");
app.UseStaticFiles();
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

// Seed
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<ApplicationDbContext>();
        context.Database.EnsureCreated();
        DbInitializer.Initialize(services);
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred while seeding the database.");
    }
}

app.Run();
