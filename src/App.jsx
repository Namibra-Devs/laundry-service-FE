import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Login from "./pages/Login";
import Unauthorized from "./pages/Unauthorized";
import Dashboard from "./pages/private/admin/pages/Dashboard";
import Orders from "./pages/private/shared/pages/Orders";
import Items from "./pages/private/shared/pages/Items";
import Customers from "./pages/private/shared/pages/Customers";
import Services from "./pages/private/shared/pages/Services";
import BranchManagement from "./pages/private/admin/pages/BranchManagement";
import StaffManagement from "./pages/private/admin/pages/StaffManagement";
import ErrorPage from "./pages/ErrorPage";
import RequireAuth from "./components/common/RequireAuth";
import AdminProtected from "./components/common/AdminProtected";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
    errorElement: <ErrorPage />,
  },

  {
    path: "/unauthorized",
    element: <Unauthorized />,
    errorElement: <ErrorPage />,
  },

  {
    path: "dashboard",
    element: <RequireAuth />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: (
          <AdminProtected>
            <Dashboard />
          </AdminProtected>
        ),
      },
      {
        path: "orders",
        element: <Orders />,
      },
      {
        path: "items",
        element: <Items />,
      },
      {
        path: "customers",
        element: <Customers />,
      },
      {
        path: "services",
        element: <Services />,
      },
      {
        path: "manage-branch",
        element: (
          <AdminProtected>
            <BranchManagement />
          </AdminProtected>
        ),
      },
      {
        path: "manage-staff",
        element: (
          <AdminProtected>
            <StaffManagement />
          </AdminProtected>
        ),
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
