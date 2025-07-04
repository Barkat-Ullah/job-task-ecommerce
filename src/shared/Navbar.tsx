import { Link } from "react-router-dom";
import type React from "react";
import {
  ShoppingBag,
  Sparkles,
  Search,
  X,
  Plus,
  Minus,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCart } from "../context/CartContext";
import { useState } from "react";
import CheckoutModal from "./CheckoutModal";

export default function Navbar() {
  const { state, dispatch } = useCart();
  const [searchTerm, setSearchTerm] = useState("");
  const itemCount = state.items.reduce(
    (total, item) => total + item.quantity,
    0
  );
  const total = state.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchTerm);
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      dispatch({ type: "REMOVE_FROM_CART", payload: id });
    } else {
      dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
    }
  };

  const removeItem = (id: string) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: id });
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-slate-200 shadow-sm">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="relative">
                <Sparkles className="h-8 w-8 text-violet-600 group-hover:text-violet-700 transition-colors" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full animate-pulse" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">
                LuxeStore
              </span>
            </Link>

            {/* Search Bar - Hidden on mobile */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <form onSubmit={handleSearch} className="w-full relative">
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border-slate-300 focus:border-violet-500 focus:ring-violet-500"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              </form>
            </div>

            {/* Cart Button */}
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => dispatch({ type: "TOGGLE_CART" })}
                className="relative hover:bg-violet-50 hover:border-violet-300 transition-all duration-200 group"
              >
                <ShoppingBag className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                <span className="hidden sm:inline">Cart</span>
                {itemCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-gradient-to-r from-pink-500 to-violet-500 animate-bounce"
                  >
                    {itemCount}
                  </Badge>
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="md:hidden pb-3">
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border-slate-300 focus:border-violet-500 focus:ring-violet-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            </form>
          </div>
        </div>
      </nav>

      {/* Cart Sidebar */}
      {/* Overlay for Cart */}
      {state.isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={() => dispatch({ type: "CLOSE_CART" })}
        />
      )}

      {/* Cart Sidebar */}
      <div
        className={`fixed right-0 top-0 h-full w-full sm:w-96 md:w-[28rem] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
          state.isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b bg-gradient-to-r from-violet-50 to-pink-50">
            <h2 className="text-lg sm:text-xl font-bold flex items-center">
              <ShoppingBag className="h-5 w-5 mr-2 text-violet-600" />
              Shopping Cart
              {itemCount > 0 && (
                <span className="ml-2 bg-violet-600 text-white text-xs px-2 py-1 rounded-full">
                  {itemCount}
                </span>
              )}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => dispatch({ type: "CLOSE_CART" })}
              className="hover:bg-white/50 rounded-full"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Cart Items */}
          <ScrollArea className="flex-1 p-4 sm:p-6">
            {state.items.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <div className="w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
                  <ShoppingBag className="h-8 w-8 sm:h-12 sm:w-12 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-700 mb-2">
                  Your cart is empty
                </h3>
                <p className="text-slate-500 text-sm mb-6">
                  Add some products to get started
                </p>
                <Button
                  onClick={() => dispatch({ type: "CLOSE_CART" })}
                  className="bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-700 hover:to-pink-700"
                >
                  Continue Shopping
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {state.items.map((item) => (
                  <Card
                    key={item._id}
                    className="border-slate-200 hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex items-start space-x-3 sm:space-x-4">
                        <div className="relative flex-shrink-0">
                          <img
                            src={
                              item.image ||
                              "/placeholder.svg?height=80&width=80"
                            }
                            alt={item.title}
                            className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg"
                          />
                          <Button
                            size="sm"
                            variant="destructive"
                            className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 h-5 w-5 sm:h-6 sm:w-6 p-0 rounded-full text-xs"
                            onClick={() => removeItem(item._id)}
                          >
                            <Trash2 className="h-2 w-2 sm:h-3 sm:w-3" />
                          </Button>
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm sm:text-base line-clamp-2 mb-1">
                            {item.title}
                          </h3>
                          <p className="text-violet-600 font-bold text-base sm:text-lg">
                            ${item.price.toFixed(2)}
                          </p>

                          <div className="flex items-center justify-between mt-2 sm:mt-3">
                            <div className="flex items-center space-x-1 sm:space-x-2 bg-slate-100 rounded-lg p-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() =>
                                  updateQuantity(item._id, item.quantity - 1)
                                }
                                className="h-5 w-5 sm:h-6 sm:w-6 p-0 hover:bg-white"
                              >
                                <Minus className="h-2 w-2 sm:h-3 sm:w-3" />
                              </Button>
                              <span className="w-6 sm:w-8 text-center font-medium text-xs sm:text-sm">
                                {item.quantity}
                              </span>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() =>
                                  updateQuantity(item._id, item.quantity + 1)
                                }
                                className="h-5 w-5 sm:h-6 sm:w-6 p-0 hover:bg-white"
                              >
                                <Plus className="h-2 w-2 sm:h-3 sm:w-3" />
                              </Button>
                            </div>

                            <div className="text-right">
                              <p className="text-sm sm:text-base font-bold">
                                ${(item.price * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>

          {/* Footer */}
          {state.items.length > 0 && (
            <div className="border-t bg-slate-50 p-4 sm:p-6 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal ({itemCount} items)</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-violet-600">${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Button
                  size="lg"
                  onClick={() => dispatch({ type: "TOGGLE_CHECKOUT" })}
                  className="w-full bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-700 hover:to-pink-700"
                >
                  Proceed to Checkout
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => dispatch({ type: "CLOSE_CART" })}
                  className="w-full"
                >
                  Continue Shopping
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <CheckoutModal />
    </>
  );
}
