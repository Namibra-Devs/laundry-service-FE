import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy, Suspense } from "react";
import SuspenseLayout from "./components/common/SuspenseLayout";
import Alert from "./components/common/Alert";
import useAppContext from "./hooks/useAppContext";
import { useEffect } from "react";

const Login = lazy(() => import("./pages/Login"));
const Unauthorized = lazy(() => import("./pages/Unauthorized"));
const Dashboard = lazy(() => import("./pages/private/admin/pages/Dashboard"));
const Orders = lazy(() => import("./pages/private/shared/pages/Orders"));
const Items = lazy(() => import("./pages/private/shared/pages/Items"));
const Customers = lazy(() => import("./pages/private/shared/pages/Customers"));
const Services = lazy(() => import("./pages/private/shared/pages/Services"));
const BranchManagement = lazy(() =>
  import("./pages/private/admin/pages/BranchManagement")
);
const StaffManagement = lazy(() =>
  import("./pages/private/admin/pages/StaffManagement")
);
const ErrorPage = lazy(() => import("./pages/ErrorPage"));
const RequireAuth = lazy(() => import("./components/common/RequireAuth"));
const AdminProtected = lazy(() => import("./components/common/AdminProtected"));

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
    element: (
      <Suspense fallback={<SuspenseLayout />}>
        <RequireAuth />
      </Suspense>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<SuspenseLayout />}>
            <AdminProtected>
              <Dashboard />
            </AdminProtected>
          </Suspense>
        ),
      },
      {
        path: "orders",
        element: (
          <Suspense fallback={<SuspenseLayout />}>
            <Orders />
          </Suspense>
        ),
      },
      {
        path: "items",
        element: (
          <Suspense fallback={<SuspenseLayout />}>
            <Items />
          </Suspense>
        ),
      },
      {
        path: "customers",
        element: (
          <Suspense fallback={<SuspenseLayout />}>
            <Customers />
          </Suspense>
        ),
      },
      {
        path: "services",
        element: (
          <Suspense fallback={<SuspenseLayout />}>
            <Services />
          </Suspense>
        ),
      },
      {
        path: "manage-branch",
        element: (
          <Suspense fallback={<SuspenseLayout />}>
            <AdminProtected>
              <BranchManagement />
            </AdminProtected>
          </Suspense>
        ),
      },
      {
        path: "manage-staff",
        element: (
          <Suspense fallback={<SuspenseLayout />}>
            <AdminProtected>
              <StaffManagement />
            </AdminProtected>
          </Suspense>
        ),
      },
    ],
  },
]);

function App() {
  const { alert, setAlert } = useAppContext();

  useEffect(() => {
    if (!alert.message) return;

    const timeoutId = setTimeout(() => {
      setAlert((prev) => ({ ...prev, message: "" }));
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [alert.message, setAlert]);

  return (
    <>
      {alert.message && <Alert message={alert.message} type={alert.type} />}
      <RouterProvider router={router} />
    </>
  );
}

export default App;
