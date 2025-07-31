import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Filter,
  Upload,
  Save,
  X,
  Package,
  Star,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  category: string;
  subcategory: string;
  unit: string;
  stock: number;
  image: string;
  images: string[];
  organic: boolean;
  featured: boolean;
  rating: number;
  reviews: number;
  status: "active" | "inactive" | "out_of_stock";
  tags: string[];
  sku: string;
  barcode: string;
  supplier: string;
  minStock: number;
  maxStock: number;
  createdAt: string;
  updatedAt: string;
}

const initialProducts: Product[] = [
  {
    id: "1",
    name: "Fresh Whole Milk",
    description:
      "Premium quality fresh whole milk from local dairy farms. Rich in calcium and vitamins.",
    price: 65,
    originalPrice: 75,
    category: "dairy",
    subcategory: "milk",
    unit: "1L",
    stock: 45,
    image: "/placeholder.svg",
    images: ["/placeholder.svg"],
    organic: true,
    featured: true,
    rating: 4.8,
    reviews: 124,
    status: "active",
    tags: ["fresh", "organic", "local"],
    sku: "FWM001",
    barcode: "1234567890123",
    supplier: "Local Dairy Co.",
    minStock: 10,
    maxStock: 100,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-20",
  },
  {
    id: "2",
    name: "Greek Yogurt",
    description:
      "Creamy and nutritious Greek yogurt made from organic milk. High protein content.",
    price: 120,
    originalPrice: 140,
    category: "dairy",
    subcategory: "yogurt",
    unit: "500g",
    stock: 23,
    image: "/placeholder.svg",
    images: ["/placeholder.svg"],
    organic: true,
    featured: false,
    rating: 4.9,
    reviews: 89,
    status: "active",
    tags: ["greek", "protein", "organic"],
    sku: "GY001",
    barcode: "1234567890124",
    supplier: "Organic Foods Ltd.",
    minStock: 15,
    maxStock: 80,
    createdAt: "2024-01-10",
    updatedAt: "2024-01-18",
  },
  {
    
    id: "3",
    name: "Farm Fresh Bananas",
    description:
      "Sweet and fresh bananas directly from local farms. Perfect for smoothies and snacks.",
    price: 45,
    originalPrice: 55,
    category: "fruits",
    subcategory: "fresh-fruits",
    unit: "1 Dozen",
    stock: 5,
    image: "/placeholder.svg",
    images: ["/placeholder.svg"],
    organic: true,
    featured: true,
    rating: 4.6,
    reviews: 67,
    status: "active",
    tags: ["fresh", "organic", "tropical"],
    sku: "FFB001",
    barcode: "1234567890125",
    supplier: "Farm Direct",
    minStock: 20,
    maxStock: 200,
    createdAt: "2024-01-12",
    updatedAt: "2024-01-19",
  },
];

