import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Leaf,
  ArrowLeft,
  Search,
  Star,
  Plus,
  Minus,
  Heart,
  Filter,
  Grid,
  List,
} from "lucide-react";
import { Link } from "react-router-dom";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import BottomNavigation from "@/components/BottomNavigation";

export default function Categories() {
  const [selectedCategory, setSelectedCategory] = useState("fruits");
  const [cartItems, setCartItems] = useState<{ [key: string]: number }>(
    {},
  );
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    {
      id: "fruits",
      name: "Fruits",
      icon: "🍎",
      color: "bg-red-100",
      count: 23,
    },
    {
      id: "vegetables",
      name: "Vegetables",
      icon: "🥕",
      color: "bg-green-100",
      count: 35,
    },
    {
      id: "dairy",
      name: "Milk & Dairy",
      icon: "🥛",
      color: "bg-blue-100",
      count: 25,
    },
    {
      id: "breads",
      name: "Breads & Batter",
      icon: "🍞",
      color: "bg-orange-100",
      count: 6,
    },
    {
      id: "oils",
      name: "Oil & Ghee",
      icon: "🛢️",
      color: "bg-yellow-100",
      count: 15,
    },
    {
      id: "grains",
      name: "Rice & Pulses",
      icon: "🌾",
      color: "bg-amber-100",
      count: 18,
    },
    {
      id: "beverages",
      name: "Beverages",
      icon: "🥤",
      color: "bg-purple-100",
      count: 32,
    },
    {
      id: "snacks",
      name: "Snacks",
      icon: "🍿",
      color: "bg-pink-100",
      count: 45,
    },
  ];

  const subcategories = {
    fruits: ["Citrus", "Tropical", "Seasonal", "Exotic", "Organic", "Premium"],
    vegetables: [
      "Leafy Greens",
      "Root Vegetables",
      "Gourds",
      "Herbs",
      "Organic",
      "Fresh Cut",
    ],
    dairy: ["Milk", "Yogurt", "Cheese", "Butter", "Cream", "Paneer"],
    breads: ["Bread", "Eggs", "Batter", "Parotas", "Organic", "Fresh"],
    oils: [
      "Cooking Oils",
      "Ghee",
      "Groundnut Oil",
      "Premium",
      "Cold Pressed",
      "Organic",
    ],
    grains: ["Rice", "Pulses", "Lentils", "Millets", "Premium", "Organic"],
    beverages: [
      "Soft Drinks",
      "Juices",
      "Tea",
      "Coffee",
      "Energy Drinks",
      "Water",
    ],
    snacks: ["Chips", "Nuts", "Chocolates", "Biscuits", "Namkeen", "Popcorn"],
  };

  const products = [
    // FRUITS
    {
      id: "f1",
      name: "Fresh Red Apples",
      price: "₹140",
      originalPrice: "₹160",
      image:
        "https://images.pexels.com/photos/3746517/pexels-photo-3746517.jpeg",
      rating: 4.8,
      discount: "12% OFF",
      unit: "1 Kg",
      organic: true,
      category: "fruits",
    },
    {
      id: "f2",
      name: "Ripe Yellow Bananas",
      price: "₹60",
      originalPrice: "₹75",
      image:
        "https://images.pexels.com/photos/2872767/pexels-photo-2872767.jpeg",
      rating: 4.6,
      discount: "20% OFF",
      unit: "1 Dozen",
      organic: true,
      category: "fruits",
    },
    {
      id: "f3",
      name: "Fresh Kiwi",
      price: "₹180",
      originalPrice: "₹200",
      image: "https://images.pexels.com/photos/909908/pexels-photo-909908.jpeg",
      rating: 4.7,
      discount: "10% OFF",
      unit: "6 Pieces",
      organic: true,
      category: "fruits",
    },
    {
      id: "f4",
      name: "Dragon Fruit",
      price: "₹350",
      originalPrice: "₹400",
      image:
        "https://images.pexels.com/photos/2907428/pexels-photo-2907428.jpeg",
      rating: 4.5,
      discount: "12% OFF",
      unit: "1 Piece",
      organic: false,
      category: "fruits",
    },
    {
      id: "f5",
      name: "Watermelon",
      price: "₹40",
      originalPrice: "₹50",
      image: "https://images.pexels.com/photos/147359/pexels-photo-147359.jpeg",
      rating: 4.6,
      discount: "20% OFF",
      unit: "1 Kg",
      organic: true,
      category: "fruits",
    },
    {
      id: "f6",
      name: "Pomegranate",
      price: "₹200",
      originalPrice: "₹240",
      image:
        "https://images.pexels.com/photos/17551627/pexels-photo-17551627.jpeg",
      rating: 4.8,
      discount: "17% OFF",
      unit: "500g",
      organic: true,
      category: "fruits",
    },
    {
      id: "f7",
      name: "Juicy Mango",
      price: "₹180",
      originalPrice: "₹220",
      image:
        "https://images.pexels.com/photos/7190365/pexels-photo-7190365.jpeg",
      rating: 4.9,
      discount: "18% OFF",
      unit: "1 Kg",
      organic: true,
      category: "fruits",
    },
    {
      id: "f8",
      name: "Muskmelon",
      price: "₹60",
      originalPrice: "₹75",
      image:
        "https://images.pexels.com/photos/18281444/pexels-photo-18281444.jpeg",
      rating: 4.5,
      discount: "20% OFF",
      unit: "1 Kg",
      organic: true,
      category: "fruits",
    },
    {
      id: "f9",
      name: "Fresh Pears",
      price: "₹160",
      originalPrice: "₹180",
      image:
        "https://images.pexels.com/photos/8086137/pexels-photo-8086137.jpeg",
      rating: 4.7,
      discount: "11% OFF",
      unit: "1 Kg",
      organic: true,
      category: "fruits",
    },
    {
      id: "f10",
      name: "Papaya",
      price: "₹50",
      originalPrice: "₹60",
      image:
        "https://images.pexels.com/photos/10380517/pexels-photo-10380517.jpeg",
      rating: 4.6,
      discount: "17% OFF",
      unit: "1 Kg",
      organic: true,
      category: "fruits",
    },
    {
      id: "f11",
      name: "Fresh Coconut",
      price: "₹40",
      originalPrice: "₹50",
      image:
        "https://images.pexels.com/photos/16077079/pexels-photo-16077079.jpeg",
      rating: 4.8,
      discount: "20% OFF",
      unit: "1 Piece",
      organic: true,
      category: "fruits",
    },
    {
      id: "f12",
      name: "Fresh Orange",
      price: "₹120",
      originalPrice: "₹140",
      image: "https://images.pexels.com/photos/793763/pexels-photo-793763.jpeg",
      rating: 4.7,
      discount: "14% OFF",
      unit: "1 Kg",
      organic: false,
      category: "fruits",
    },
    {
      id: "f13",
      name: "Fresh Lemon",
      price: "₹80",
      originalPrice: "₹100",
      image: "https://images.pexels.com/photos/793763/pexels-photo-793763.jpeg",
      rating: 4.6,
      discount: "20% OFF",
      unit: "500g",
      organic: true,
      category: "fruits",
    },
    {
      id: "f14",
      name: "Fresh Avocado",
      price: "₹160",
      originalPrice: "₹180",
      image:
        "https://images.pexels.com/photos/3750845/pexels-photo-3750845.jpeg",
      rating: 4.5,
      discount: "11% OFF",
      unit: "3 Pieces",
      organic: true,
      category: "fruits",
    },
    {
      id: "f15",
      name: "Green Grapes",
      price: "₹120",
      originalPrice: "₹140",
      image:
        "https://images.pexels.com/photos/31399032/pexels-photo-31399032.jpeg",
      rating: 4.7,
      discount: "14% OFF",
      unit: "500g",
      organic: true,
      category: "fruits",
    },
    {
      id: "f16",
      name: "Fresh Guava",
      price: "₹80",
      originalPrice: "₹100",
      image: "https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg",
      rating: 4.6,
      discount: "20% OFF",
      unit: "500g",
      organic: true,
      category: "fruits",
    },
    {
      id: "f17",
      name: "Blueberries",
      price: "₹450",
      originalPrice: "₹500",
      image: "https://images.pexels.com/photos/101669/pexels-photo-101669.jpeg",
      rating: 4.9,
      discount: "10% OFF",
      unit: "200g",
      organic: true,
      category: "fruits",
    },
    {
      id: "f18",
      name: "Fresh Pineapple",
      price: "₹120",
      originalPrice: "₹150",
      image:
        "https://images.pexels.com/photos/4412924/pexels-photo-4412924.jpeg",
      rating: 4.7,
      discount: "20% OFF",
      unit: "1 Piece",
      organic: true,
      category: "fruits",
    },
    {
      id: "f19",
      name: "Passion Fruit",
      price: "₹300",
      originalPrice: "₹350",
      image:
        "https://images.pexels.com/photos/28882153/pexels-photo-28882153.jpeg",
      rating: 4.8,
      discount: "14% OFF",
      unit: "250g",
      organic: true,
      category: "fruits",
    },

    // VEGETABLES
    {
      id: "v1",
      name: "White Onions",
      price: "₹35",
      originalPrice: "₹45",
      image:
        "https://images.pexels.com/photos/8697513/pexels-photo-8697513.jpeg",
      rating: 4.5,
      discount: "22% OFF",
      unit: "1 Kg",
      organic: false,
      category: "vegetables",
    },
    {
      id: "v2",
      name: "Fresh Tomatoes",
      price: "₹50",
      originalPrice: "₹60",
      image:
        "https://images.pexels.com/photos/10680710/pexels-photo-10680710.jpeg",
      rating: 4.7,
      discount: "17% OFF",
      unit: "500g",
      organic: true,
      category: "vegetables",
    },
    {
      id: "v3",
      name: "Farm Fresh Potatoes",
      price: "₹30",
      originalPrice: "₹40",
      image:
        "https://images.pexels.com/photos/4502145/pexels-photo-4502145.jpeg",
      rating: 4.6,
      discount: "25% OFF",
      unit: "1 Kg",
      organic: true,
      category: "vegetables",
    },
    {
      id: "v4",
      name: "Sweet Potato",
      price: "₹45",
      originalPrice: "₹55",
      image:
        "https://images.pexels.com/photos/10537058/pexels-photo-10537058.jpeg",
      rating: 4.5,
      discount: "18% OFF",
      unit: "500g",
      organic: true,
      category: "vegetables",
    },
    {
      id: "v5",
      name: "Fresh Okra (Bhindi)",
      price: "₹60",
      originalPrice: "₹75",
      image:
        "https://images.pexels.com/photos/18194533/pexels-photo-18194533.jpeg",
      rating: 4.4,
      discount: "20% OFF",
      unit: "500g",
      organic: true,
      category: "vegetables",
    },
    {
      id: "v6",
      name: "Bottle Gourd",
      price: "₹40",
      originalPrice: "₹50",
      image:
        "https://images.pexels.com/photos/1346347/pexels-photo-1346347.jpeg",
      rating: 4.3,
      discount: "20% OFF",
      unit: "1 Kg",
      organic: true,
      category: "vegetables",
    },
    {
      id: "v7",
      name: "Brinjal (Eggplant)",
      price: "₹45",
      originalPrice: "₹55",
      image: "https://images.pexels.com/photos/772513/pexels-photo-772513.png",
      rating: 4.6,
      discount: "18% OFF",
      unit: "500g",
      organic: true,
      category: "vegetables",
    },
    {
      id: "v8",
      name: "Green Chilli",
      price: "₹80",
      originalPrice: "₹100",
      image:
        "https://images.pexels.com/photos/5855238/pexels-photo-5855238.jpeg",
      rating: 4.7,
      discount: "20% OFF",
      unit: "250g",
      organic: true,
      category: "vegetables",
    },
    {
      id: "v9",
      name: "Fresh Spinach",
      price: "₹25",
      originalPrice: "₹30",
      image:
        "https://images.pexels.com/photos/2297961/pexels-photo-2297961.jpeg",
      rating: 4.8,
      discount: "17% OFF",
      unit: "250g",
      organic: true,
      category: "vegetables",
    },
    {
      id: "v10",
      name: "Fresh Ginger",
      price: "₹120",
      originalPrice: "₹150",
      image:
        "https://images.pexels.com/photos/12026725/pexels-photo-12026725.jpeg",
      rating: 4.7,
      discount: "20% OFF",
      unit: "250g",
      organic: true,
      category: "vegetables",
    },
    {
      id: "v11",
      name: "Fresh Carrots",
      price: "₹40",
      originalPrice: "���50",
      image:
        "https://images.pexels.com/photos/5855239/pexels-photo-5855239.jpeg",
      rating: 4.6,
      discount: "20% OFF",
      unit: "500g",
      organic: true,
      category: "vegetables",
    },
    {
      id: "v12",
      name: "Fresh Cucumber",
      price: "₹35",
      originalPrice: "₹45",
      image:
        "https://images.pexels.com/photos/3568039/pexels-photo-3568039.jpeg",
      rating: 4.5,
      discount: "22% OFF",
      unit: "500g",
      organic: true,
      category: "vegetables",
    },

    // DAIRY PRODUCTS
    {
      id: "d1",
      name: "Heritage Toned Milk",
      price: "₹65",
      originalPrice: "₹75",
      image:
        "https://images.pexels.com/photos/18258533/pexels-photo-18258533.jpeg",
      rating: 4.8,
      discount: "13% OFF",
      unit: "1L",
      organic: false,
      category: "dairy",
    },
    {
      id: "d2",
      name: "Heritage Full Cream Milk",
      price: "₹75",
      originalPrice: "₹85",
      image:
        "https://images.pexels.com/photos/18258533/pexels-photo-18258533.jpeg",
      rating: 4.9,
      discount: "12% OFF",
      unit: "1L",
      organic: false,
      category: "dairy",
    },
    {
      id: "d3",
      name: "Amul Butter",
      price: "₹240",
      originalPrice: "₹280",
      image:
        "https://images.pexels.com/photos/5865465/pexels-photo-5865465.jpeg",
      rating: 4.7,
      discount: "14% OFF",
      unit: "200g",
      organic: false,
      category: "dairy",
    },
    {
      id: "d4",
      name: "Fresh Paneer",
      price: "₹180",
      originalPrice: "₹200",
      image:
        "https://images.pexels.com/photos/19081131/pexels-photo-19081131.jpeg",
      rating: 4.6,
      discount: "10% OFF",
      unit: "200g",
      organic: true,
      category: "dairy",
    },
    {
      id: "d5",
      name: "Nandini Curd",
      price: "₹45",
      originalPrice: "₹55",
      image:
        "https://images.pexels.com/photos/29684991/pexels-photo-29684991.jpeg",
      rating: 4.8,
      discount: "18% OFF",
      unit: "400g",
      organic: false,
      category: "dairy",
    },
    {
      id: "d6",
      name: "Jersey Milk",
      price: "₹85",
      originalPrice: "₹100",
      image:
        "https://images.pexels.com/photos/28664618/pexels-photo-28664618.jpeg",
      rating: 4.7,
      discount: "15% OFF",
      unit: "1L",
      organic: true,
      category: "dairy",
    },

    // BREADS & BATTER
    {
      id: "b1",
      name: "Britannia Bread",
      price: "₹35",
      originalPrice: "₹40",
      image:
        "https://images.pexels.com/photos/17888535/pexels-photo-17888535.jpeg",
      rating: 4.5,
      discount: "12% OFF",
      unit: "400g",
      organic: false,
      category: "breads",
    },
    {
      id: "b2",
      name: "Fresh Eggs",
      price: "₹120",
      originalPrice: "₹140",
      image:
        "https://images.pexels.com/photos/4394258/pexels-photo-4394258.jpeg",
      rating: 4.8,
      discount: "14% OFF",
      unit: "12 Pieces",
      organic: true,
      category: "breads",
    },
    {
      id: "b3",
      name: "Idli & Dosa Batter",
      price: "₹45",
      originalPrice: "₹55",
      image:
        "https://images.pexels.com/photos/4929714/pexels-photo-4929714.jpeg",
      rating: 4.7,
      discount: "18% OFF",
      unit: "500g",
      organic: true,
      category: "breads",
    },

    // OILS & GHEE
    {
      id: "o1",
      name: "Nandini Ghee",
      price: "₹580",
      originalPrice: "₹650",
      image:
        "https://images.pexels.com/photos/30203314/pexels-photo-30203314.jpeg",
      rating: 4.9,
      discount: "11% OFF",
      unit: "500ml",
      organic: true,
      category: "oils",
    },
    {
      id: "o2",
      name: "Fortune Oil",
      price: "₹180",
      originalPrice: "₹200",
      image:
        "https://images.pexels.com/photos/20141098/pexels-photo-20141098.jpeg",
      rating: 4.6,
      discount: "10% OFF",
      unit: "1L",
      organic: false,
      category: "oils",
    },
    {
      id: "o3",
      name: "Dhara Oil",
      price: "₹160",
      originalPrice: "₹180",
      image:
        "https://images.pexels.com/photos/20141098/pexels-photo-20141098.jpeg",
      rating: 4.5,
      discount: "11% OFF",
      unit: "1L",
      organic: false,
      category: "oils",
    },

    // GRAINS & PULSES
    {
      id: "g1",
      name: "Basmati Rice",
      price: "₹180",
      originalPrice: "₹200",
      image:
        "https://images.pexels.com/photos/17650169/pexels-photo-17650169.jpeg",
      rating: 4.8,
      discount: "10% OFF",
      unit: "1 Kg",
      organic: true,
      category: "grains",
    },
    {
      id: "g2",
      name: "Tur Dal",
      price: "₹150",
      originalPrice: "₹180",
      image:
        "https://images.pexels.com/photos/30203314/pexels-photo-30203314.jpeg",
      rating: 4.7,
      discount: "17% OFF",
      unit: "1 Kg",
      organic: false,
      category: "grains",
    },
    {
      id: "g3",
      name: "Moong Dal",
      price: "₹140",
      originalPrice: "₹160",
      image:
        "https://images.pexels.com/photos/17650171/pexels-photo-17650171.jpeg",
      rating: 4.6,
      discount: "12% OFF",
      unit: "1 Kg",
      organic: true,
      category: "grains",
    },
    {
      id: "g4",
      name: "White Rice",
      price: "₹65",
      originalPrice: "₹75",
      image: "https://images.pexels.com/photos/586615/pexels-photo-586615.jpeg",
      rating: 4.5,
      discount: "13% OFF",
      unit: "1 Kg",
      organic: false,
      category: "grains",
    },
    {
      id: "g5",
      name: "Rajma (Kidney Beans)",
      price: "₹180",
      originalPrice: "₹210",
      image:
        "https://images.pexels.com/photos/8992843/pexels-photo-8992843.jpeg",
      rating: 4.7,
      discount: "14% OFF",
      unit: "1 Kg",
      organic: true,
      category: "grains",
    },
  ];

  const addToCart = (productId: string) => {
    setCartItems((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1,
    }));
  };

  const removeFromCart = (productId: string) => {
    setCartItems((prev) => ({
      ...prev,
      [productId]: Math.max((prev[productId] || 0) - 1, 0),
    }));
  };

  const filteredProducts = products.filter(
    (product) =>
      product.category === selectedCategory &&
      product.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const selectedCategoryData = categories.find(
    (cat) => cat.id === selectedCategory,
  );

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link to="/">
                <Button variant="ghost" size="sm" className="p-2">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <h2 className="text-lg md:text-xl font-semibold text-fresh-700">
                {selectedCategoryData?.name || "Categories"}
              </h2>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="p-2">
                <Search className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2 relative">
                <div className="w-6 h-6 rounded-full border-2 border-fresh-500 flex items-center justify-center">
                  <span className="text-xs font-bold text-fresh-600">
                    {Object.values(cartItems).reduce(
                      (sum, count) => sum + count,
                      0,
                    )}
                  </span>
                </div>
                {Object.values(cartItems).reduce(
                  (sum, count) => sum + count,
                  0,
                ) > 0 && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-fresh-500 rounded-full"></div>
                )}
              </Button>
            </div>
          </div>

          {/* Search Bar - Hidden by default, can be toggled */}
          <div className="mt-3 relative hidden">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-fresh-200 focus:border-fresh-400"
            />
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-140px)] md:h-[calc(100vh-120px)]">
        {/* Left Sidebar - Categories (Always visible) */}
        <div className="w-20 md:w-80 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-2 md:p-4">
            {/* Desktop header */}
            <h3 className="hidden md:block font-semibold text-fresh-700 mb-4">
              All Categories
            </h3>

            <div className="space-y-1 md:space-y-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={cn(
                    "w-full flex md:items-center transition-colors text-left rounded-lg",
                    "flex-col items-center space-y-1 p-2 md:flex-row md:space-y-0 md:space-x-3 md:p-3",
                    selectedCategory === category.id
                      ? "bg-fresh-50 border border-fresh-200 text-fresh-700"
                      : "hover:bg-gray-50",
                  )}
                >
                  <div
                    className={`w-8 h-8 md:w-10 md:h-10 rounded-lg ${category.color} flex items-center justify-center flex-shrink-0`}
                  >
                    <span className="text-base md:text-lg">
                      {category.icon}
                    </span>
                  </div>

                  {/* Mobile: Show truncated name */}
                  <span className="text-xs font-medium text-center leading-tight md:hidden">
                    {category.name.split(" ")[0]}
                    {category.name.includes("&") && " &"}
                  </span>

                  {/* Desktop: Show full details */}
                  <div className="hidden md:block flex-1">
                    <h4 className="font-medium">{category.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {category.count} items
                    </p>
                  </div>
                </button>
              ))}
            </div>

            {/* Subcategories - Desktop only */}
            {selectedCategoryData && (
              <div className="hidden md:block mt-6">
                <h4 className="font-medium text-fresh-700 mb-3">
                  {selectedCategoryData.name} Subcategories
                </h4>
                <div className="space-y-1">
                  {subcategories[
                    selectedCategory as keyof typeof subcategories
                  ]?.map((sub) => (
                    <button
                      key={sub}
                      className="w-full text-left px-3 py-2 text-sm text-muted-foreground hover:text-fresh-600 hover:bg-fresh-50 rounded transition-colors"
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          {/* Mobile subcategories - only visible if more than 1 subcategory */}
          <div className="md:hidden bg-white border-b border-gray-200 p-3">
            <div className="flex space-x-2 overflow-x-auto">
              {subcategories[selectedCategory as keyof typeof subcategories]
                ?.slice(0, 4)
                .map((sub) => (
                  <Badge
                    key={sub}
                    variant="outline"
                    className="whitespace-nowrap border-fresh-300 text-fresh-600 hover:bg-fresh-50 cursor-pointer text-xs py-1 px-2"
                  >
                    {sub}
                  </Badge>
                ))}
            </div>
          </div>

          <div className="p-3 md:p-4">
            {/* Header with view toggle */}
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <div>
                <h2 className="text-lg md:text-xl font-bold text-fresh-700">
                  {selectedCategoryData?.name}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {filteredProducts.length} products
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" className="hidden md:flex">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>

                <div className="hidden md:flex border border-gray-200 rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className={cn(
                      "rounded-r-none",
                      viewMode === "grid" && "bg-fresh-50 text-fresh-600",
                    )}
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className={cn(
                      "rounded-l-none",
                      viewMode === "list" && "bg-fresh-50 text-fresh-600",
                    )}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Products Grid - Always grid on mobile (2 cols), responsive on desktop */}
            <div
              className={cn(
                "gap-3 md:gap-4",
                "grid grid-cols-2 md:grid-cols-1",
                viewMode === "grid" &&
                  "md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
                viewMode === "list" && "md:space-y-4",
              )}
            >
              {filteredProducts.map((product) => (
                <Card
                  key={product.id}
                  className={cn(
                    "hover:shadow-md transition-all duration-200 border-fresh-200 hover:border-fresh-300 active:scale-[0.98] bg-white",
                    viewMode === "list" && "md:flex md:flex-row",
                  )}
                >
                  <CardContent
                    className={cn(
                      "p-2 md:p-4",
                      viewMode === "list" &&
                        "md:flex md:items-center md:space-x-4",
                    )}
                  >
                    <div
                      className={cn(
                        "relative mb-2 md:mb-3",
                        viewMode === "list" && "md:flex-shrink-0",
                      )}
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className={cn(
                          "object-cover rounded-lg bg-gray-100",
                          "w-full h-32 md:h-40",
                          viewMode === "list" && "md:w-20 md:h-20",
                        )}
                      />
                      {product.organic && (
                        <Badge className="absolute top-1 left-1 md:top-2 md:left-2 bg-fresh-500 text-xs py-0 px-1">
                          <Leaf className="w-2 h-2 md:w-3 md:h-3 mr-0.5 md:mr-1" />
                          <span className="hidden md:inline">Organic</span>
                        </Badge>
                      )}
                      <Badge className="absolute top-1 right-1 md:top-2 md:right-2 bg-orange-500 text-xs py-0 px-1">
                        {product.discount}
                      </Badge>
                    </div>

                    <div
                      className={cn(
                        "space-y-1",
                        viewMode === "list" && "md:flex-1 md:space-y-2",
                      )}
                    >
                      <h4 className="font-medium text-xs md:text-base text-fresh-700 line-clamp-2 leading-tight">
                        {product.name}
                      </h4>
                      <div className="text-xs text-muted-foreground">
                        {product.unit}
                      </div>

                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-medium">
                          {product.rating}
                        </span>
                      </div>

                      <div className="flex items-center space-x-1 md:space-x-2">
                        <span className="text-sm md:text-lg font-bold text-fresh-600">
                          {product.price}
                        </span>
                        <span className="text-xs text-muted-foreground line-through">
                          {product.originalPrice}
                        </span>
                      </div>

                      <div
                        className={cn(
                          "pt-1 md:pt-2",
                          viewMode === "list"
                            ? "md:flex md:items-center md:justify-end"
                            : "",
                        )}
                      >
                        {cartItems[product.id] > 0 ? (
                          <div className="flex items-center justify-center space-x-1 md:space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 w-7 md:h-9 md:w-9 p-0 border-fresh-300 active:scale-90 transition-transform"
                              onClick={() => removeFromCart(product.id)}
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="font-medium text-fresh-600 min-w-[20px] md:min-w-[24px] text-center text-xs md:text-base">
                              {cartItems[product.id]}
                            </span>
                            <Button
                              size="sm"
                              className="h-7 w-7 md:h-9 md:w-9 p-0 bg-fresh-500 hover:bg-fresh-600 active:scale-90 transition-transform"
                              onClick={() => addToCart(product.id)}
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            className={cn(
                              "bg-fresh-500 hover:bg-fresh-600 text-xs md:text-base font-medium active:scale-95 transition-transform",
                              "w-full h-7 md:h-9",
                              viewMode === "list" && "md:w-auto md:px-4",
                            )}
                            onClick={() => addToCart(product.id)}
                          >
                            <Plus className="w-3 h-3 mr-1 md:hidden" />
                            <span className="md:hidden">Add</span>
                            <span className="hidden md:inline">
                              {viewMode === "list" ? "Add to Cart" : "Add"}
                            </span>
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-fresh-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">🔍</span>
                </div>
                <h3 className="text-xl font-semibold text-fresh-700 mb-4">
                  No products found
                </h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or browse other categories.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}
