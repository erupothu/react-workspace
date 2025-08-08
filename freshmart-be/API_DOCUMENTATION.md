# FreshMart REST API Documentation

## Base URL
```
http://localhost:9090
```

## API Endpoints

### Products API
- **GET** `/api/products` - Get all active products
- **GET** `/api/products/{id}` - Get product by ID
- **GET** `/api/products/sku/{sku}` - Get product by SKU
- **GET** `/api/products/category/{categoryId}` - Get products by category
- **GET** `/api/products/brand/{brand}` - Get products by brand
- **GET** `/api/products/featured` - Get featured products
- **GET** `/api/products/organic` - Get organic products
- **GET** `/api/products/search?query={query}` - Search products
- **GET** `/api/products/low-stock?threshold={threshold}` - Get low stock products
- **POST** `/api/products` - Create new product
- **PUT** `/api/products/{id}` - Update product
- **DELETE** `/api/products/{id}` - Delete product
- **PUT** `/api/products/{id}/activate` - Activate product
- **PUT** `/api/products/{id}/deactivate` - Deactivate product
- **PUT** `/api/products/{id}/stock?quantity={quantity}` - Update stock

### Categories API
- **GET** `/api/categories` - Get all active categories
- **GET** `/api/categories/{id}` - Get category by ID
- **GET** `/api/categories/slug/{slug}` - Get category by slug
- **GET** `/api/categories/parent` - Get parent categories
- **GET** `/api/categories/{parentId}/subcategories` - Get subcategories
- **GET** `/api/categories/search?query={query}` - Search categories
- **POST** `/api/categories` - Create new category
- **PUT** `/api/categories/{id}` - Update category
- **DELETE** `/api/categories/{id}` - Delete category
- **PUT** `/api/categories/{id}/activate` - Activate category
- **PUT** `/api/categories/{id}/deactivate` - Deactivate category

### Customers API
- **GET** `/api/customers` - Get all customers
- **GET** `/api/customers/{id}` - Get customer by ID
- **GET** `/api/customers/email/{email}` - Get customer by email
- **GET** `/api/customers/phone/{phone}` - Get customer by phone
- **POST** `/api/customers/register` - Register new customer
- **POST** `/api/customers/login?email={email}&password={password}` - Customer login
- **PUT** `/api/customers/{id}` - Update customer
- **PUT** `/api/customers/{id}/activate` - Activate customer
- **PUT** `/api/customers/{id}/deactivate` - Deactivate customer
- **PUT** `/api/customers/{id}/verify-email` - Verify customer email
- **PUT** `/api/customers/{id}/verify-phone` - Verify customer phone
- **PUT** `/api/customers/{id}/change-password?oldPassword={old}&newPassword={new}` - Change password
- **DELETE** `/api/customers/{id}` - Delete customer

### Orders API
- **GET** `/api/orders` - Get all orders
- **GET** `/api/orders/{id}` - Get order by ID
- **GET** `/api/orders/order-number/{orderNumber}` - Get order by order number
- **GET** `/api/orders/customer/{customerId}` - Get orders by customer
- **GET** `/api/orders/status/{status}` - Get orders by status
- **GET** `/api/orders/payment-status/{paymentStatus}` - Get orders by payment status
- **GET** `/api/orders/customer/{customerId}/status/{status}` - Get orders by customer and status
- **GET** `/api/orders/date-range?startDate={start}&endDate={end}` - Get orders by date range
- **GET** `/api/orders/stats/count-by-status/{status}` - Get order count by status
- **GET** `/api/orders/stats/count-by-date-range?startDate={start}&endDate={end}` - Get order count by date range
- **POST** `/api/orders` - Create new order
- **POST** `/api/orders/customer/{customerId}/from-cart` - Create order from cart
- **PUT** `/api/orders/{id}` - Update order
- **PUT** `/api/orders/{id}/status?status={status}` - Update order status
- **PUT** `/api/orders/{id}/payment-status?paymentStatus={status}` - Update payment status
- **PUT** `/api/orders/{id}/confirm` - Confirm order
- **PUT** `/api/orders/{id}/ship?trackingNumber={tracking}` - Ship order
- **PUT** `/api/orders/{id}/deliver` - Deliver order
- **PUT** `/api/orders/{id}/cancel?reason={reason}` - Cancel order
- **DELETE** `/api/orders/{id}` - Delete order

