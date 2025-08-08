import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Leaf, ArrowLeft, Plus, Minus, Trash2 } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import React, { useContext } from "react";
import { cn } from "@/lib/utils";
import BottomNavigation from "@/components/BottomNavigation";
import { MyContext } from "@/App";

export default function Basket() {
  const { data, setData } = useContext(MyContext);
  const location = useLocation();
  const { cartProducts } = location.state || {}; // Destructure data from state,
  const [cartItems, setCartItems] = React.useState(data.cartItemsData || []);

  const updateQuantity = (id: string, change: number) => {
    setCartItems((items) =>
      items
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(0, item.quantity + change) }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const removeItem = (id: string) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const deliveryFee = total >= 299 ? 0 : 30;
  const finalTotal = total + deliveryFee;

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 md:space-x-4">
              <Link to="/">
                <Button variant="ghost" size="sm" className="p-2">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 md:w-8 md:h-8 bg-fresh-500 rounded-lg flex items-center justify-center">
                  <Leaf className="w-3 h-3 md:w-5 md:h-5 text-white" />
                </div>
                <h1 className="text-lg md:text-xl font-bold text-fresh-600">
                  FreshMart
                </h1>
              </div>
            </div>
            <h2 className="text-lg font-semibold text-fresh-700">My Basket</h2>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-fresh-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">🛒</span>
            </div>
            <h3 className="text-xl font-semibold text-fresh-700 mb-4">
              Your basket is empty
            </h3>
            <p className="text-muted-foreground mb-6">
              Add some fresh groceries to get started!
            </p>
            <Link to="/categories">
              <Button className="bg-fresh-500 hover:bg-fresh-600">
                Start Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                <h3 className="text-lg font-semibold text-fresh-700 mb-4">
                  Items in your basket ({cartItems.length})
                </h3>

                {cartItems.map((item) => (
                  <Card key={item.id} className="border-fresh-200">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg bg-gray-100"
                        />

                        <div className="flex-1">
                          <h4 className="font-medium text-fresh-700 mb-1">
                            {item.name}
                          </h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            {item.unit}
                          </p>
                          <p className="text-lg font-bold text-fresh-600">
                            ₹{item.price}
                          </p>
                        </div>

                        <div className="flex flex-col items-end space-y-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                            className="text-red-500 hover:text-red-600 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>

                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0 border-fresh-300"
                              onClick={() => updateQuantity(item.id, -1)}
                            >
                              <Minus className="w-3 h-3" />
                            </Button>

                            <span className="font-medium text-fresh-600 min-w-[24px] text-center">
                              {item.quantity}
                            </span>

                            <Button
                              size="sm"
                              className="h-8 w-8 p-0 bg-fresh-500 hover:bg-fresh-600"
                              onClick={() => updateQuantity(item.id, 1)}
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="border-fresh-200 sticky top-24">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-fresh-700 mb-4">
                      Order Summary
                    </h3>

                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-medium">₹{total}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Delivery Fee
                        </span>
                        <span
                          className={cn(
                            "font-medium",
                            deliveryFee === 0 ? "text-green-600" : "",
                          )}
                        >
                          {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                        </span>
                      </div>

                      {deliveryFee > 0 && (
                        <p className="text-xs text-fresh-600">
                          Add ₹{299 - total} more for free delivery
                        </p>
                      )}

                      <div className="border-t pt-3">
                        <div className="flex justify-between text-lg font-bold">
                          <span>Total</span>
                          <span className="text-fresh-600">₹{finalTotal}</span>
                        </div>
                      </div>
                    </div>

                    <Button className="w-full bg-fresh-500 hover:bg-fresh-600 h-12 text-base font-medium">
                      Proceed to Checkout
                    </Button>

                    <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                      <span>🚚</span>
                      <span>Delivery in 30 minutes</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}
