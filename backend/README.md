# FlowHer API - Backend

.NET 8 Web API with PostgreSQL database for FlowHer e-commerce application.

## Prerequisites

- .NET 8 SDK
- PostgreSQL database
- dotnet-ef tool (for migrations)

## Setup Instructions

### 1. Install PostgreSQL

Make sure PostgreSQL is installed and running on your system.

### 2. Create Database

Create a PostgreSQL database named `flowherdb`:

```bash
psql -U postgres
CREATE DATABASE flowherdb;
\q
```

### 3. Update Connection String

Edit `appsettings.json` and update the connection string if needed:

```json
"ConnectionStrings": {
  "DefaultConnection": "Host=localhost;Port=5432;Database=flowherdb;Username=postgres;Password=YOUR_PASSWORD"
}
```

### 4. Install EF Core Tools

```bash
dotnet tool install --global dotnet-ef
```

If you get an error, try:

```bash
dotnet tool update --global dotnet-ef
```

### 5. Run Migrations

```bash
cd FlowHerAPI
dotnet ef migrations add InitialCreate
dotnet ef database update
```

### 6. Run the Application

```bash
dotnet run
```

The API will be available at:
- HTTP: `http://localhost:5000`
- HTTPS: `https://localhost:5001`
- Swagger UI: `https://localhost:5001/swagger`

## Default Admin Credentials

- **Username:** `admin`
- **Password:** `Admin@123`

## API Endpoints

### Authentication

- `POST /api/auth/login` - Login with username and password

### Products (Public)

- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get product by ID

### Products (Admin Only - Requires JWT Token)

- `POST /api/products` - Create new product
- `PUT /api/products/{id}` - Update product
- `DELETE /api/products/{id}` - Delete product
- `POST /api/products/{id}/images` - Upload product image
- `DELETE /api/products/{productId}/images/{imageId}` - Delete product image

## Testing with cURL

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Admin@123"}'
```

### Create Product (with JWT token)

```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Classic Red Roses",
    "description": "Beautiful handcrafted paper roses",
    "basePrice": 29.99,
    "category": "roses",
    "ecoFriendly": true,
    "sustainabilityInfo": "Made from 100% recycled paper",
    "inStock": true,
    "comboOptions": [
      {
        "name": "Gift Box",
        "price": 5.00,
        "category": "accessory"
      }
    ],
    "quantityOptions": [
      {
        "stems": 12,
        "priceModifier": 0.00
      },
      {
        "stems": 24,
        "priceModifier": 15.00
      }
    ]
  }'
```

### Upload Product Image

```bash
curl -X POST http://localhost:5000/api/products/1/images \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@/path/to/image.jpg"
```

## Project Structure

```
FlowHerAPI/
├── Controllers/
│   ├── AuthController.cs
│   └── ProductsController.cs
├── Data/
│   └── ApplicationDbContext.cs
├── DTOs/
│   ├── LoginRequest.cs
│   ├── LoginResponse.cs
│   ├── ProductDto.cs
│   └── CreateProductRequest.cs
├── Models/
│   ├── User.cs
│   ├── Product.cs
│   ├── ProductImage.cs
│   ├── ComboOption.cs
│   └── QuantityOption.cs
├── Services/
│   ├── IJwtService.cs
│   └── JwtService.cs
└── wwwroot/
    └── images/          # Uploaded product images
```

## Database Schema

### Users Table
- Id (Primary Key)
- Username
- PasswordHash
- Role
- CreatedAt

### Products Table
- Id (Primary Key)
- Name
- Description
- BasePrice
- Category
- EcoFriendly
- SustainabilityInfo
- InStock
- CreatedAt
- UpdatedAt

### ProductImages Table
- Id (Primary Key)
- ProductId (Foreign Key)
- ImageUrl
- Order

### ComboOptions Table
- Id (Primary Key)
- ProductId (Foreign Key)
- Name
- Price
- ImageUrl
- Category

### QuantityOptions Table
- Id (Primary Key)
- ProductId (Foreign Key)
- Stems
- PriceModifier

## Security Notes

1. Change the JWT secret key in production (`appsettings.json`)
2. Use HTTPS in production
3. Update CORS policy for production domains
4. Store sensitive configuration in environment variables or Azure Key Vault
5. Change the default admin password after first login
