import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router";

const Home = React.lazy(() => import("./Pages/Home"));
const InfoId = React.lazy(() => import("./Pages/InfoId"));
const Layout = React.lazy(() => import("./Layout/Layout"));

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        { index: true, element: <Home /> },
        { path: "info/:id", element: <InfoId /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default App;
