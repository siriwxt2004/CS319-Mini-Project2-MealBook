import { createBrowserRouter } from "react-router";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import MealDetailPage from "./pages/MealDetailPage";
import Collection from "./pages/Collection";
import Planner from "./pages/Planner";
import About from "./pages/About";

// กำหนดเส้นทาง
export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "recipe/:id",
        element: <MealDetailPage />,
      },
      {
        path: "collection",
        element: <Collection />,
      },
      {
        path: "planner",
        element: <Planner />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "*",
        element: <p className="py-10 text-center">ไม่พบหน้านี้</p>,
      },
    ],
  },
]);
