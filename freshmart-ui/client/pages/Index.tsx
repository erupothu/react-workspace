import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Search,
  ShoppingCart,
  Clock,
  Truck,
  Star,
  Leaf,
  Plus,
  Minus,
  Heart,
} from "lucide-react";
import { Link } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import SimpleBottomNavigation from "@/components/SimpleBottomNavigation";
import PWAInstallButton from "@/components/PWAInstallButton";
import SimpleAuthModal from "@/components/SimpleAuthModal";
import UserDropdown from "@/components/UserDropdown";
import { useAuth } from "@/contexts/AuthContext";
import { Category, Product } from "@shared/api";
import api from "@/lib/api";
import { MyContext } from "@/App";

export default function Index() {
  const { data, setData } = useContext(MyContext);
  const { user, isAuthenticated, login } = useAuth();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>(data.categoriesData || []);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(data.productsData || []);
  const [products, setProducts] = useState<any[]>(data.productsData || []);

  useEffect(() => {
    handleGetProducts();
}, [setProducts]); 

const handleGetProducts = async () => {
  const catResponse = await api.categories.getCategories();
    if (catResponse.success && catResponse.data) {
      setCategories(catResponse.data);
      setData((prev) => ({...prev, categoriesData: catResponse.data}))
    }
  const response = await api.products.getProducts();
  if (response.success && response.data) {
    response.data.forEach(prod => {
      prod.image = prod.images[0];
      if(prod.categoryId) {
        prod.category = categories?.find(cat => cat?.id == prod.categoryId);
      }
      // if(prod.subCategoryId) {
      //   prod.subcategory = prod.category?.subCategories.find(cat => cat?.id == prod.subCategoryId)
      // }
    });
    setProducts(response.data)
    setData((prev) => ({...prev, productsData: response.data}));
    // setFilteredProducts(response.data);
  }
  return { success: response.success, data: response.data };
}

  // Auto-open auth modal on page load if user is not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      
      setIsAuthModalOpen(true);
    }
  }, [isAuthenticated, products]);

  // useEffect(() => {
  //   const loadCategories = async () => {
  //       const response = await api.categories.getCategories();
  //       if (response.success && response.data) {
  //         // const categoriesWithSubs = [];
  //         const categoriesWithSubs = await Promise.all(
  //           response.data.map(async (category) => {
  //             if(!category.parentCategoryId) {
  //               try {
  //                 const subResponse = await api.categories.getSubcategories(category.id);
  //                 return ({
  //                   ...category,
  //                   subcategories: subResponse.success && subResponse.data ? subResponse.data : []
  //                 });
  //               } catch (error) {
  //                 console.error(`Failed to load subcategories for ${category.id}:`, error);
  //                 return ({
  //                   ...category,
  //                   subcategories: []
  //                 });
  //               }
  //             }
  //           })
  //         );
  //         let categories = [];
  //         categoriesWithSubs.forEach(item => item? categories.push(item):"")
  //         setCategories(categories);
          
  //         setLoading(true)
  //       }
  //   };
  //   loadCategories();
  // }, [loading]);

  // Don't allow closing modal if user is not authenticated
  const handleModalClose = () => {
    if (isAuthenticated) {
      setIsAuthModalOpen(false);
    }
    // If not authenticated, don't close the modal - user must sign in
  };

  const addToCart = (item: any) => {
    const existingItem = cartItems.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      setCartItems(
        cartItems.map(cartItem =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
        )
      );
      setData((prev) => ({...prev, cartItemsData: cartItems}))
    } else {
      setCartItems([...cartItems, { ...item, quantity: 1 }]);
      setData((prev) => ({...prev, cartItemsData: [...cartItems, { ...item, quantity: 1 }]}))
    }
  };

  const removeFromCart = (itemId: string) => {
    setCartItems(cartItems.filter(item => item.id !== itemId));
  };

  // const addToCart = (productId: string) => {
  //   setCartItems((prev) => ({
  //     ...prev,
  //     [productId]: (prev[productId] || 0) + 1,
  //   }));
  // };

  // const removeFromCart = (productId: string) => {
  //   setCartItems((prev) => ({
  //     ...prev,
  //     [productId]: Math.max((prev[productId] || 0) - 1, 0),
  //   }));
  // };

  const handleAuthSuccess = (userData: any) => {
    login(userData);
    setIsAuthModalOpen(false);
  };

  const featuredProducts = [
    {
      id: "1",
      name: "Fresh Red Apples",
      price: "₹140",
      originalPrice: "₹160",
      image:
        "https://images.pexels.com/photos/3746517/pexels-photo-3746517.jpeg",
      rating: 4.8,
      discount: "12% OFF",
      unit: "1 Kg",
      organic: true,
    },
    {
      id: "2",
      name: "Ripe Yellow Bananas",
      price: "₹60",
      originalPrice: "₹75",
      image:
        "https://images.pexels.com/photos/2872767/pexels-photo-2872767.jpeg",
      rating: 4.6,
      discount: "20% OFF",
      unit: "1 Dozen",
      organic: true,
    },
    {
      id: "3",
      name: "Fresh Strawberries",
      price: "₹300",
      originalPrice: "₹350",
      image:
        "https://images.pexels.com/photos/1788912/pexels-photo-1788912.jpeg",
      rating: 4.9,
      discount: "14% OFF",
      unit: "500g",
      organic: true,
    },
    {
      id: "4",
      name: "Fresh Carrots",
      price: "₹40",
      originalPrice: "₹50",
      image:
        "https://images.pexels.com/photos/5855239/pexels-photo-5855239.jpeg",
      rating: 4.6,
      discount: "20% OFF",
      unit: "500g",
      organic: true,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-fresh-500 rounded-lg flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-lg md:text-xl font-bold text-fresh-600">
                FreshMart
              </h1>
            </div>

            {/* Desktop Search */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search for products..."
                  className="pl-10 border-fresh-200 focus:border-fresh-400"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 md:space-x-4">
              {/* Mobile Search Toggle */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden p-2"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              >
                <Search className="w-5 h-5" />
              </Button>

              <Button variant="ghost" size="sm" className="relative p-2">
                <Heart className="w-5 h-5" />
                <Badge className="absolute -top-1 -right-1 bg-fresh-500 text-xs px-1 min-w-[18px] h-[18px] flex items-center justify-center rounded-full">
                  2
                </Badge>
              </Button>

              <Button variant="ghost" size="sm" className="relative p-2">
                <ShoppingCart className="w-5 h-5" />
                <Badge className="absolute -top-1 -right-1 bg-fresh-500 text-xs px-1 min-w-[18px] h-[18px] flex items-center justify-center rounded-full">
                  {Object.values(cartItems).reduce(
                    (sum, count) => sum + count,
                    0,
                  )}
                </Badge>
              </Button>

              {isAuthenticated ? (
                <UserDropdown />
              ) : (
                <Button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="bg-fresh-500 hover:bg-fresh-600 text-xs md:text-sm px-3 md:px-4"
                >
                  <span className="hidden sm:inline">Sign In</span>
                  <span className="sm:hidden">Login</span>
                </Button>
              )}
            </div>
          </div>

          {/* Mobile Search Bar */}
          {isSearchOpen && (
            <div className="md:hidden mt-3 pb-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search for products..."
                  className="pl-10 border-fresh-200 focus:border-fresh-400"
                  autoFocus
                />
              </div>
            </div>
          )}
        </div>
      </header>



      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-fresh-50 to-fresh-100 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-fresh-700 mb-4 md:mb-6 leading-tight">
              Fresh Groceries
              <br />
              <span className="text-fresh-500">Delivered Daily</span>
            </h2>
            <p className="text-base md:text-lg text-fresh-600 mb-6 md:mb-8 max-w-2xl mx-auto px-4">
              Get farm-fresh produce, dairy, and essentials delivered to your
              doorstep. Subscribe for regular deliveries and never run out of
              what you need.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center mb-6 md:mb-8 px-4">
              <div className="flex items-center space-x-2 text-fresh-600">
                <Clock className="w-4 h-4 md:w-5 md:h-5" />
                <span className="font-medium text-sm md:text-base">
                  30-min delivery
                </span>
              </div>
              <div className="flex items-center space-x-2 text-fresh-600">
                <Truck className="w-4 h-4 md:w-5 md:h-5" />
                <span className="font-medium text-sm md:text-base">
                  Free delivery above ₹299
                </span>
              </div>
              <div className="flex items-center space-x-2 text-fresh-600">
                <Leaf className="w-4 h-4 md:w-5 md:h-5" />
                <span className="font-medium text-sm md:text-base">
                  100% Fresh guarantee
                </span>
              </div>
            </div>

            <div className="max-w-sm md:max-w-md mx-auto px-4">
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  placeholder="Enter your pincode"
                  className="border-fresh-300 focus:border-fresh-500 h-12 text-base"
                />
                <Button className="bg-fresh-500 hover:bg-fresh-600 h-12 px-6 md:px-8 text-base font-medium whitespace-nowrap">
                  Check
                </Button>
              </div>
            </div>

            {/* PWA Install Button */}
            <div className="mt-6 flex justify-center px-4">
              <PWAInstallButton
                variant="hero"
                className="h-12 px-8 text-base font-medium"
              >
                📱 Install App for Better Experience
              </PWAInstallButton>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-bold text-center mb-8">
            Shop by Category
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
            {categories? categories.map((category) => (
              <Link key={category.name} to={`/categories/${category.id}`} className="group">
                <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer border-fresh-200 hover:border-fresh-300 active:scale-95">
                  <CardContent className="p-4 md:p-6 text-center">
                    <div
                      className={`w-12 h-12 md:w-16 md:h-16 rounded-full ${category.color} flex items-center justify-center mx-auto mb-2 md:mb-3 group-hover:scale-110 transition-transform duration-200`}
                    >
                      <span className="text-xl md:text-2xl">
                        {category.icon}
                      </span>
                    </div>
                    <h4 className="font-medium text-xs md:text-sm text-fresh-700 leading-tight">
                      {category.name}
                    </h4>
                  </CardContent>
                </Card>
              </Link>
            )):<div></div>}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-bold">Today's Fresh Picks</h3>
            <Link to="/products">
              <Button
                variant="outline"
                className="border-fresh-300 text-fresh-600 hover:bg-fresh-50"
              >
                View All
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {featuredProducts.map((product) => (
              <Card
                key={product.id}
                className="hover:shadow-lg transition-all duration-200 border-fresh-200 hover:border-fresh-300 active:scale-[0.98]"
              >
                <CardContent className="p-3 md:p-4">
                  <div className="relative mb-3 md:mb-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-40 md:h-48 object-cover rounded-lg bg-gray-100"
                    />
                    {product.organic && (
                      <Badge className="absolute top-2 left-2 bg-fresh-500">
                        <Leaf className="w-3 h-3 mr-1" />
                        Organic
                      </Badge>
                    )}
                    <Badge className="absolute top-2 right-2 bg-orange-500">
                      {product.discount}
                    </Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute bottom-2 right-2 p-1 h-7 w-7 md:h-8 md:w-8 bg-white/80 hover:bg-white active:scale-90 transition-transform"
                    >
                      <Heart className="w-3 h-3 md:w-4 md:h-4" />
                    </Button>
                  </div>

                  <div className="space-y-1 md:space-y-2">
                    <h4 className="font-medium text-sm md:text-base text-fresh-700 line-clamp-2 leading-tight">
                      {product.name}
                    </h4>
                    <div className="text-xs md:text-sm text-muted-foreground">
                      {product.unit}
                    </div>

                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 md:w-4 md:h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs md:text-sm font-medium">
                        {product.rating}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-base md:text-lg font-bold text-fresh-600">
                        {product.price}
                      </span>
                      <span className="text-xs md:text-sm text-muted-foreground line-through">
                        {product.originalPrice}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      {cartItems[product.id] > 0 ? (
                        <div className="flex items-center space-x-2 w-full justify-center">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-9 w-9 p-0 border-fresh-300 active:scale-90 transition-transform"
                            onClick={() => removeFromCart(product.id)}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="font-medium text-fresh-600 min-w-[24px] text-center text-sm md:text-base">
                            {cartItems[product.id]}
                          </span>
                          <Button
                            size="sm"
                            className="h-9 w-9 p-0 bg-fresh-500 hover:bg-fresh-600 active:scale-90 transition-transform"
                            onClick={() => addToCart(product.id)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          className="w-full h-9 bg-fresh-500 hover:bg-fresh-600 text-sm md:text-base font-medium active:scale-95 transition-transform"
                          onClick={() => addToCart(product.id)}
                        >
                          <span className="hidden sm:inline">Add to Cart</span>
                          <span className="sm:hidden">Add</span>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="text-center">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-fresh-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                <Clock className="w-6 h-6 md:w-8 md:h-8 text-fresh-500" />
              </div>
              <h4 className="text-base md:text-lg font-semibold mb-2">
                Lightning Fast Delivery
              </h4>
              <p className="text-sm md:text-base text-muted-foreground px-2">
                Get your groceries delivered in 30 minutes or less
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-fresh-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                <Leaf className="w-6 h-6 md:w-8 md:h-8 text-fresh-500" />
              </div>
              <h4 className="text-base md:text-lg font-semibold mb-2">
                100% Fresh Guarantee
              </h4>
              <p className="text-sm md:text-base text-muted-foreground px-2">
                Farm fresh produce with quality assurance
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-fresh-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                <Truck className="w-6 h-6 md:w-8 md:h-8 text-fresh-500" />
              </div>
              <h4 className="text-base md:text-lg font-semibold mb-2">
                Free Delivery
              </h4>
              <p className="text-sm md:text-base text-muted-foreground px-2">
                No delivery charges on orders above ₹299
              </p>
            </div>
            <Button
              variant="outline"
              className="w-full border-fresh-300 text-fresh-700 bg-white hover:bg-fresh-50 text-sm md:text-base h-9 md:h-10"
            >
              📱 Google Play
            </Button>
            <Button
              variant="outline"
              className="w-full border-fresh-300 text-fresh-700 bg-white hover:bg-fresh-50 text-sm md:text-base h-9 md:h-10"
            >
              🍎 App Store
            </Button>
            <Button
              variant="outline"
              className="w-full border-fresh-300 text-fresh-700 bg-white hover:bg-fresh-50 text-sm md:text-base h-9 md:h-10"
              onClick={() => {
                // Trigger PWA install by forcing show install banner
                const event = new CustomEvent("pwa-install-request");
                window.dispatchEvent(event);
              }}
            >
              📱 Install App (PWA)
            </Button>
            <p className="text-sm md:text-base">
              &copy; 2024 FreshMart. All rights reserved.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom Navigation */}
      <SimpleBottomNavigation />

      {/* Floating PWA Install Button */}
      <PWAInstallButton variant="floating" className="md:hidden">
        📱 Install
      </PWAInstallButton>

      {/* Bottom padding for mobile navigation */}
      <div className="h-16 md:hidden" />



      {/* Auth Modal */}
      <SimpleAuthModal
        isOpen={isAuthModalOpen}
        onClose={handleModalClose}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
}
