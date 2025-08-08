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
  X,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import React, { useState, useRef, useEffect, useContext } from "react";
import { cn } from "@/lib/utils";
import BottomNavigation from "@/components/BottomNavigation";
import api from "@/lib/api";
import { Category, Product } from "@shared/api";
import { MyContext } from "@/App";

export default function Categories() {
  const { data, setData } = useContext(MyContext);
  const navigate = useNavigate();
  const { categoryId } = useParams();
  const [selectedCategory, setSelectedCategory] = useState(categoryId);
  const [cartItems, setCartItems] = useState<any[]>(data.cartItemsData || []);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [products, setProducts] = useState<any[]>(data.productsData || []);
  const [categories, setCategories] = useState<Category[]>(data.categoriesData || []);
  const [loading, setLoading] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(data.productsData || []);
  

//   useEffect(() => {
//     setData(data);
// }, [data]); 

// const handleGetProducts = async () => {
//   const catResponse = await api.categories.getCategories();
//     if (catResponse.success && catResponse.data) {
//       // const categoriesWithSubs = [];
//       const categoriesWithSubs = await Promise.all(
//         catResponse.data.map(async (category) => {
//           if(!category.parentCategoryId) {
//             try {
//               const subResponse = await api.categories.getSubcategories(category.id);
//               return ({
//                 ...category,
//                 subcategories: subResponse.success && subResponse.data ? subResponse.data : []
//               });
//             } catch (error) {
//               console.error(`Failed to load subcategories for ${category.id}:`, error);
//               return ({
//                 ...category,
//                 subcategories: []
//               });
//             }
//           }

//         })
//       );
//       let cats = [];
//       categoriesWithSubs.forEach(cat => cat?cats.push(cat):null)
//       setCategories(cats);
//       setLoading(true)
//     }
//   const response = await api.products.getProducts();
//   if (response.success && response.data) {
    
//     response.data.forEach(prod => {
//       prod.image = prod.images[0];
//       if(prod.categoryId) {
//         prod.category = categories?.find(cat => cat?.id == prod.categoryId);
//       }
//       if(prod.subCategoryId) {
//         prod.subcategory = prod.category?.subCategories.find(cat => cat?.id == prod.subCategoryId)
//       }
//     });
//     setProducts(response.data)
//     // let response.datafiltered = products;
//     setFilteredProducts(response.data);
//   }
//   return { success: response.success, data: response.data };
// }


  const addToCart = (item: any) => {
    const existingItem = cartItems.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      setCartItems(
        cartItems.map(cartItem =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
        )
      );
      // const mydata = data;
      setData((prev) => ({...prev, cartItemsData: cartItems.map(cartItem =>
        cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
      )}));
    } else {
      setCartItems([...cartItems, { ...item, quantity: 1 }]);
      // const mydata = data;
      setData((prev) => ({...prev, cartItemsData: [...cartItems, { ...item, quantity: 1 }]}));
    }
  };

  const removeFromCart = (itemId: string) => {
    setCartItems(cartItems.filter(item => item.id !== itemId));
  };

  const handleProductClick = (productDetails: any) => {
    navigate(`/product/` , { state: { product: productDetails } });
  };

  const handleBasketClick = () => {
    // setData(cartItems);
    // navigate(`/basket/` , { state: { cartProducts: cartItems } });
    navigate(`/basket`);
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
    if (showSearch) {
      setSearchQuery(""); // Clear search when hiding
    }
  };

  // Auto-focus search input when shown
  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [showSearch]);

  // const filteredProducts = products.filter(
  //   (product) =>
  //     product.category === selectedCategory &&
  //     product.name.toLowerCase().includes(searchQuery.toLowerCase()),
  // );

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
                {searchQuery ? `Search: "${searchQuery}"` : (selectedCategoryData?.name || "Categories")}
              </h2>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "p-2",
                  showSearch && "bg-fresh-50 text-fresh-600"
                )}
                onClick={toggleSearch}
              >
                <Search className="w-5 h-5" />
              </Button>
              {/* handleBasketClick */}
              <Button variant="ghost" size="sm" className="p-2 relative" onClick={handleBasketClick}>
                <div className="w-6 h-6 rounded-full border-2 border-fresh-500 flex items-center justify-center">
                  <span className="text-xs font-bold text-fresh-600">
                    {cartItems.reduce((sum, prod) => sum + prod.quantity,0)}
                  </span>
                </div>
                {cartItems.reduce((sum, prod) => sum + prod.quantity,0) > 0 && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-fresh-500 rounded-full"></div>
                )}
              </Button>
            </div>
          </div>

          {/* Search Bar - Toggle visibility */}
          <div className={cn("mt-3 relative", !showSearch && "hidden")}>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              ref={searchInputRef}
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10 border-fresh-200 focus:border-fresh-400"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
                onClick={() => setSearchQuery("")}
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-140px)] md:h-[calc(100vh-120px)]">
        {/* Left Sidebar - Categories (Always visible) */}
        <div className="w-20 md:w-80 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-2 md:p-4">
            {/* Desktop header */}
            <h3 className="hidden md:block font-semibold text-fresh-700 mb-4">
              All Categories {data.message}
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
                      {/* {category.count}  */}
                      items
                    </p>
                  </div>
                </button>
              ))}
            </div>

            {/* Subcategories - Desktop only */}
            {/* {selectedCategoryData && (
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
            )} */}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          {/* Mobile subcategories - only visible if more than 1 subcategory */}
          <div className="md:hidden bg-white border-b border-gray-200 p-3">
            <div className="flex space-x-2 overflow-x-auto">
              {/* {subcategories[selectedCategory as keyof typeof subcategories]
                ?.slice(0, 4)
                .map((sub) => (
                  <Badge
                    key={sub}
                    variant="outline"
                    className="whitespace-nowrap border-fresh-300 text-fresh-600 hover:bg-fresh-50 cursor-pointer text-xs py-1 px-2"
                  >
                    {sub}
                  </Badge>
                ))} */}
            </div>
          </div>

          <div className="p-3 md:p-4">
            {/* Header with view toggle */}
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <div>
                <h2 className="text-lg md:text-xl font-bold text-fresh-700">
                  {searchQuery ? "Search Results" : selectedCategoryData?.name}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {filteredProducts.length} {searchQuery ? "results" : "products"}
                  {searchQuery && ` for "${searchQuery}"`}
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
              {filteredProducts.filter(prod => prod.categoryId == selectedCategory).map((product) => (
                <Card
                  key={product.id}
                  className={cn(
                    "hover:shadow-md transition-all duration-200 border-fresh-200 hover:border-fresh-300 active:scale-[0.98] bg-white cursor-pointer",
                    viewMode === "list" && "md:flex md:flex-row",
                  )}
                  onClick={() => handleProductClick(product)}
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
                      {product.isOrganic && (
                        <Badge className="absolute top-1 left-1 md:top-2 md:left-2 bg-fresh-500 text-xs py-0 px-1">
                          <Leaf className="w-2 h-2 md:w-3 md:h-3 mr-0.5 md:mr-1" />
                          <span className="hidden md:inline">Organic</span>
                        </Badge>
                      )}
                      <Badge className="absolute top-1 right-1 md:top-2 md:right-2 bg-orange-500 text-xs py-0 px-1">
                        {product.price}
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
                        {cartItems?.find(item => item.id == product.id)?.quantity > 0 ? (
                          <div className="flex items-center justify-center space-x-1 md:space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 w-7 md:h-9 md:w-9 p-0 border-fresh-300 active:scale-90 transition-transform"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeFromCart(product.id);
                              }}
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="font-medium text-fresh-600 min-w-[20px] md:min-w-[24px] text-center text-xs md:text-base">
                              {cartItems?.find(item => item.id == product.id)?.quantity}
                            </span>
                            <Button
                              size="sm"
                              className="h-7 w-7 md:h-9 md:w-9 p-0 bg-fresh-500 hover:bg-fresh-600 active:scale-90 transition-transform"
                              onClick={(e) => {
                                e.stopPropagation();
                                addToCart(product);
                              }}
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
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(product);
                            }}
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
                  <span className="text-4xl">��</span>
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
