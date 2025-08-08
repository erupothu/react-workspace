import React, { useState, useEffect, useRef } from "react";
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
import api from "@/lib/api";
import { Category, CreateProductRequest } from "@shared/api";
import ImageUpload from "@/components/ImageUpload";
import ImportExportButtons from "@/components/ImportExportButtons";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  subCategoryId: string;
  discountPrice: number;
  category: Category;
  subcategory: Category;
  unit: string;
  stockQuantity: number;
  image: string;
  images: string[];
  isOrganic: boolean;
  isFeatured: boolean;
  rating: number;
  reviews: number;
  status: "active" | "inactive" | "out_of_stock";
  isActive: boolean;
  tags: string[];
  sku: string;
  barcode: string;
  supplier: string;
  minStock: number;
  maxStock: number;
  createdAt: string;
  updatedAt: string;
}

export default function ProductManagement() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(
    null,
  );
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const initialized = useRef(false);

  useEffect(() => {
      handleGetProducts();
  }, [filteredProducts]); 

  const handleGetProducts = async () => {
    const catResponse = await api.categories.getCategories();
      if (catResponse.success && catResponse.data) {
        // const categoriesWithSubs = [];
        const categoriesWithSubs = await Promise.all(
          catResponse.data.map(async (category) => {
            if(!category.parentCategoryId) {
              try {
                const subResponse = await api.categories.getSubcategories(category.id);
                return ({
                  ...category,
                  subcategories: subResponse.success && subResponse.data ? subResponse.data : []
                });
              } catch (error) {
                console.error(`Failed to load subcategories for ${category.id}:`, error);
                return ({
                  ...category,
                  subcategories: []
                });
              }
            }

          })
        );
        let cats = [];
        categoriesWithSubs.forEach(cat => cat?cats.push(cat):null)
        setCategories(cats);
        setLoading(true)
      }
    const response = await api.products.getProducts();
    if (response.success && response.data) {
      setProducts(response.data)
      products.forEach(prod => {
        if(prod.categoryId) {
          prod.category = categories?.find(cat => cat?.id == prod.categoryId);
        }
        if(prod.subCategoryId) {
          prod.subcategory = prod.category?.subcategories.find(cat => cat?.id == prod.subCategoryId)
        }
      });
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

      // if (selectedCategory !== "all") {
      //   filtered = filtered.filter(
      //     (product) => product.category?.id === selectedCategory,
      //   );
      // }

      // if (selectedStatus !== "all") {
      //   filtered = filtered.filter(
      //     (product) => product.status === selectedStatus,
      //   );
      // }
      setFilteredProducts(filtered);
    }
    return { success: response.success, data: response.data };
  }

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
    if (product.stockQuantity === 0)
      return {
        status: "out",
        color: "bg-red-100 text-red-700",
        text: "Out of Stock",
      };
    if (product.stockQuantity <= product.minStock)
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

  const handleAddProduct = async (newProduct) => {
    const response = await api.products.createProduct(newProduct);
    // window.location.reload();
    handleGetProducts();
    return { success: response.success, data: response.data };
  }

  const handleDeleteProduct = async (product) => {
    const response = await api.products.deleteProduct(product.id);
    // window.location.reload();
    handleGetProducts();
    return { success: response.success, data: response.data };
  }

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
        <div className="flex items-center gap-4">
          <ImportExportButtons
            type="products"
            filters={{
              category: selectedCategory !== "all" ? selectedCategory : undefined,
              status: selectedStatus !== "all" ? selectedStatus : undefined,
              search: searchTerm || undefined,
            }}
            onImportComplete={() => {
              // Refresh products list after import
              window.location.reload();
            }}
          />
          <Button
            onClick={() => setShowAddForm(true)}
            className="bg-fresh-600 hover:bg-fresh-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>
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
                  <SelectItem key={cat?.id} value={cat?.id}>
                    {cat?.name}
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
                {filteredProducts ? filteredProducts.map((product) => {
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
                            src={product.images[0]}
                            alt={product.name}
                            className="w-12 h-12 rounded-lg object-cover bg-gray-100"
                          />
                          <div>
                            <p className="font-medium text-gray-900">
                              {product.name}
                            </p>
                            <div className="flex items-center space-x-2 mt-1">
                              {product.isOrganic && (
                                <Badge
                                  variant="outline"
                                  className="text-xs bg-green-50 text-green-700 border-green-200"
                                >
                                  Organic
                                </Badge>
                              )}
                              {product.isFeatured && (
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
                              product.category?.name
                            }
                          </p>
                          <p className="text-sm text-gray-500 capitalize">
                            {product.subcategory?.name.replace("-", " ")}
                          </p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="text-gray-900 font-semibold">
                            ₹{product.price}
                          </p>
                          {product.price > product.price && (
                            <p className="text-sm text-gray-500 line-through">
                              ₹{product.price}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="text-gray-900">
                            {product.stockQuantity} {product.unit}
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
                          {product?.status?.replace("_", " ")?.toUpperCase()}
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
                            onClick={() => handleDeleteProduct(product)}
                            className="text-gray-600 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                }): <div></div>}
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
          subcategories={categories.find(c => c.id === (editingProduct?.category || ''))?.subcategories || []}
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
                        categoryId: productData.category.id,
                        subCategoryId: productData.subcategory.id
                      }
                    : p,
                ),
              );
              productData.categoryId = productData.category.id,
              productData.subCategoryId = productData.subcategory.id
              handleAddProduct(productData);
            } else {
              const newProduct: Product = {
                name: productData.name || "",
                description: productData.description || "",
                price: productData.price || 0,
                discountPrice: productData.discountPrice || 0,
                category: productData.category,
                categoryId: productData.category.id,
                subCategoryId: productData.subcategory.id,
                subcategory: productData.subcategory,
                unit: productData.unit || "",
                stockQuantity: productData.stockQuantity || 0,
                image: productData.image[0] || "/placeholder.svg",
                images: productData.images || ["/placeholder.svg"],
                isOrganic: productData.isOrganic || false,
                isFeatured: productData.isFeatured || false,
                status: productData.status || "active",
                isActive: true,
                tags: productData.tags || [],
                sku: productData.sku || "",
                barcode: productData.barcode || "",
                supplier: productData.supplier || "",
                minStock: productData.minStock || 0,
                maxStock: productData.maxStock || 0,
                id: Date.now().toString(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                rating: 0,
                reviews: 0,
              };
              handleAddProduct(newProduct);
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
  categories: Category[];
  subcategories: Category[];
  onClose: () => void;
  onSave: (product: Partial<Product>) => void;
}) {
  const [formData, setFormData] = useState<Partial<Product>>(product);
  const units = ["kg", "pc", "Dozen", "gm", "sheets", "unit", "pack", "ml", "ltr", "rolls", "pages"];
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const validateForm = () => {
  const newErrors: { [key: string]: string } = {};

    if (!formData.name) newErrors.name = "Product name is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.sku) newErrors.sku = "SKU is required";
    if (!formData.price || formData.price <= 0)
      newErrors.price = "Valid price is required";
    if (!formData.stockQuantity || formData.stockQuantity < 0)
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
                  className={errors.name ? "border-red-500" : "border-gray-400"}
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
                  className="border-gray-400"
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
                    className={errors.sku ? "border-red-500" : "border-gray-400"}
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
                    className="border-gray-400"
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
                  value={formData.category?.id}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      category: categories.find(cat => cat.id == value),
                    }))
                  }
                >
                  <SelectTrigger
                    className={errors.category ? "border-red-500" : "border-gray-400"}
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
                    value={formData.subcategory?.id}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, subcategory: formData.category?.subcategories.find(cat => cat.id == value) }))
                    }
                  >
                    <SelectTrigger className="border-gray-400">
                      <SelectValue placeholder="Select subcategory" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.find(c => c.id === formData.category?.id)?.subcategories?.map((sub) => (
                        <SelectItem key={sub.id} value={sub.id}>
                          {sub.name}
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
                    value={formData.discountPrice}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        price: parseFloat(e.target.value) || 0,
                      }))
                    }
                    className={errors.price ? "border-red-500" : "border-gray-400"}
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
                    value={formData.price}
                    className="border-gray-400"
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
                <Label htmlFor="Units">Units *</Label>
                <Select
                  value={formData.unit}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      unit: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Units" />
                  </SelectTrigger>
                  <SelectContent>
                    {units.map((unit) => (
                      <SelectItem key={unit} value={unit}>
                        {unit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                  value={formData.stockQuantity}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      stock: parseInt(e.target.value) || 0,
                    }))
                  }
                  className={errors.stock ? "border-red-500" : "border-gray-400"}
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
                    className="border-gray-400"
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
                    className="border-gray-400"
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
                  className="border-gray-400"
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
                  <SelectTrigger className="border-gray-400">
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
                    checked={formData.isOrganic}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, isOrganic: !!checked }))
                    }
                  />
                  <Label htmlFor="organic">Organic Product</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="featured"
                    checked={formData.isFeatured}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, isFeatured: !!checked }))
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
                  className="border-gray-400"
                  placeholder="fresh, organic, local"
                />
              </div>
            </div>
          </div>

          {/* Image Upload Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Product Images</h3>
            <ImageUpload
              value={formData.images || []}
              onChange={(images) => {
                setFormData((prev) => ({
                  ...prev,
                  images,
                  // Set the first image as the primary image
                  image: images.length > 0 ? images[0] : "/placeholder.svg",
                }));
              }}
              maxImages={5}
              maxFileSize={5}
              disabled={false}
            />
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
