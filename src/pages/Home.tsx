/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingCart,
  Heart,
  Filter,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useCart } from "../context/CartContext";
import { type Product, productApi } from "@/components/services/api";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [sortBy, setSortBy] = useState<string>("newest");
  const { dispatch } = useCart();

  const categories = [
    "All",
    "Electronics",
    "Fashion",
    "Beauty",
    "Sports",
    "Home",
  ];

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
    { value: "rating", label: "Highest Rated" },
  ];

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const query: any = {
        sort: sortBy,
        limit: 20,
      };

      if (selectedCategory !== "All") {
        query.category = selectedCategory;
      }

      const response = await productApi.getAllProducts(query);
      console.log("home response", response);

      if (response.status) {
        setProducts(response?.data?.result || []);
      } else {
        throw new Error(response.message || "Failed to fetch products");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch products";
      setError(errorMessage);
      console.error("Error fetching products:", err);
      toast.error("Failed to load products", {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, sortBy]);

  const handleAddToCart = (product: Product) => {
    dispatch({ type: "ADD_TO_CART", payload: product });
    toast.success("Added to cart!", {
      description: `${product.title} has been added to your cart.`,
    });
  };

  const handleWishlist = (product: Product) => {
    toast.success("Added to wishlist!", {
      description: `${product.title} has been added to your wishlist.`,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-violet-600 mx-auto mb-4" />
          <p className="text-lg text-slate-600">Loading amazing products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-md mx-auto bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Something went wrong
          </h3>
          <p className="text-red-600 mb-4">{error}</p>
          <Button
            onClick={fetchProducts}
            variant="outline"
            className="border-red-300 text-red-700 hover:bg-red-50 bg-transparent"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-violet-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-4">
          Discover Premium Products
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          Curated collection of high-quality products designed to elevate your
          lifestyle
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-between items-start sm:items-center">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={
                selectedCategory === category
                  ? "bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-700 hover:to-pink-700"
                  : "hover:bg-violet-50 hover:border-violet-300"
              }
            >
              <Filter className="h-4 w-4 mr-2" />
              {category}
            </Button>
          ))}
        </div>

        {/* Sort Filter */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-600">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Count */}
      <div className="mb-6">
        <p className="text-slate-600">
          Showing {products.length} product{products.length !== 1 ? "s" : ""}
          {selectedCategory !== "All" && ` in ${selectedCategory}`}
        </p>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🛍️</div>
          <h3 className="text-xl font-semibold text-slate-700 mb-2">
            No products found
          </h3>
          <p className="text-slate-500">
            Try adjusting your filters or check back later.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-6">
          {products.map((product) => (
            <Card
              key={product._id}
              className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md hover:scale-105 overflow-hidden"
            >
              <CardContent className="p-0">
                <div className="relative overflow-hidden">
                  <Link to={`/product/${product._id}`}>
                    <img
                      src={
                        product.image || "/placeholder.svg?height=300&width=300"
                      }
                      alt={product.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </Link>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-8 w-8 p-0 bg-white/90 hover:bg-white shadow-lg"
                      onClick={() => handleWishlist(product)}
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Badge variant="destructive" className="text-white">
                        Out of Stock
                      </Badge>
                    </div>
                  )}
                  {product.inStock && (
                    <Badge
                      variant="secondary"
                      className="absolute top-2 left-2 bg-green-100 text-green-800"
                    >
                      In Stock
                    </Badge>
                  )}
                </div>

                <div className="p-4">
                  <Link to={`/product/${product._id}`}>
                    <h3 className="font-semibold text-lg mb-2 hover:text-violet-600 transition-colors line-clamp-2 min-h-[3.5rem]">
                      {product.title}
                    </h3>
                  </Link>

                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-violet-600">
                      ${product.price.toFixed(2)}
                    </span>
                    <Button
                      size="sm"
                      onClick={() => handleAddToCart(product)}
                      disabled={!product.inStock}
                      className="bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
