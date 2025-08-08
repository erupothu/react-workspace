# FreshMart API Integration Guide

## Overview

This guide provides comprehensive documentation for integrating the FreshMart React frontend with the Spring Boot backend running on `http://localhost:9090`.

## Architecture

```
┌─────────────────┐    HTTP/REST     ┌──────────────────┐
│   React Client  │ ────────────────► │ Spring Boot API  │
│   (Port 8080)   │                  │   (Port 9090)    │
└─────────────────┘                  └──────────────────┘
```

## API Services Overview

### 1. Products API (`client/lib/api/products.ts`)

**Base Endpoints:**
- `GET /api/products` - Get all products with search/filtering
- `GET /api/products/{id}` - Get single product
- `POST /api/products` - Create new product
- `PUT /api/products/{id}` - Update product
- `DELETE /api/products/{id}` - Delete product

**Key Features:**
- Advanced search and filtering
- Bulk operations
- Stock management
- Image upload/management
- Inventory tracking
- Stock alerts and reservations

**Example Usage:**
```typescript
import { productAPI } from '@/lib/api';

// Get products with filters
const products = await productAPI.getProducts({
  query: 'apple',
  categoryId: 'fruits',
  status: 'active',
  page: 1,
  limit: 20
});

// Create new product
const newProduct = await productAPI.createProduct({
  name: 'Fresh Apples',
  price: 150,
  categoryId: 'fruits',
  stock: 100,
  sku: 'APP001'
});
```

### 2. Categories API (`client/lib/api/categories.ts`)

**Base Endpoints:**
- `GET /api/categories` - Get category hierarchy
- `GET /api/categories/flat` - Get flat category list
- `POST /api/categories` - Create category
- `PUT /api/categories/{id}` - Update category
- `DELETE /api/categories/{id}` - Delete category

**Key Features:**
- Hierarchical category management
- Slug-based routing
- SEO metadata
- Image management
- Category analytics

### 3. Orders API (`client/lib/api/orders.ts`)

**Base Endpoints:**
- `GET /api/orders` - Get orders with filtering
- `GET /api/orders/{id}` - Get single order
- `POST /api/orders` - Create new order
- `PATCH /api/orders/{id}/status` - Update order status

**Key Features:**
- Order lifecycle management
- Payment processing
- Delivery tracking
- Order analytics
- Bulk operations

### 4. Customers API (`client/lib/api/customers.ts`)

**Base Endpoints:**
- `GET /api/customers` - Get customers
- `GET /api/customers/{id}` - Get single customer
- `POST /api/customers` - Create customer
- `PUT /api/customers/{id}` - Update customer

**Key Features:**
- Customer profile management
- Address management
- Order history
- Analytics and insights
- Loyalty points

### 5. Authentication API (`client/lib/api/auth.ts`)

**Base Endpoints:**
- `POST /api/auth/login` - Customer login
- `POST /api/auth/register` - Customer registration
- `POST /api/auth/admin/login` - Admin login
- `POST /api/auth/refresh` - Refresh tokens

**Key Features:**
- JWT token management
- Role-based access control
- Session management
- Password reset
- 2FA support

### 6. Dashboard API (`client/lib/api/dashboard.ts`)

