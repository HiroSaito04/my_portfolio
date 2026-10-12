
import { lazy, Suspense } from "react";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import { ThemeProvider } from "./context/ThemeContext";
import Layout from "./layouts/Layout";

/* =========================================================
   PAGES
========================================================= */

const Home = lazy(() =>
  import("./pages/Home").then((module) => ({
    default: module.Home,
  }))
);

const NotFound = lazy(() =>
  import("./pages/NotFound").then((module) => ({
    default: module.NotFound,
  }))
);

/* =========================================================
   ROUTES
========================================================= */

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

/* =========================================================
   APP
========================================================= */

function App() {
  return (
    <ThemeProvider>
      <Suspense
        fallback={
          <div
            className="page-loading"
            role="status"
            aria-label="Loading portfolio"
          />
        }
      >
        <RouterProvider router={router} />
      </Suspense>
    </ThemeProvider>
  );
}

export default App;
