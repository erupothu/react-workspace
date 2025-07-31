import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Plus,
  Edit,
  Trash2,
  Move,
  Eye,
  Save,
  X,
  Grid3x3,
  Package,
  ArrowUp,
  ArrowDown,
  Palette,
  Image,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  image: string;
  parentId: string | null;
  slug: string;
  status: "active" | "inactive";
  sortOrder: number;
  productCount: number;
  subcategories: Category[];
  metadata: {
    seoTitle: string;
    seoDescription: string;
    keywords: string[];
  };
  createdAt: string;
  updatedAt: string;
}

const initialCategories: Category[] = [
  {
    id: "dairy",
    name: "Dairy & Milk",
    description:
      "Fresh dairy products including milk, yogurt, cheese, and more",
    icon: "🥛",
    color: "bg-blue-100",
    image: "/placeholder.svg",
    parentId: null,
    slug: "dairy-milk",
    status: "active",
    sortOrder: 1,
    productCount: 45,
    subcategories: [
      {
        id: "milk",
        name: "Milk",
        description: "Fresh and organic milk varieties",
        icon: "🥛",
        color: "bg-blue-50",
        image: "/placeholder.svg",
        parentId: "dairy",
        slug: "milk",
        status: "active",
        sortOrder: 1,
        productCount: 12,
        subcategories: [],
        metadata: {
          seoTitle: "Fresh Milk Online",
          seoDescription: "Order fresh milk online",
          keywords: ["milk", "dairy"],
        },
        createdAt: "2024-01-15",
        updatedAt: "2024-01-20",
      },
      {
        id: "yogurt",
        name: "Yogurt",
        description: "Greek and regular yogurt options",
        icon: "🍶",
        color: "bg-blue-50",
        image: "/placeholder.svg",
        parentId: "dairy",
        slug: "yogurt",
        status: "active",
        sortOrder: 2,
        productCount: 8,
        subcategories: [],
        metadata: {
          seoTitle: "Yogurt Online",
          seoDescription: "Greek and regular yogurt",
          keywords: ["yogurt", "greek"],
        },
        createdAt: "2024-01-15",
        updatedAt: "2024-01-20",
      },
    ],
    metadata: {
      seoTitle: "Dairy Products Online - Fresh Milk & More",
      seoDescription:
        "Order fresh dairy products online including milk, yogurt, cheese and more",
      keywords: ["dairy", "milk", "yogurt", "cheese"],
    },
    createdAt: "2024-01-15",
    updatedAt: "2024-01-20",
  },
  {
    id: "fruits",
    name: "Fruits & Vegetables",
    description: "Fresh fruits and vegetables from local farms",
    icon: "🥕",
    color: "bg-green-100",
    image: "/placeholder.svg",
    parentId: null,
    slug: "fruits-vegetables",
    status: "active",
    sortOrder: 2,
    productCount: 78,
    subcategories: [
      {
        id: "fresh-fruits",
        name: "Fresh Fruits",
        description: "Seasonal and tropical fruits",
        icon: "🍎",
        color: "bg-green-50",
        image: "/placeholder.svg",
        parentId: "fruits",
        slug: "fresh-fruits",
        status: "active",
        sortOrder: 1,
        productCount: 34,
        subcategories: [],
        metadata: {
          seoTitle: "Fresh Fruits Online",
          seoDescription: "Order fresh fruits online",
          keywords: ["fruits", "fresh", "organic"],
        },
        createdAt: "2024-01-15",
        updatedAt: "2024-01-20",
      },
      {
        id: "vegetables",
        name: "Vegetables",
        description: "Fresh and organic vegetables",
        icon: "🥬",
        color: "bg-green-50",
        image: "/placeholder.svg",
        parentId: "fruits",
        slug: "vegetables",
        status: "active",
        sortOrder: 2,
        productCount: 44,
        subcategories: [],
        metadata: {
          seoTitle: "Fresh Vegetables Online",
          seoDescription: "Order fresh vegetables online",
          keywords: ["vegetables", "fresh", "organic"],
        },
        createdAt: "2024-01-15",
        updatedAt: "2024-01-20",
      },
    ],
    metadata: {
      seoTitle: "Fresh Fruits & Vegetables Online",
      seoDescription:
        "Order fresh fruits and vegetables online from local farms",
      keywords: ["fruits", "vegetables", "fresh", "organic", "local"],
    },
    createdAt: "2024-01-15",
    updatedAt: "2024-01-20",
  },
];

