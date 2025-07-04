const API_BASE_URL = "https://job-task-ecommerce.vercel.app/api";

export interface Product {
  _id: string;
  title: string;
  price: number;
  image: string;
  description: string;
  category: string;
  inStock: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  status: boolean;
  statusCode: number;
  message: string;
  data: {
    result: T;
    meta?: {
      page: number;
      limit: number;
      total: number;
      totalPage: number;
    };
  };
}

export interface SingleApiResponse<T> {
  status: boolean;
  statusCode: number;
  message: string;
  data: T;
}

// Product API calls
export const productApi = {
  getAllProducts: async (query?: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<Product[]>> => {
    const queryParams = new URLSearchParams();
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const response = await fetch(`${API_BASE_URL}/products?${queryParams}`);
    console.log(response);
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }
    return response.json();
  },

  getProductById: async (id: string): Promise<SingleApiResponse<Product>> => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch product");
    }
    return response.json();
  },

  searchProducts: async (
    searchTerm: string
  ): Promise<ApiResponse<Product[]>> => {
    const response = await fetch(
      `${API_BASE_URL}/products?searchTerm=${encodeURIComponent(searchTerm)}`
    );
    if (!response.ok) {
      throw new Error("Failed to search products");
    }
    return response.json();
  },
};

// Order API calls
export const orderApi = {
  createOrder: async (orderData: {
    customerName: string;
    customerEmail: string;
    shippingAddress: string;
    items: { productId: string; quantity: number }[];
  }) => {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      throw new Error("Failed to create order");
    }
    return response.json();
  },
};
