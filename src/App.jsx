import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/private/admin/pages/Dashboard";
import Orders from "./pages/private/shared/pages/Orders";
import Items from "./pages/private/shared/pages/Items";
import Customers from "./pages/private/shared/pages/Customers";
import Services from "./pages/private/shared/pages/Services";
import BranchManagement from "./pages/private/admin/pages/BranchManagement";
import StaffManagement from "./pages/private/admin/pages/StaffManagement";
import ErrorPage from "./pages/ErrorPage";
import RequireAuth from "./components/common/RequireAuth";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
    errorElement: <ErrorPage />,
  },

  {
    path: "dashboard",
    element: <RequireAuth />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Dashboard />,
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
        element: <BranchManagement />,
      },
      {
        path: "manage-staff",
        element: <StaffManagement />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