const colorOptions = [
  { name: "Blue", value: "bg-blue-100", text: "text-blue-700" },
  { name: "Green", value: "bg-green-100", text: "text-green-700" },
  { name: "Orange", value: "bg-orange-100", text: "text-orange-700" },
  { name: "Purple", value: "bg-purple-100", text: "text-purple-700" },
  { name: "Pink", value: "bg-pink-100", text: "text-pink-700" },
  { name: "Yellow", value: "bg-yellow-100", text: "text-yellow-700" },
  { name: "Red", value: "bg-red-100", text: "text-red-700" },
  { name: "Indigo", value: "bg-indigo-100", text: "text-indigo-700" },
];

const iconOptions = [
  "🥛",
  "🥕",
  "🍞",
  "🥤",
  "🧽",
  "🧴",
  "🍎",
  "🥬",
  "🍖",
  "🐟",
  "🥜",
  "🍯",
  "🌾",
  "🍋",
  "🫒",
  "🧊",
];

export default function CategoryManagement() {
  const [categories, setCategories] =
    React.useState<Category[]>(initialCategories);
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [editingCategory, setEditingCategory] = React.useState<Category | null>(
    null,
  );
  const [expandedCategories, setExpandedCategories] = React.useState<string[]>([
    "dairy",
    "fruits",
  ]);

  const toggleExpanded = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId],
    );
  };

  const updateCategoryOrder = (
    categoryId: string,
    direction: "up" | "down",
  ) => {
    setCategories((prev) => {
      const newCategories = [...prev];
      const index = newCategories.findIndex((cat) => cat.id === categoryId);

      if (direction === "up" && index > 0) {
        [newCategories[index], newCategories[index - 1]] = [
          newCategories[index - 1],
          newCategories[index],
        ];
        newCategories[index].sortOrder = index + 1;
        newCategories[index - 1].sortOrder = index;
      } else if (direction === "down" && index < newCategories.length - 1) {
        [newCategories[index], newCategories[index + 1]] = [
          newCategories[index + 1],
          newCategories[index],
        ];
        newCategories[index].sortOrder = index + 1;
        newCategories[index + 1].sortOrder = index + 2;
      }

      return newCategories;
    });
  };

  const deleteCategory = (categoryId: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this category? This action cannot be undone.",
      )
    ) {
      setCategories((prev) => prev.filter((cat) => cat.id !== categoryId));
    }
  };

  const getAllCategories = (cats: Category[]): Category[] => {
    const result: Category[] = [];
    cats.forEach((cat) => {
      result.push(cat);
      result.push(...getAllCategories(cat.subcategories));
    });
    return result;
  };

  const flatCategories = getAllCategories(categories);

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
            Category Management
          </h1>
          <p className="text-sm lg:text-base text-gray-600">
            Organize your product categories and subcategories
          </p>
        </div>
        <Button
          onClick={() => setShowAddForm(true)}
          className="bg-fresh-600 hover:bg-fresh-700"
          size="sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Add Category</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
        <Card>
          <CardContent className="p-3 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-medium text-gray-500">
                  Total Categories
                </p>
                <p className="text-lg lg:text-2xl font-bold text-gray-900">
                  {categories.length}
                </p>
              </div>
              <Grid3x3 className="w-6 h-6 lg:w-8 lg:h-8 text-fresh-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-medium text-gray-500">
                  Subcategories
                </p>
                <p className="text-lg lg:text-2xl font-bold text-gray-900">
                  {categories.reduce(
                    (sum, cat) => sum + cat.subcategories.length,
                    0,
                  )}
                </p>
              </div>
              <Grid3x3 className="w-6 h-6 lg:w-8 lg:h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-medium text-gray-500">
                  Total Products
                </p>
                <p className="text-lg lg:text-2xl font-bold text-gray-900">
                  {categories.reduce((sum, cat) => sum + cat.productCount, 0)}
                </p>
              </div>
              <Package className="w-6 h-6 lg:w-8 lg:h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-medium text-gray-500">
                  Active Categories
                </p>
                <p className="text-lg lg:text-2xl font-bold text-gray-900">
                  {
                    flatCategories.filter((cat) => cat.status === "active")
                      .length
                  }
                </p>
              </div>
              <Eye className="w-6 h-6 lg:w-8 lg:h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Categories Tree */}
      <Card>
        <CardHeader>
          <CardTitle>Category Hierarchy</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {categories.map((category, index) => (
              <CategoryTreeItem
                key={category.id}
                category={category}
                level={0}
                isExpanded={expandedCategories.includes(category.id)}
                onToggleExpanded={() => toggleExpanded(category.id)}
                onEdit={() => setEditingCategory(category)}
                onDelete={() => deleteCategory(category.id)}
                onMoveUp={
                  index > 0
                    ? () => updateCategoryOrder(category.id, "up")
                    : undefined
                }
                onMoveDown={
                  index < categories.length - 1
                    ? () => updateCategoryOrder(category.id, "down")
                    : undefined
                }
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Category Modal */}
      {(showAddForm || editingCategory) && (
        <CategoryFormModal
          category={editingCategory}
          categories={categories}
          onClose={() => {
            setShowAddForm(false);
            setEditingCategory(null);
          }}
          onSave={(categoryData) => {
            if (editingCategory) {
              setCategories((prev) =>
                prev.map((cat) =>
                  cat.id === editingCategory.id
                    ? {
                        ...cat,
                        ...categoryData,
                        updatedAt: new Date().toISOString().split("T")[0],
                      }
                    : cat,
                ),
              );
            } else {
              const newCategory: Category = {
                ...categoryData,
                id: categoryData.slug || Date.now().toString(),
                productCount: 0,
                subcategories: [],
                createdAt: new Date().toISOString().split("T")[0],
                updatedAt: new Date().toISOString().split("T")[0],
              } as Category;
              setCategories((prev) => [...prev, newCategory]);
            }
            setShowAddForm(false);
            setEditingCategory(null);
          }}
        />
      )}
    </div>
  );
}

