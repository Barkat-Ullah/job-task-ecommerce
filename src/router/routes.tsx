import { createBrowserRouter } from "react-router-dom";
import App from "../App";

import ProductDetails from "@/pages/ProductDetails";
import Home from "@/pages/Home";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "product/:id",
        element: <ProductDetails />,
      },
    ],
  },
]);

export default router;