export default function ProductManagement() {
  const [products, setProducts] = React.useState<Product[]>(initialProducts);
  const [filteredProducts, setFilteredProducts] =
    React.useState<Product[]>(initialProducts);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("all");
  const [selectedStatus, setSelectedStatus] = React.useState("all");
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [editingProduct, setEditingProduct] = React.useState<Product | null>(
    null,
  );
  const [selectedProducts, setSelectedProducts] = React.useState<string[]>([]);

  const categories = [
    { id: "dairy", name: "Dairy & Milk" },
    { id: "fruits", name: "Fruits & Vegetables" },
    { id: "bakery", name: "Bakery" },
    { id: "beverages", name: "Beverages" },
    { id: "snacks", name: "Snacks" },
    { id: "household", name: "Household" },
  ];

  const subcategories = {
    dairy: ["milk", "yogurt", "cheese", "butter", "cream"],
    fruits: ["fresh-fruits", "vegetables", "organic", "exotic"],
    bakery: ["bread", "cakes", "cookies", "pastries"],
    beverages: ["soft-drinks", "juices", "tea", "coffee"],
    snacks: ["chips", "nuts", "chocolates", "biscuits"],
    household: ["cleaning", "detergents", "paper-products"],
  };

  React.useEffect(() => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase()),
          ),
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory,
      );
    }

    if (selectedStatus !== "all") {
      filtered = filtered.filter(
        (product) => product.status === selectedStatus,
      );
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory, selectedStatus]);

  const handleBulkAction = (action: string) => {
    if (selectedProducts.length === 0) return;

    switch (action) {
      case "activate":
        setProducts((prev) =>
          prev.map((p) =>
            selectedProducts.includes(p.id)
              ? { ...p, status: "active" as const }
              : p,
          ),
        );
        break;
      case "deactivate":
        setProducts((prev) =>
          prev.map((p) =>
            selectedProducts.includes(p.id)
              ? { ...p, status: "inactive" as const }
              : p,
          ),
        );
        break;
      case "delete":
        setProducts((prev) =>
          prev.filter((p) => !selectedProducts.includes(p.id)),
        );
        break;
    }
    setSelectedProducts([]);
  };

  const getStockStatus = (product: Product) => {
    if (product.stock === 0)
      return {
        status: "out",
        color: "bg-red-100 text-red-700",
        text: "Out of Stock",
      };
    if (product.stock <= product.minStock)
      return {
        status: "low",
        color: "bg-orange-100 text-orange-700",
        text: "Low Stock",
      };
    return {
      status: "good",
      color: "bg-green-100 text-green-700",
      text: "In Stock",
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Product Management
          </h1>
          <p className="text-gray-600">
            Manage your inventory and product catalog
          </p>
        </div>
        <Button
          onClick={() => setShowAddForm(true)}
          className="bg-fresh-600 hover:bg-fresh-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search products, SKU, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="out_of_stock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              className="border-fresh-300 text-fresh-600"
            >
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedProducts.length > 0 && (
        <Card className="border-fresh-200 bg-fresh-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-fresh-700">
                  {selectedProducts.length} products selected
                </span>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleBulkAction("activate")}
                    className="border-fresh-300 text-fresh-600"
                  >
                    Activate
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleBulkAction("deactivate")}
                    className="border-orange-300 text-orange-600"
                  >
                    Deactivate
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleBulkAction("delete")}
                    className="border-red-300 text-red-600"
                  >
                    Delete
                  </Button>
                </div>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setSelectedProducts([])}
                className="text-gray-500"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Products ({filteredProducts.length})</span>
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  if (selectedProducts.length === filteredProducts.length) {
                    setSelectedProducts([]);
                  } else {
                    setSelectedProducts(filteredProducts.map((p) => p.id));
                  }
                }}
              >
                {selectedProducts.length === filteredProducts.length
                  ? "Deselect All"
                  : "Select All"}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left p-4 font-medium text-gray-900">
                    <Checkbox
                      checked={
                        selectedProducts.length === filteredProducts.length &&
                        filteredProducts.length > 0
                      }
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedProducts(
                            filteredProducts.map((p) => p.id),
                          );
                        } else {
                          setSelectedProducts([]);
                        }
                      }}
                    />
                  </th>
                  <th className="text-left p-4 font-medium text-gray-900">
                    Product
                  </th>
                  <th className="text-left p-4 font-medium text-gray-900">
                    SKU
                  </th>
                  <th className="text-left p-4 font-medium text-gray-900">
                    Category
                  </th>
                  <th className="text-left p-4 font-medium text-gray-900">
                    Price
                  </th>
                  <th className="text-left p-4 font-medium text-gray-900">
                    Stock
                  </th>
                  <th className="text-left p-4 font-medium text-gray-900">
                    Status
                  </th>
                  <th className="text-left p-4 font-medium text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProducts.map((product) => {
                  const stockStatus = getStockStatus(product);
                  const isSelected = selectedProducts.includes(product.id);

                  return (
                    <tr
                      key={product.id}
                      className={cn(
                        "hover:bg-gray-50",
                        isSelected && "bg-fresh-50",
                      )}
                    >
                      <td className="p-4">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedProducts((prev) => [
                                ...prev,
                                product.id,
                              ]);
                            } else {
                              setSelectedProducts((prev) =>
                                prev.filter((id) => id !== product.id),
                              );
                            }
                          }}
                        />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-12 h-12 rounded-lg object-cover bg-gray-100"
                          />
                          <div>
                            <p className="font-medium text-gray-900">
                              {product.name}
                            </p>
                            <div className="flex items-center space-x-2 mt-1">
                              {product.organic && (
                                <Badge
                                  variant="outline"
                                  className="text-xs bg-green-50 text-green-700 border-green-200"
                                >
                                  Organic
                                </Badge>
                              )}
                              {product.featured && (
                                <Badge
                                  variant="outline"
                                  className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200"
                                >
                                  <Star className="w-3 h-3 mr-1" />
                                  Featured
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-gray-900 font-mono text-sm">
                        {product.sku}
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="text-gray-900">
                            {
                              categories.find((c) => c.id === product.category)
                                ?.name
                            }
                          </p>
                          <p className="text-sm text-gray-500 capitalize">
                            {product.subcategory.replace("-", " ")}
                          </p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="text-gray-900 font-semibold">
                            ₹{product.price}
                          </p>
                          {product.originalPrice > product.price && (
                            <p className="text-sm text-gray-500 line-through">
                              ₹{product.originalPrice}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="text-gray-900">
                            {product.stock} {product.unit}
                          </p>
                          <Badge
                            className={cn("text-xs mt-1", stockStatus.color)}
                          >
                            {stockStatus.text}
                          </Badge>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge
                          className={cn(
                            "text-xs",
                            product.status === "active" &&
                              "bg-green-100 text-green-700",
                            product.status === "inactive" &&
                              "bg-gray-100 text-gray-700",
                            product.status === "out_of_stock" &&
                              "bg-red-100 text-red-700",
                          )}
                        >
                          {product.status.replace("_", " ").toUpperCase()}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setEditingProduct(product)}
                            className="text-gray-600 hover:text-fresh-600"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-gray-600 hover:text-blue-600"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              setProducts((prev) =>
                                prev.filter((p) => p.id !== product.id),
                              )
                            }
                            className="text-gray-600 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Product Modal would go here */}
      {(showAddForm || editingProduct) && (
        <ProductFormModal
          product={editingProduct}
          categories={categories}
          subcategories={subcategories}
          onClose={() => {
            setShowAddForm(false);
            setEditingProduct(null);
          }}
          onSave={(productData) => {
            if (editingProduct) {
              setProducts((prev) =>
                prev.map((p) =>
                  p.id === editingProduct.id
                    ? {
                        ...p,
                        ...productData,
                        updatedAt: new Date().toISOString().split("T")[0],
                      }
                    : p,
                ),
              );
            } else {
              const newProduct: Product = {
                name: productData.name || "",
                description: productData.description || "",
                price: productData.price || 0,
                originalPrice: productData.originalPrice || 0,
                category: productData.category || "",
                subcategory: productData.subcategory || "",
                unit: productData.unit || "",
                stock: productData.stock || 0,
                image: productData.image || "/placeholder.svg",
                images: productData.images || ["/placeholder.svg"],
                organic: productData.organic || false,
                featured: productData.featured || false,
                status: productData.status || "active",
                tags: productData.tags || [],
                sku: productData.sku || "",
                barcode: productData.barcode || "",
                supplier: productData.supplier || "",
                minStock: productData.minStock || 0,
                maxStock: productData.maxStock || 0,
                id: Date.now().toString(),
                createdAt: new Date().toISOString().split("T")[0],
                updatedAt: new Date().toISOString().split("T")[0],
                rating: 0,
                reviews: 0,
              };
              setProducts((prev) => [...prev, newProduct]);
            }
            setShowAddForm(false);
            setEditingProduct(null);
          }}
        />
      )}
    </div>
  );
}

