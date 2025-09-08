import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NFTShowcase from "./NFTShowcase";
import Login from "./Login";
import Content from "./Content";
import PublicRoute from "./PublicRoute";
import ProtectedRoute from "./ProtectedRoute";
import { UserProvider } from "./userContext"; // wrap router with context

function Body() {
  const appRouter = createBrowserRouter([
    {
      path: "/",
      element: (
        <PublicRoute>
          <NFTShowcase />
        </PublicRoute>
      ),
    },
    {
      path: "/login",
      element: (
        <PublicRoute>
          <Login />
        </PublicRoute>
      ),
    },
    {
      path: "/content",
      element: (
        <ProtectedRoute>
          <Content />
        </ProtectedRoute>
      ),
    },
  ]);

  return (
    <UserProvider>
      <RouterProvider router={appRouter} />
    </UserProvider>
  );
}

export default Body;
