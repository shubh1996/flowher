# FlowHer Admin Panel Guide

## 🚀 Applications Running

### Frontend (React + Vite)
- **Local**: http://localhost:5173/
- **Network**: http://192.168.0.5:5173/
- Status: ✅ Running

### Backend (.NET API)
- **API Base**: http://localhost:5230/api
- **Swagger UI**: http://localhost:5230/swagger (if you want to test APIs directly)
- Status: ✅ Running

## 📱 Access Points

### Customer Facing Store
- **URL**: http://localhost:5173/
- Public product catalog and shopping experience

### Admin Panel Login
- **URL**: http://localhost:5173/admin/login
- **Username**: `admin`
- **Password**: `Admin@123`

### Admin Dashboard
- **URL**: http://localhost:5173/admin/dashboard
- (Automatically redirected after login)

## 🎯 Admin Panel Features

### 1. Login
1. Go to http://localhost:5173/admin/login
2. Enter credentials:
   - Username: `admin`
   - Password: `Admin@123`
3. Click "Login"
4. You'll be redirected to the dashboard

### 2. View All Products
- The dashboard shows all products in a grid layout
- Each product card displays:
  - Product image (if uploaded)
  - Name
  - Description
  - Price
  - Edit and Delete buttons

### 3. Add New Product
1. Click the "Add Product" button (top right)
2. Fill in the product details:
   - **Name**: Product name
   - **Description**: Product description
   - **Base Price**: Starting price
   - **Category**: roses, peonies, daisies, wildflowers, or mixed
   - **Sustainability Info**: Optional eco-friendly information
   - **Eco-Friendly**: Check if the product is eco-friendly
   - **In Stock**: Check if the product is available
3. Add **Quantity Options**:
   - Click "+ Add Option" to add stem quantity tiers
   - Enter stems count (e.g., 12, 24, 36)
   - Enter price modifier (e.g., 0, 15.00, 25.00)
4. Add **Combo Options** (optional add-ons):
   - Click "+ Add Option" to add accessories
   - Enter name (e.g., "Gift Box", "Greeting Card")
   - Enter price (e.g., 5.00, 3.00)
5. Click "Create Product"

### 4. Edit Product
1. Click the "Edit" button on any product card
2. Update the product information in the form
3. Click "Update Product"

### 5. Delete Product
1. Click the "Delete" button on any product card
2. Confirm the deletion in the popup
3. Product will be removed from the database

### 6. Upload Product Images
**Note**: Image upload functionality is built into the API but needs to be added to the UI. You can upload images using the API directly:

```bash
curl -X POST http://localhost:5230/api/products/1/images \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@/path/to/image.jpg"
```

### 7. Logout
- Click the "Logout" button in the top right corner
- You'll be redirected back to the login page

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Protected Routes**: Admin dashboard is only accessible after login
- **Token Storage**: Auth token stored in localStorage
- **Auto-redirect**: Unauthenticated users redirected to login

## 📊 Database Status

⚠️ **Important**: The backend couldn't connect to PostgreSQL. You need to:

1. Make sure PostgreSQL is installed and running
2. Create the database:
   ```bash
   psql -U postgres -c "CREATE DATABASE flowherdb;"
   ```
3. Update the password in `/backend/FlowHerAPI/appsettings.json` if needed
4. Restart the backend

**Current Status**: The API is running but without database connection. You can still test the login UI, but product operations won't work until the database is connected.

## 🛠️ Troubleshooting

### Issue: Can't login
**Solution**: Make sure the backend API is running on port 5230

### Issue: Products not loading
**Solution**: Check that PostgreSQL is running and the database is created

### Issue: Images not showing
**Solution**: Make sure images are uploaded via the API and the backend static files are served correctly

### Issue: "Network Error" on login
**Solution**:
1. Check backend is running: http://localhost:5230/swagger
2. Check CORS is configured correctly in the backend
3. Make sure both frontend and backend are on the correct ports

## 📝 API Endpoints (for reference)

### Authentication
- `POST /api/auth/login` - Login

### Products (Public)
- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get product by ID

### Products (Admin - Requires JWT)
- `POST /api/products` - Create product
- `PUT /api/products/{id}` - Update product
- `DELETE /api/products/{id}` - Delete product
- `POST /api/products/{id}/images` - Upload image
- `DELETE /api/products/{productId}/images/{imageId}` - Delete image

## 🎨 UI Features

- ✅ Responsive design (works on mobile and desktop)
- ✅ Beautiful admin interface with FlowHer brand colors
- ✅ Modal forms for adding/editing products
- ✅ Real-time product grid updates
- ✅ Confirmation dialogs for delete operations
- ✅ Loading states and error handling
- ✅ Form validation
- ✅ Dynamic combo and quantity options

## 📱 Mobile Access

To access from your phone:
- Make sure your phone is on the same WiFi network
- Open: http://192.168.0.5:5173/admin/login
- Login with the same credentials

## 🎯 Next Steps

1. **Fix PostgreSQL connection** to enable full functionality
2. **Add image upload UI** to the admin dashboard
3. **Test adding products** with all options
4. **View products** on the customer-facing store at http://localhost:5173/

Enjoy managing your FlowHer products! 🌸
