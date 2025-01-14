import { Outlet, Navigate, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import { Sidebar as SidebarIcon } from "lucide-react";
import { useAppStore } from "../../lib/store/AppStore";
import useAuth from "@/hooks/useAuth";

const RequireAuth = () => {
  const location = useLocation();

  const { openSidebar } = useAppStore((state) => state);
  const {
    auth: { user },
  } = useAuth();

  return user ? (
    <div className="flex sm:p-2">
      <Sidebar />
      <main className="flex-[4] bg-white sm:rounded-md py-5 px-2 sm:px-5 h-screen sm:h-[97vh] sm:overflow-y-scroll">
        <SidebarIcon className="lg:hidden block" onClick={openSidebar} />
        <Outlet />
      </main>
    </div>
  ) : (
    <Navigate to="/" state={{ from: location }} replace />
  );
};
export default RequireAuth;