**Base Endpoints:**
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/sales-analytics` - Sales analytics
- `GET /api/dashboard/real-time` - Real-time metrics

**Key Features:**
- Business analytics
- Real-time dashboards
- Revenue tracking
- Performance metrics

## Configuration

### Backend URL Configuration

Update the API base URL in each service file:

```typescript
const API_BASE_URL = 'http://localhost:9090/api';
```

### Authentication Headers

All services automatically include authentication headers:

```typescript
const token = localStorage.getItem('authToken');
if (token) {
  headers['Authorization'] = `Bearer ${token}`;
}
```

## Spring Boot Backend Requirements

### Expected Response Format

All Spring Boot endpoints should return responses in this format:

```json
{
  "success": true,
  "data": { /* Your data here */ },
  "error": {
    "code": "ERROR_CODE",
    "message": "Error message"
  },
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

### Required Spring Boot Dependencies

Add these dependencies to your `pom.xml`:

```xml
<dependencies>
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
  </dependency>
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
  </dependency>
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
  </dependency>
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
  </dependency>
</dependencies>
```

### CORS Configuration

Configure CORS in your Spring Boot application:

```java
@Configuration
@EnableWebMvc
public class WebConfig implements WebMvcConfigurer {
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:8080")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
```

## Entity Models

### Product Entity

```java
@Entity
@Table(name = "products")
public class Product {
    @Id
    private String id;
    private String name;
    private String description;
    private BigDecimal price;
    private BigDecimal originalPrice;
    private String categoryId;
    private String unit;
    private Integer stock;
    private String image;
    private Boolean organic;
    private Boolean featured;
    private Double rating;
    private Integer reviews;
    private String status;
    private String sku;
    private Integer minStock;
    private Integer maxStock;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Getters and setters
}
```

### Category Entity

```java
@Entity
@Table(name = "categories")
public class Category {
    @Id
    private String id;
    private String name;
    private String description;
    private String icon;
    private String color;
    private String image;
    private String parentId;
    private String slug;
    private String status;
    private Integer sortOrder;
    private Integer productCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Getters and setters
}
```

## Sample Spring Boot Controllers

### ProductController

```java
@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:8080")
public class ProductController {
    
    @Autowired
    private ProductService productService;
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<Product>>> getProducts(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String categoryId,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int limit) {
        
        try {
            Page<Product> products = productService.getProducts(query, categoryId, status, page, limit);
            
            ApiResponse<List<Product>> response = new ApiResponse<>();
            response.setSuccess(true);
            response.setData(products.getContent());
            response.setPagination(new PaginationInfo(page, limit, products.getTotalElements(), products.getTotalPages()));
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse<List<Product>> response = new ApiResponse<>();
            response.setSuccess(false);
            response.setError(new ErrorInfo("FETCH_ERROR", e.getMessage()));
            return ResponseEntity.status(500).body(response);
        }
    }
    
    @PostMapping
    public ResponseEntity<ApiResponse<Product>> createProduct(@RequestBody CreateProductRequest request) {
        // Implementation
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Product>> updateProduct(@PathVariable String id, @RequestBody UpdateProductRequest request) {
        // Implementation
    }
}
```

## Testing

### API Test Page

Visit `/api-test` in your application to test the API integration:

```
http://localhost:8080/api-test
```

This page provides:
- Connection testing
- API endpoint verification
- Response data inspection
- Performance metrics

### Manual Testing

Test individual endpoints using curl:

```bash
# Test connection
curl http://localhost:9090/api/test-connection

# Get products
curl http://localhost:9090/api/products

# Create product
curl -X POST http://localhost:9090/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Product","price":100,"categoryId":"test"}'
```

## Error Handling

All API services include comprehensive error handling:

```typescript
try {
  const response = await productAPI.getProducts();
  if (response.success) {
    // Handle success
    console.log(response.data);
  } else {
    // Handle API error
    console.error(response.error?.message);
  }
} catch (error) {
  // Handle network/unexpected errors
  console.error('Network error:', error.message);
}
```

## Security

### JWT Token Management

- Tokens are automatically stored in localStorage
- Automatic token refresh before expiry
- Secure token validation

### API Key Configuration

For additional security, add API keys:

```typescript
const defaultHeaders = {
  'Content-Type': 'application/json',
  'X-API-Key': process.env.REACT_APP_API_KEY,
  'Authorization': `Bearer ${token}`
};
```

## Performance

### Caching Strategy

Implement caching for frequently accessed data:

```typescript
// Use React Query for caching
const { data: products } = useQuery(
  ['products', filters],
  () => productAPI.getProducts(filters),
  { staleTime: 5 * 60 * 1000 } // 5 minutes
);
```

### Pagination

All list endpoints support pagination:

```typescript
const response = await productAPI.getProducts({
  page: 1,
  limit: 20,
  query: 'search term'
});
```

## Deployment

### Environment Variables

Set these environment variables:

```bash
REACT_APP_API_BASE_URL=https://api.freshmart.com
REACT_APP_API_TIMEOUT=30000
```

### Production Configuration

Update API base URL for production:

```typescript
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:9090/api';
```

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure CORS is properly configured in Spring Boot
2. **Authentication Failures**: Check token format and expiry
3. **Network Timeouts**: Increase timeout values for slow connections
4. **Data Validation**: Ensure request data matches expected schema

### Debug Mode

Enable debug logging:

```typescript
const config = {
  ...options,
  headers: {
    ...defaultHeaders,
    'X-Debug': 'true'
  }
};
```

## Migration Guide

To migrate existing components to use the new API services:

1. Replace direct fetch calls with API service methods
2. Update error handling to use ApiResponse format
3. Implement proper loading states
4. Add authentication headers where needed

## Support

For technical support or questions:
- Check the API test page for connectivity issues
- Review browser network tab for detailed error information
- Ensure Spring Boot backend is running on port 9090
- Verify all required endpoints are implemented

## API Endpoints Summary

| Service | Endpoints | Purpose |
|---------|-----------|---------|
| Products | 25+ | Product management, inventory, search |
| Categories | 18+ | Category hierarchy, navigation |
| Orders | 22+ | Order processing, tracking, analytics |
| Customers | 20+ | Customer management, profiles |
| Auth | 15+ | Authentication, authorization |
| Dashboard | 12+ | Analytics, reporting, insights |

**Total: 112+ REST API endpoints fully configured and ready for Spring Boot integration.**