function ProductFormModal({
  product,
  categories,
  subcategories,
  onClose,
  onSave,
}: {
  product: Product | null;
  categories: { id: string; name: string }[];
  subcategories: { [key: string]: string[] };
  onClose: () => void;
  onSave: (product: Partial<Product>) => void;
}) {
  const [formData, setFormData] = React.useState<Partial<Product>>(
    product || {
      name: "",
      description: "",
      price: 0,
      originalPrice: 0,
      category: "",
      subcategory: "",
      unit: "",
      stock: 0,
      image: "/placeholder.svg",
      images: ["/placeholder.svg"],
      organic: false,
      featured: false,
      status: "active",
      tags: [],
      sku: "",
      barcode: "",
      supplier: "",
      minStock: 0,
      maxStock: 0,
    },
  );

  const [errors, setErrors] = React.useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name) newErrors.name = "Product name is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.sku) newErrors.sku = "SKU is required";
    if (!formData.price || formData.price <= 0)
      newErrors.price = "Valid price is required";
    if (!formData.stock || formData.stock < 0)
      newErrors.stock = "Valid stock quantity is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {product ? "Edit Product" : "Add New Product"}
            </h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                Basic Information
              </h3>

              <div>
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-sm text-red-600 mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sku">SKU *</Label>
                  <Input
                    id="sku"
                    value={formData.sku}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, sku: e.target.value }))
                    }
                    className={errors.sku ? "border-red-500" : ""}
                  />
                  {errors.sku && (
                    <p className="text-sm text-red-600 mt-1">{errors.sku}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="barcode">Barcode</Label>
                  <Input
                    id="barcode"
                    value={formData.barcode}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        barcode: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            </div>

            {/* Category & Pricing */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                Category & Pricing
              </h3>

              <div>
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      category: value,
                      subcategory: "",
                    }))
                  }
                >
                  <SelectTrigger
                    className={errors.category ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-sm text-red-600 mt-1">{errors.category}</p>
                )}
              </div>

              {formData.category && (
                <div>
                  <Label htmlFor="subcategory">Subcategory</Label>
                  <Select
                    value={formData.subcategory}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, subcategory: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select subcategory" />
                    </SelectTrigger>
                    <SelectContent>
                      {subcategories[formData.category]?.map((sub) => (
                        <SelectItem key={sub} value={sub}>
                          {sub
                            .replace("-", " ")
                            .replace(/\b\w/g, (l) => l.toUpperCase())}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Selling Price (₹) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        price: parseFloat(e.target.value) || 0,
                      }))
                    }
                    className={errors.price ? "border-red-500" : ""}
                  />
                  {errors.price && (
                    <p className="text-sm text-red-600 mt-1">{errors.price}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="originalPrice">Original Price (₹)</Label>
                  <Input
                    id="originalPrice"
                    type="number"
                    step="0.01"
                    value={formData.originalPrice}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        originalPrice: parseFloat(e.target.value) || 0,
                      }))
                    }
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="unit">Unit</Label>
                <Input
                  id="unit"
                  value={formData.unit}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, unit: e.target.value }))
                  }
                  placeholder="e.g., 1L, 500g, 1 piece"
                />
              </div>
            </div>
          </div>

          {/* Inventory & Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Inventory</h3>

              <div>
                <Label htmlFor="stock">Current Stock *</Label>
                <Input
                  id="stock"
                  type="number"
                  value={formData.stock}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      stock: parseInt(e.target.value) || 0,
                    }))
                  }
                  className={errors.stock ? "border-red-500" : ""}
                />
                {errors.stock && (
                  <p className="text-sm text-red-600 mt-1">{errors.stock}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="minStock">Min Stock Alert</Label>
                  <Input
                    id="minStock"
                    type="number"
                    value={formData.minStock}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        minStock: parseInt(e.target.value) || 0,
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="maxStock">Max Stock</Label>
                  <Input
                    id="maxStock"
                    type="number"
                    value={formData.maxStock}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        maxStock: parseInt(e.target.value) || 0,
                      }))
                    }
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="supplier">Supplier</Label>
                <Input
                  id="supplier"
                  value={formData.supplier}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      supplier: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Settings</h3>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, status: value as any }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="organic"
                    checked={formData.organic}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, organic: !!checked }))
                    }
                  />
                  <Label htmlFor="organic">Organic Product</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, featured: !!checked }))
                    }
                  />
                  <Label htmlFor="featured">Featured Product</Label>
                </div>
              </div>

              <div>
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input
                  id="tags"
                  value={formData.tags?.join(", ")}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      tags: e.target.value
                        .split(",")
                        .map((tag) => tag.trim())
                        .filter(Boolean),
                    }))
                  }
                  placeholder="fresh, organic, local"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-fresh-600 hover:bg-fresh-700">
              <Save className="w-4 h-4 mr-2" />
              {product ? "Update Product" : "Add Product"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