### Cart API
- **GET** `/api/cart/customer/{customerId}` - Get customer cart
- **POST** `/api/cart/customer/{customerId}/items` - Add item to cart
- **PUT** `/api/cart/customer/{customerId}/items/{productId}?quantity={quantity}` - Update cart item
- **DELETE** `/api/cart/customer/{customerId}/items/{productId}` - Remove item from cart
- **DELETE** `/api/cart/customer/{customerId}` - Clear cart
- **POST** `/api/cart/customer/{customerId}/merge` - Merge guest cart with customer cart

### Addresses API
- **GET** `/api/addresses/{id}` - Get address by ID
- **GET** `/api/addresses/customer/{customerId}` - Get customer addresses
- **GET** `/api/addresses/customer/{customerId}/default` - Get default address
- **GET** `/api/addresses/customer/{customerId}/type/{type}` - Get addresses by type
- **POST** `/api/addresses` - Create new address
- **PUT** `/api/addresses/{id}` - Update address
- **PUT** `/api/addresses/{id}/set-default` - Set as default address
- **DELETE** `/api/addresses/{id}` - Delete address

### Admin Users API
- **POST** `/create-admin-user` - Create admin user

### Images API
- **POST** `/api/images/upload` - Upload image with category and metadata
- **GET** `/api/images/{imageId}?size={size}` - Get image by ID with optional size (thumbnail|medium|large|original)
- **GET** `/api/images/{imageId}/metadata` - Get image metadata by ID
- **GET** `/api/images/category/{category}?size={size}` - Get images by category with optional size filter
- **GET** `/api/images/search?keyword={keyword}` - Search images by keyword
- **GET** `/api/images/all` - Get all active images
- **GET** `/api/images/user/{userId}` - Get images uploaded by specific user
- **PUT** `/api/images/{imageId}/metadata` - Update image metadata
- **DELETE** `/api/images/{imageId}` - Delete image (soft delete)
- **GET** `/api/images/stats/category/{category}` - Get image count by category
- **POST** `/api/images/{imageId}/thumbnails` - Generate thumbnails for existing image

## Sample Request Bodies

### Create Product
```json
{
  "name": "Fresh Apples",
  "description": "Fresh red apples from the farm",
  "sku": "APPLE001",
  "price": 150.00,
  "discountPrice": 120.00,
  "stockQuantity": 100,
  "unit": "kg",
  "brand": "FreshFarm",
  "images": ["apple1.jpg", "apple2.jpg"],
  "mainImage": "apple1.jpg",
  "isOrganic": true,
  "nutritionInfo": "Rich in vitamins and fiber",
  "storageInstructions": "Store in cool, dry place"
}
```

### Create Category
```json
{
  "name": "Fruits",
  "description": "Fresh fruits collection",
  "slug": "fruits",
  "image": "fruits.jpg",
  "icon": "fruit-icon.svg",
  "sortOrder": 1
}
```

### Register Customer
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+919876543210",
  "password": "password123",
  "dateOfBirth": "1990-01-01",
  "gender": "Male"
}
```

### Create Address
```json
{
  "customerId": "customer123",
  "type": "HOME",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+919876543210",
  "addressLine1": "123 Main Street",
  "addressLine2": "Apartment 4B",
  "city": "Mumbai",
  "state": "Maharashtra",
  "zipCode": "400001",
  "landmark": "Near Central Mall",
  "isDefault": true
}
```

### Upload Image
**Form Data:**
- `file` (required) - Image file to upload
- `category` (required) - Image category (e.g., "product", "profile", "banner")
- `uploadedBy` (optional) - User ID who uploaded the image
- `description` (optional) - Image description
- `altText` (optional) - Alternative text for accessibility

**Example Response:**
```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "data": {
    "id": "64a1b2c3d4e5f6789012345",
    "fileName": "uuid-generated-name.jpg",
    "originalName": "my-image.jpg",
    "category": "product",
    "fileSize": 1024576,
    "contentType": "image/jpeg",
    "width": 1920,
    "height": 1080,
    "uploadedAt": "2025-08-02T14:30:00",
    "isActive": true
  },
  "imageUrl": "http://localhost:9090/api/images/64a1b2c3d4e5f6789012345"
}
```

## Response Status Codes
- **200** - Success
- **201** - Created
- **204** - No Content (for delete operations)
- **400** - Bad Request
- **401** - Unauthorized
- **404** - Not Found
- **500** - Internal Server Error

## Notes
- All endpoints support CORS with `origins = "*"`
- MongoDB is configured but currently using H2 database for development
- API includes comprehensive search, filtering, and pagination capabilities
- Authentication and authorization can be added as needed
- All timestamps are in ISO 8601 format