function CategoryTreeItem({
  category,
  level,
  isExpanded,
  onToggleExpanded,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
}: {
  category: Category;
  level: number;
  isExpanded: boolean;
  onToggleExpanded: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}) {
  const indent = level * 24;

  return (
    <div>
      <div
        className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
        style={{ marginLeft: `${indent}px` }}
      >
        <div className="flex items-center space-x-3">
          {category.subcategories.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleExpanded}
              className="p-1 h-6 w-6"
            >
              {isExpanded ? "−" : "+"}
            </Button>
          )}

          <div
            className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center",
              category.color,
            )}
          >
            <span className="text-lg">{category.icon}</span>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h4 className="font-medium text-gray-900">{category.name}</h4>
              <Badge
                className={cn(
                  "text-xs",
                  category.status === "active"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-700",
                )}
              >
                {category.status}
              </Badge>
            </div>
            <p className="text-sm text-gray-500">
              {category.productCount} products
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {onMoveUp && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMoveUp}
              className="p-1"
            >
              <ArrowUp className="w-4 h-4" />
            </Button>
          )}
          {onMoveDown && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMoveDown}
              className="p-1"
            >
              <ArrowDown className="w-4 h-4" />
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={onEdit} className="p-1">
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="p-1 text-red-600"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {isExpanded && category.subcategories.length > 0 && (
        <div className="mt-2 space-y-2">
          {category.subcategories.map((subcat) => (
            <CategoryTreeItem
              key={subcat.id}
              category={subcat}
              level={level + 1}
              isExpanded={false}
              onToggleExpanded={() => {}}
              onEdit={() => {}}
              onDelete={() => {}}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function CategoryFormModal({
  category,
  categories,
  onClose,
  onSave,
}: {
  category: Category | null;
  categories: Category[];
  onClose: () => void;
  onSave: (category: Partial<Category>) => void;
}) {
  const [formData, setFormData] = React.useState<Partial<Category>>(
    category || {
      name: "",
      description: "",
      icon: "📦",
      color: "bg-blue-100",
      image: "/placeholder.svg",
      parentId: null,
      slug: "",
      status: "active",
      sortOrder: categories.length + 1,
      metadata: {
        seoTitle: "",
        seoDescription: "",
        keywords: [],
      },
    },
  );

  const [errors, setErrors] = React.useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name) newErrors.name = "Category name is required";
    if (!formData.slug) newErrors.slug = "URL slug is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto mx-4">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {category ? "Edit Category" : "Add New Category"}
            </h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">
              Basic Information
            </h3>

            <div>
              <Label htmlFor="name">Category Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => {
                  const name = e.target.value;
                  setFormData((prev) => ({
                    ...prev,
                    name,
                    slug: generateSlug(name),
                  }));
                }}
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

            <div>
              <Label htmlFor="slug">URL Slug *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, slug: e.target.value }))
                }
                className={errors.slug ? "border-red-500" : ""}
              />
              {errors.slug && (
                <p className="text-sm text-red-600 mt-1">{errors.slug}</p>
              )}
            </div>
          </div>

          {/* Visual Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">
              Visual Settings
            </h3>

            <div>
              <Label>Icon</Label>
              <div className="grid grid-cols-6 lg:grid-cols-8 gap-2 mt-2">
                {iconOptions.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, icon }))}
                    className={cn(
                      "p-3 border-2 rounded-lg text-lg hover:bg-gray-50",
                      formData.icon === icon
                        ? "border-fresh-500 bg-fresh-50"
                        : "border-gray-200",
                    )}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label>Background Color</Label>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mt-2">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, color: color.value }))
                    }
                    className={cn(
                      "p-3 border-2 rounded-lg text-sm font-medium",
                      color.value,
                      color.text,
                      formData.color === color.value
                        ? "border-fresh-500"
                        : "border-gray-200",
                    )}
                  >
                    {color.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Settings */}
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
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="parentId">Parent Category</Label>
              <Select
                value={formData.parentId || "none"}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    parentId: value === "none" ? null : value,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None (Top Level)</SelectItem>
                  {categories
                    .filter((cat) => cat.id !== category?.id)
                    .map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* SEO Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">SEO Settings</h3>

            <div>
              <Label htmlFor="seoTitle">SEO Title</Label>
              <Input
                id="seoTitle"
                value={formData.metadata?.seoTitle || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    metadata: { ...prev.metadata!, seoTitle: e.target.value },
                  }))
                }
              />
            </div>

            <div>
              <Label htmlFor="seoDescription">SEO Description</Label>
              <Textarea
                id="seoDescription"
                value={formData.metadata?.seoDescription || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    metadata: {
                      ...prev.metadata!,
                      seoDescription: e.target.value,
                    },
                  }))
                }
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="keywords">Keywords (comma separated)</Label>
              <Input
                id="keywords"
                value={formData.metadata?.keywords?.join(", ") || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    metadata: {
                      ...prev.metadata!,
                      keywords: e.target.value
                        .split(",")
                        .map((kw) => kw.trim())
                        .filter(Boolean),
                    },
                  }))
                }
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-fresh-600 hover:bg-fresh-700">
              <Save className="w-4 h-4 mr-2" />
              {category ? "Update Category" : "Add Category"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
