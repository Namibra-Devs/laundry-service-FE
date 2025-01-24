import { useState } from "react";
import {
  Sidebar as SidebarIcon,
  LayoutDashboard,
  Building2,
  ShoppingCart,
  Users,
  LogOut as LogOutIcon,
  Store,
  ArrowDown,
} from "lucide-react";
import { useAppStore } from "../../lib/store/AppStore";
import { Link } from "react-router-dom";
import useAuth from "@/hooks/useAuth";

const Sidebar = () => {
  const [active, setActive] = useState("dashboard");
  const [subActive, setSubActive] = useState("");
  const [shopOptions, setShopOptions] = useState(false);

  const { sidebar, closeSidebar } = useAppStore((state) => state);

  const {
    auth: { user },
    setAuth,
  } = useAuth();

  return (
    <div
      className={`sidebar bg-dark text-white w-[70%] h-screen lg:h-[97vh] overflow-y-scroll sm:w-[40%] lg:w-[15%] fixed top-0 z-10 lg:relative flex flex-col justify-between transition-all duration-300 lg:pr-2 p-2 lg:p-0 lg:left-0 ${
        sidebar ? "left-0" : "-left-full"
      }`}
    >
      {/* top */}
      <div>
        <div className="flex items-center justify-between bg-[#44444433] p-3 rounded-md mt-5">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-custom_yellow rounded-md"></div>
            <div>
              <h4 className="font-semibold">Company Name</h4>
              <small>company</small>
            </div>
          </div>
          <SidebarIcon onClick={closeSidebar} />
        </div>

        <div className="mt-10">
          <h5 className="text-gray-400">Menu</h5>
          {user?.role === "admin" && (
            <Link
              to="/dashboard"
              onClick={() => {
                setActive("dashboard");
                closeSidebar();
              }}
              className={`sidebarLink ${
                active === "dashboard" ? "active" : ""
              }`}
            >
              <LayoutDashboard />
              <span>Dashboard</span>
            </Link>
          )}
          <Link
            to="/dashboard/orders"
            onClick={() => {
              setActive("orders");
              closeSidebar();
            }}
            className={`sidebarLink ${active === "orders" ? "active" : ""}`}
          >
            <ShoppingCart />
            <span>Orders</span>
          </Link>

          <div>
            <div
              onClick={() => {
                setActive("shop");
                setShopOptions(!shopOptions);
              }}
              className={`sidebarLink cursor-pointer justify-between ${
                active === "shop" ? "active" : ""
              }`}
            >
              <div className="flex items-center space-x-2">
                <Store />
                <span>Store</span>
              </div>
              <ArrowDown className="cursor-pointer" />
            </div>

            <div
              className={`ml-4 ${
                shopOptions && active === "shop" ? "block" : "hidden"
              }`}
            >
              <li
                onClick={() => {
                  setSubActive("items");
                  closeSidebar();
                }}
                className={`sidebarSubLink ${
                  subActive === "items" ? "active" : ""
                }`}
              >
                <Link to="/dashboard/items">Items</Link>
              </li>
              <li
                onClick={() => {
                  setSubActive("customers");
                  closeSidebar();
                }}
                className={`sidebarSubLink ${
                  subActive === "customers" ? "active" : ""
                }`}
              >
                <Link to="/dashboard/customers">Customers</Link>
              </li>
              <li
                onClick={() => {
                  setSubActive("services");
                  closeSidebar();
                }}
                className={`sidebarSubLink ${
                  subActive === "services" ? "active" : ""
                }`}
              >
                <Link to="/dashboard/services">Services</Link>
              </li>
            </div>
          </div>
        </div>
      </div>

      {/* bottom */}
      <div className="mt-10 py-5">
        {user?.role === "admin" && (
          <div>
            <h5 className="text-gray-400">Management</h5>
            <Link
              to="/dashboard/manage-branch"
              onClick={() => {
                setActive("branch_management");
                closeSidebar();
              }}
              className={`sidebarLink ${
                active === "branch_management" ? "active" : ""
              }`}
            >
              <Building2 />
              <span>Branch Management</span>
            </Link>

            <Link
              to="/dashboard/manage-staff"
              onClick={() => {
                setActive("staff_management");
                closeSidebar();
              }}
              className={`sidebarLink ${
                active === "staff_management" ? "active" : ""
              }`}
            >
              <Users />
              <span>Staff Management</span>
            </Link>
          </div>
        )}

        <div className="flex items-center justify-between bg-[#44444433] p-3 rounded-md mt-5">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-custom_yellow rounded-md"></div>
            <p>{user?.role}</p>
          </div>
          <LogOutIcon
            className="cursor-pointer"
            onClick={() => {
              setAuth({});
              window.location = "/";
            }}
          />
        </div>
      </div>
    </div>
  );
};
export default Sidebar;
