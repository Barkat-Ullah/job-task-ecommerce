import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { CartProvider } from "./context/CartContext.tsx";
import { RouterProvider } from "react-router-dom";
import router from "./router/routes.tsx";
import { Toaster } from "sonner";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CartProvider>
      <RouterProvider router={router}></RouterProvider>
      <Toaster position="top-right" richColors closeButton duration={3000} />
    </CartProvider>
  </StrictMode>
);
