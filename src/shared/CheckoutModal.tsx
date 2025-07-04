import type React from "react";
import { useState } from "react";
import { X, CreditCard, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "../context/CartContext";
import { toast } from "sonner";

export default function CheckoutModal() {
  const { state, dispatch } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
  });

  const total = state.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setIsSuccess(true);

    toast.success("Order placed successfully!", {
      description:
        "Thank you for your purchase. You will receive a confirmation email shortly.",
    });

    // Clear cart after successful order
    setTimeout(() => {
      dispatch({ type: "CLEAR_CART" });
      dispatch({ type: "TOGGLE_CHECKOUT" });
      setIsSuccess(false);
      setFormData({ name: "", email: "", address: "" });
    }, 3000);
  };

  const closeModal = () => {
    dispatch({ type: "TOGGLE_CHECKOUT" });
    setIsSuccess(false);
  };

  if (!state.isCheckoutOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-4xl max-h-[95vh] overflow-hidden">
          <Card className="w-full shadow-2xl border-0">
            <CardHeader className="flex flex-row items-center justify-between p-4 sm:p-6 bg-gradient-to-r from-violet-50 to-pink-50">
              <CardTitle className="flex items-center text-lg sm:text-xl">
                <CreditCard className="h-5 w-5 mr-2 text-violet-600" />
                Checkout
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeModal}
                className="hover:bg-white/50 rounded-full"
              >
                <X className="h-5 w-5" />
              </Button>
            </CardHeader>

            <CardContent className="p-4 sm:p-6 max-h-[calc(95vh-80px)] overflow-y-auto">
              {isSuccess ? (
                <div className="text-center py-8 sm:py-12">
                  <CheckCircle className="h-16 w-16 sm:h-20 sm:w-20 text-green-500 mx-auto mb-4" />
                  <h3 className="text-2xl sm:text-3xl font-bold text-green-600 mb-2">
                    Order Placed Successfully!
                  </h3>
                  <p className="text-slate-600 text-sm sm:text-base">
                    Thank you for your purchase. You will receive a confirmation
                    email shortly.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Order Summary */}
                  <div>
                    <h3 className="font-semibold mb-4 text-lg">
                      Order Summary
                    </h3>
                    <div className="space-y-3 max-h-48 overflow-y-auto bg-slate-50 rounded-lg p-4">
                      {state.items.map((item) => (
                        <div
                          key={item._id}
                          className="flex justify-between items-center"
                        >
                          <div className="flex items-center space-x-3">
                            <img
                              src={item.image || "/placeholder.svg"}
                              alt={item.title}
                              className="w-12 h-12 object-cover rounded-lg"
                            />
                            <div>
                              <p className="font-medium text-sm">
                                {item.title}
                              </p>
                              <p className="text-xs text-slate-600">
                                Qty: {item.quantity}
                              </p>
                            </div>
                          </div>
                          <span className="font-medium">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                    <Separator className="my-4" />
                    <div className="flex justify-between items-center font-bold text-xl">
                      <span>Total:</span>
                      <span className="text-violet-600">
                        ${total.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <Separator />

                  {/* Checkout Form */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name" className="text-sm font-medium">
                          Full Name *
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="mt-1"
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-sm font-medium">
                          Email Address *
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="mt-1"
                          placeholder="Enter your email"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="address" className="text-sm font-medium">
                        Shipping Address *
                      </Label>
                      <Textarea
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        className="mt-1"
                        rows={3}
                        placeholder="Enter your complete shipping address"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={closeModal}
                        className="flex-1 bg-transparent"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-700 hover:to-pink-700"
                      >
                        {isSubmitting
                          ? "Processing..."
                          : `Place Order - $${total.toFixed(2)}`}
                      </Button>
                    </div>
                  </form>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
