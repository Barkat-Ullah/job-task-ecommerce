import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ShoppingCart,
  Heart,
  Truck,
  Shield,
  RotateCcw,
  Loader2,
  AlertTriangle,
  Plus,
  Minus,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useCart } from "../context/CartContext";
import { Product, productApi } from "@/components/services/api";

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { dispatch } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setError("Product ID is required");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await productApi.getProductById(id);

        if (response.status) {
          setProduct(response?.data);
        } else {
          throw new Error(response.message || "Failed to fetch product");
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch product";
        setError(errorMessage);
        console.error("Error fetching product:", err);
        toast.error("Failed to load product", {
          description: errorMessage,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      // Add multiple quantities to cart
      for (let i = 0; i < quantity; i++) {
        dispatch({ type: "ADD_TO_CART", payload: product });
      }

      toast.success("Added to cart!", {
        description: `${quantity} x ${product.title} added to your cart.`,
      });
    }
  };

  const handleBuyNow = () => {
    if (product) {
      handleAddToCart();
      dispatch({ type: "OPEN_CART" });
    }
  };

  const handleShare = async () => {
    if (navigator.share && product) {
      try {
        await navigator.share({
          title: product.title,
          text: product.description,
          url: window.location.href,
        });
      } catch (err) {
        console.error(err);
        // Fallback to copying URL
        navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied!", {
          description: "Product link has been copied to clipboard.",
        });
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied!", {
        description: "Product link has been copied to clipboard.",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-violet-600 mx-auto mb-4" />
          <p className="text-lg text-slate-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-md mx-auto bg-red-50 border border-red-200 rounded-lg p-6 text-center mb-6">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Product not found
          </h3>
          <p className="text-red-600 mb-4">
            {error || "The product you're looking for doesn't exist."}
          </p>
        </div>
        <div className="text-center">
          <Button onClick={() => navigate("/")} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  // Simulate multiple images (in real app, this would come from API)
  const images = [product.image, product.image, product.image];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-slate-600 mb-8">
        <Link to="/" className="hover:text-violet-600 transition-colors">
          Home
        </Link>
        <span>/</span>
        <span className="text-slate-400">{product.category}</span>
        <span>/</span>
        <span className="text-slate-900 font-medium truncate">
          {product.title}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square rounded-2xl overflow-hidden bg-slate-100 relative group">
            <img
              src={
                images[selectedImage] || "/placeholder.svg?height=600&width=600"
              }
              alt={product.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <Button
              variant="secondary"
              size="sm"
              className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Thumbnail Images */}
          <div className="flex space-x-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                  selectedImage === index
                    ? "border-violet-600 ring-2 ring-violet-200"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <img
                  src={image || "/placeholder.svg?height=80&width=80"}
                  alt={`${product.title} ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <Badge variant="secondary" className="mb-2">
              {product.category}
            </Badge>
            <h1 className="text-3xl font-bold text-slate-900 mb-4">
              {product.title}
            </h1>

            <div className="text-4xl font-bold text-violet-600 mb-6">
              ${product.price.toFixed(2)}
            </div>
          </div>

          <Separator />

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Description</h3>
            <p className="text-slate-600 leading-relaxed">
              {product.description}
            </p>
          </div>

          <Separator />

          {/* Quantity Selector */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium">Quantity:</span>
              <div className="flex items-center border border-slate-300 rounded-lg">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="h-10 w-10 p-0"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="px-4 py-2 font-medium min-w-[3rem] text-center">
                  {quantity}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                  className="h-10 w-10 p-0"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Stock Status */}
            {product.inStock ? (
              <div className="flex items-center text-green-600">
                <div className="w-2 h-2 bg-green-600 rounded-full mr-2 animate-pulse"></div>
                <span className="text-sm font-medium">
                  In Stock - Ready to Ship
                </span>
              </div>
            ) : (
              <div className="flex items-center text-red-600">
                <div className="w-2 h-2 bg-red-600 rounded-full mr-2"></div>
                <span className="text-sm font-medium">Out of Stock</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="flex-1 bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-700 hover:to-pink-700 text-white disabled:opacity-50"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Add to Cart
            </Button>
            <Button
              size="lg"
              onClick={handleBuyNow}
              disabled={!product.inStock}
              variant="outline"
              className="flex-1 hover:bg-violet-50 hover:border-violet-300 bg-transparent"
            >
              Buy Now
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="hover:bg-violet-50 hover:border-violet-300 bg-transparent"
            >
              <Heart className="h-5 w-5" />
            </Button>
          </div>

          <Separator />

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="border-slate-200">
              <CardContent className="p-4 text-center">
                <Truck className="h-6 w-6 text-violet-600 mx-auto mb-2" />
                <p className="text-sm font-medium">Free Shipping</p>
                <p className="text-xs text-slate-600">On orders over $100</p>
              </CardContent>
            </Card>
            <Card className="border-slate-200">
              <CardContent className="p-4 text-center">
                <Shield className="h-6 w-6 text-violet-600 mx-auto mb-2" />
                <p className="text-sm font-medium">2 Year Warranty</p>
                <p className="text-xs text-slate-600">Full coverage</p>
              </CardContent>
            </Card>
            <Card className="border-slate-200">
              <CardContent className="p-4 text-center">
                <RotateCcw className="h-6 w-6 text-violet-600 mx-auto mb-2" />
                <p className="text-sm font-medium">30-Day Returns</p>
                <p className="text-xs text-slate-600">No questions asked</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
