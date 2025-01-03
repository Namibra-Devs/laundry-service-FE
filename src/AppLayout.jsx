import Sidebar from "./components/common/Sidebar";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <div className="flex p-2">
      <div className="flex-[1]">
        <Sidebar />
      </div>
      <main className="flex-[4] bg-white rounded-md p-2 h-[97vh]">
        <Outlet />
      </main>
    </div>
  );
};
export default AppLayout;
