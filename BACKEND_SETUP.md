# FlowHer Backend Setup Guide

## Overview

This backend is a .NET 8 Web API with PostgreSQL database that provides:
- JWT authentication with admin user (username: `admin`, password: `Admin@123`)
- Product management APIs (CRUD operations)
- Image upload and management
- CORS configured for React frontend

## Prerequisites

1. **.NET 8 SDK** - [Download here](https://dotnet.microsoft.com/download/dotnet/8.0)
2. **PostgreSQL** - [Download here](https://www.postgresql.org/download/)

## Quick Start

### Step 1: Install and Setup PostgreSQL

#### On macOS (using Homebrew):
```bash
brew install postgresql@15
brew services start postgresql@15
```

#### On Windows:
Download and install from [PostgreSQL official website](https://www.postgresql.org/download/windows/)

#### On Linux (Ubuntu/Debian):
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### Step 2: Create the Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create the database
CREATE DATABASE flowherdb;

# Exit psql
\q
```

### Step 3: Configure Connection String

Edit `/backend/FlowHerAPI/appsettings.json` and update your PostgreSQL password if needed:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=flowherdb;Username=postgres;Password=YOUR_PASSWORD"
  }
}
```

### Step 4: Run the Backend

```bash
cd backend/FlowHerAPI
dotnet restore
dotnet run
```

The API will automatically:
- Create the database schema
- Seed the admin user
- Start listening on `http://localhost:5000` and `https://localhost:5001`

### Step 5: Test the API

Visit Swagger UI at: `https://localhost:5001/swagger`

Or test login endpoint:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Admin@123"}'
```

## API Endpoints

### Authentication

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "Admin@123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "admin",
  "role": "Admin"
}
```

### Products (Public Endpoints)

#### Get All Products
```
GET /api/products
```

#### Get Product by ID
```
GET /api/products/{id}
```

### Products (Admin Endpoints - Requires JWT Token)

Add the JWT token to the Authorization header:
```
Authorization: Bearer YOUR_TOKEN_HERE
```

#### Create Product
```
POST /api/products
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN

{
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
    },
    {
      "name": "Greeting Card",
      "price": 3.00,
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
    },
    {
      "stems": 36,
      "priceModifier": 25.00
    }
  ]
}
```

#### Update Product
```
PUT /api/products/{id}
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN

{
  "name": "Updated Product Name",
  "description": "Updated description",
  ...
}
```

#### Delete Product
```
DELETE /api/products/{id}
Authorization: Bearer YOUR_TOKEN
```

#### Upload Product Image
```
POST /api/products/{id}/images
Content-Type: multipart/form-data
Authorization: Bearer YOUR_TOKEN

file: [image file]
```

#### Delete Product Image
```
DELETE /api/products/{productId}/images/{imageId}
Authorization: Bearer YOUR_TOKEN
```

## Testing with Postman

1. **Login**
   - Method: POST
   - URL: `http://localhost:5000/api/auth/login`
   - Body (JSON):
     ```json
     {
       "username": "admin",
       "password": "Admin@123"
     }
     ```
   - Copy the `token` from the response

2. **Create Product**
   - Method: POST
   - URL: `http://localhost:5000/api/products`
   - Headers:
     - `Authorization: Bearer YOUR_TOKEN`
     - `Content-Type: application/json`
   - Body: See "Create Product" example above

3. **Upload Image**
   - Method: POST
   - URL: `http://localhost:5000/api/products/1/images`
   - Headers:
     - `Authorization: Bearer YOUR_TOKEN`
   - Body (form-data):
     - Key: `file`
     - Type: File
     - Value: Select an image file

## Project Structure

```
backend/FlowHerAPI/
├── Controllers/
│   ├── AuthController.cs         # Login endpoint
│   └── ProductsController.cs     # Product CRUD + image upload
├── Data/
│   └── ApplicationDbContext.cs   # EF Core DbContext
├── DTOs/
│   ├── LoginRequest.cs
│   ├── LoginResponse.cs
│   ├── ProductDto.cs
│   └── CreateProductRequest.cs
├── Models/
│   ├── User.cs                   # User entity
│   ├── Product.cs                # Product entity
│   ├── ProductImage.cs           # Product images
│   ├── ComboOption.cs            # Combo options (gift box, etc.)
│   └── QuantityOption.cs         # Quantity options (12, 24, 36 stems)
├── Services/
│   ├── IJwtService.cs
│   └── JwtService.cs             # JWT token generation
├── wwwroot/
│   └── images/                   # Uploaded product images
├── appsettings.json              # Configuration
└── Program.cs                    # Application startup
```

## Database Schema

The database automatically creates these tables:

- **Users**: Stores admin credentials
- **Products**: Main product information
- **ProductImages**: Multiple images per product
- **ComboOptions**: Add-ons like gift boxes, cards
- **QuantityOptions**: Different stem counts with price modifiers

## Common Issues

### Issue: Cannot connect to PostgreSQL

**Solution**: Ensure PostgreSQL is running:
```bash
# macOS
brew services list
brew services restart postgresql@15

# Linux
sudo systemctl status postgresql
sudo systemctl restart postgresql

# Windows
# Check Services app for PostgreSQL service
```

### Issue: "Database does not exist"

**Solution**: Create the database manually:
```bash
psql -U postgres -c "CREATE DATABASE flowherdb;"
```

### Issue: Authentication failed for user "postgres"

**Solution**: Reset PostgreSQL password or update the connection string in `appsettings.json`

### Issue: Port 5000 already in use

**Solution**: Change the port in `Properties/launchSettings.json` or stop the application using port 5000

## Security Considerations

For production deployment:

1. **Change JWT Secret**: Update the JWT Key in `appsettings.json` or use environment variables
2. **Update CORS**: Modify the CORS policy in `Program.cs` to include your production domain
3. **Use HTTPS**: Ensure HTTPS is enabled in production
4. **Secure Database**: Use a strong PostgreSQL password
5. **Environment Variables**: Store sensitive configuration in environment variables:
   ```bash
   export ConnectionStrings__DefaultConnection="Host=...;Database=...;Username=...;Password=..."
   export Jwt__Key="your-secret-key"
   ```

## Next Steps

1. Start the backend: `cd backend/FlowHerAPI && dotnet run`
2. Test the API using Swagger UI or Postman
3. Update the React frontend to connect to this backend
4. Add products through the API
5. Upload product images

## Support

For issues or questions, check:
- Swagger UI documentation at `https://localhost:5001/swagger`
- Backend README at `backend/README.md`
- PostgreSQL logs for database errors
