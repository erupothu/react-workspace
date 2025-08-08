import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  ArrowLeft,
  Star,
  Plus,
  Minus,
  Heart,
  Share2,
  Leaf,
  ShoppingCart,
  Truck,
  Shield,
  Clock,
  CheckCircle,
} from "lucide-react";
import { Link, useParams, useLocation } from "react-router-dom";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import BottomNavigation from "@/components/BottomNavigation";

export default function ProductDetail() {
  const { productId } = useParams();
  const [quantity, setQuantity] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const location = useLocation();
  const { product } = location.state || {}; // Destructure data from state,

  // Find the product by ID
  // const product = allProducts.find((p) => p.id === productId);

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-fresh-700 mb-4">Product Not Found</h2>
          <Link to={`/categories/${product.category?.id}`}>
            <Button className="bg-fresh-500 hover:bg-fresh-600">
              Browse Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const addToCart = () => {
    setQuantity(prev => prev + 1);
  };

  const removeFromCart = () => {
    setQuantity(prev => Math.max(prev - 1, 0));
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const shareProduct = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name} on FreshMart`,
        url: window.location.href,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link to="/categories/1">
                <Button variant="ghost" size="sm" className="p-2">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <h2 className="text-lg md:text-xl font-semibold text-fresh-700">
                Product Details
              </h2>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="p-2"
                onClick={shareProduct}
              >
                <Share2 className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "p-2",
                  isFavorite ? "text-red-500" : "text-gray-500"
                )}
                onClick={toggleFavorite}
              >
                <Heart className={cn("w-5 h-5", isFavorite && "fill-current")} />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4 max-w-4xl">
        {/* Image Carousel Section */}
        <div className="relative mb-6">
          <Carousel className="w-full">
            <CarouselContent>
              {product.images.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="aspect-square relative">
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg bg-gray-100"
                      onClick={() => setSelectedImageIndex(index)}
                    />
                    {product.organic && index === 0 && (
                      <Badge className="absolute top-4 left-4 bg-fresh-500">
                        <Leaf className="w-3 h-3 mr-1" />
                        Organic
                      </Badge>
                    )}
                    {product.discount && index === 0 && (
                      <Badge className="absolute top-4 right-4 bg-orange-500">
                        {product.discount}
                      </Badge>
                    )}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2 md:left-4 bg-white/80 hover:bg-white" />
            <CarouselNext className="right-2 md:right-4 bg-white/80 hover:bg-white" />
          </Carousel>

          {/* Image Thumbnails */}
          <div className="flex space-x-2 mt-4 overflow-x-auto">
            {product.images.map((image, index) => (
              <button
                key={index}
                className={cn(
                  "flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg border-2 overflow-hidden",
                  selectedImageIndex === index
                    ? "border-fresh-500"
                    : "border-gray-200"
                )}
                onClick={() => setSelectedImageIndex(index)}
              >
                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Title and Price */}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-fresh-700 mb-2">
              {product.name}
            </h1>
            <div className="flex items-center space-x-2 mb-3">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{product.rating}</span>
                <span className="text-muted-foreground">({product.reviews} reviews)</span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-3xl font-bold text-fresh-600">{product.price}</span>
              <span className="text-lg text-muted-foreground line-through">
                {product.originalPrice}
              </span>
              <Badge className="bg-orange-500">{product.discount}</Badge>
            </div>
            <div className="text-muted-foreground mt-1">Price per {product.unit}</div>
          </div>

          {/* Stock Status */}
          <div className="flex items-center space-x-2">
            {product.inStock ? (
              <>
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-green-600 font-medium">In Stock</span>
                <span className="text-muted-foreground">({product.stockCount} available)</span>
              </>
            ) : (
              <>
                <Clock className="w-5 h-5 text-orange-500" />
                <span className="text-orange-600 font-medium">Out of Stock</span>
              </>
            )}
          </div>

          {/* Description */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-fresh-700 mb-3">Description</h3>
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            </CardContent>
          </Card>

          {/* Benefits */}
          {/* <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-fresh-700 mb-3">Health Benefits</h3>
              <div className="grid grid-cols-2 gap-2">
                {product.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">{benefit}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card> */}

          {/* Nutrition Info */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-fresh-700 mb-3">Nutrition Information</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                <div>
                  <span className="font-medium">Calories:</span>
                  <p className="text-muted-foreground">{product.nutritionInfo.calories}</p>
                </div>
                <div>
                  <span className="font-medium">Protein:</span>
                  <p className="text-muted-foreground">{product.nutritionInfo.protein}</p>
                </div>
                <div>
                  <span className="font-medium">Carbs:</span>
                  <p className="text-muted-foreground">{product.nutritionInfo.carbs}</p>
                </div>
                <div>
                  <span className="font-medium">Fiber:</span>
                  <p className="text-muted-foreground">{product.nutritionInfo.fiber}</p>
                </div>
                <div>
                  <span className="font-medium">Sugar:</span>
                  <p className="text-muted-foreground">{product.nutritionInfo.sugar}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Product Details */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-fresh-700 mb-3">Product Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-2">
                  <Truck className="w-4 h-4 text-fresh-500" />
                  <span className="font-medium">Delivery:</span>
                  <span className="text-muted-foreground">{product.deliveryTime}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-fresh-500" />
                  <span className="font-medium">Origin:</span>
                  <span className="text-muted-foreground">{product.origin}</span>
                </div>
                <div>
                  <span className="font-medium">Storage:</span>
                  <p className="text-muted-foreground mt-1">{product.storage}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Fixed Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 safe-area-padding md:hidden">
        <div className="flex items-center space-x-4">
          {quantity > 0 ? (
            <div className="flex items-center space-x-3 flex-1">
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-10 w-10 p-0 border-fresh-300"
                  onClick={removeFromCart}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="font-medium text-fresh-600 min-w-[40px] text-center">
                  {quantity}
                </span>
                <Button
                  size="sm"
                  className="h-10 w-10 p-0 bg-fresh-500 hover:bg-fresh-600"
                  onClick={addToCart}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <Button
                className="flex-1 bg-fresh-500 hover:bg-fresh-600 h-12"
                disabled={!product.inStock}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>
            </div>
          ) : (
            <Button
              className="flex-1 bg-fresh-500 hover:bg-fresh-600 h-12"
              onClick={addToCart}
              disabled={!product.inStock}
            >
              <Plus className="w-4 h-4 mr-2" />
              {product.inStock ? "Add to Cart" : "Out of Stock"}
            </Button>
          )}
        </div>
      </div>

      {/* Desktop Actions */}
      <div className="hidden md:block fixed bottom-6 right-6">
        {quantity > 0 ? (
          <div className="flex items-center space-x-2 bg-white rounded-full shadow-lg border p-2">
            <Button
              size="sm"
              variant="outline"
              className="h-10 w-10 p-0 border-fresh-300 rounded-full"
              onClick={removeFromCart}
            >
              <Minus className="w-4 h-4" />
            </Button>
            <span className="font-medium text-fresh-600 min-w-[40px] text-center">
              {quantity}
            </span>
            <Button
              size="sm"
              className="h-10 w-10 p-0 bg-fresh-500 hover:bg-fresh-600 rounded-full"
              onClick={addToCart}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <Button
            className="bg-fresh-500 hover:bg-fresh-600 rounded-full h-14 px-6"
            onClick={addToCart}
            disabled={!product.inStock}
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            {product.inStock ? "Add to Cart" : "Out of Stock"}
          </Button>
        )}
      </div>

      {/* Bottom Navigation - Mobile only */}
      <BottomNavigation />
    </div>
  );
}
