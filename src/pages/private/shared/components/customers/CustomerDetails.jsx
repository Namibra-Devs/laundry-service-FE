import useAppContext from "@/hooks/useAppContext";
import { Book } from "lucide-react";
import { User } from "lucide-react";
import { useState } from "react";

const CustomerDetails = () => {
  const { currentItem: customer } = useAppContext();
  const [active, setActive] = useState("info");

  return (
    <div className="flex gap-3">
      <aside className="flex-[1] border-r-2 border-gray-200 h-full">
        <div
          className={`p-5 border-r-2 ${
            active === "info" && "border-custom_yellow bg-custom_yellow/10 "
          } flex items-center space-x-2 cursor-pointer`}
          onClick={() => setActive("info")}
        >
          <User size={20} />
          <p className="text-sm">Personal Information</p>
        </div>
        <div
          className={`p-5 border-r-2 ${
            active === "history" && "border-custom_yellow bg-custom_yellow/10 "
          } flex items-center space-x-2 cursor-pointer`}
          onClick={() => setActive("history")}
        >
          <Book size={20} />
          <p className="text-sm">History</p>
        </div>
      </aside>
      <div className="flex-[2]">
        {active === "info" ? (
          <div>
            <div className="flex items-center justify-between bg-gray-100 p-3 rounded-md">
              <h1>Quantity</h1>
              <p className="font-semibold">{customer?.firstName}</p>
            </div>
            <div className="flex items-center justify-between bg-gray-100 p-3 rounded-md my-3">
              <h1>Email</h1>
              <p className="font-semibold">{customer?.email}</p>
            </div>
            <div className="flex items-center justify-between bg-gray-100 p-3 rounded-md">
              <h1>Phone Number</h1>
              <p className="font-semibold">{customer?.phone}</p>
            </div>
            <div className="flex items-center justify-between bg-gray-100 p-3 rounded-md my-3">
              <h1>House Number</h1>
              <p className="font-semibold">{customer?.houseNumber}</p>
            </div>
            <div className="flex items-center justify-between bg-gray-100 p-3 rounded-md my-3">
              <h1>Branch</h1>
              <p className="font-semibold">{customer?.branch?.name}</p>
            </div>
          </div>
        ) : (
          <div>history</div>
        )}
      </div>
    </div>
  );
};

export default CustomerDetails;
