import useAppContext from "@/hooks/useAppContext";
import { Book } from "lucide-react";
import { User } from "lucide-react";
import { useState } from "react";
import { iconDictionary } from "@/lib/data/IconsDictionary";
// import { DatePicker } from "@/components/ui/DatePicker";

const CustomerDetails = () => {
  const { currentItem: customer } = useAppContext();
  const { firstName, middleName, lastName, email, phone, houseNumber, branch } =
    customer;
  const [active, setActive] = useState("info");
  const [date, setDate] = useState();

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
      <div className="flex-[2] h-[78vh] overflow-y-auto">
        {active === "info" ? (
          <div>
            <div className="flex items-center justify-between bg-gray-100 p-3 rounded-md">
              <h1>Customer Name</h1>
              <p className="font-semibold">{`${firstName} ${middleName} ${lastName}`}</p>
            </div>
            <div className="flex items-center justify-between bg-gray-100 p-3 rounded-md my-3">
              <h1>Email</h1>
              <p className="font-semibold">{email}</p>
            </div>
            <div className="flex items-center justify-between bg-gray-100 p-3 rounded-md">
              <h1>Phone Number</h1>
              <p className="font-semibold">{phone}</p>
            </div>
            <div className="flex items-center justify-between bg-gray-100 p-3 rounded-md my-3">
              <h1>House Number</h1>
              <p className="font-semibold">{houseNumber}</p>
            </div>
            <div className="flex items-center justify-between bg-gray-100 p-3 rounded-md my-3">
              <h1>Branch</h1>
              <p className="font-semibold">{branch?.name}</p>
            </div>
          </div>
        ) : (
          <div>
            <div>date</div>
            {/* <DatePicker date={date} setDate={setDate} /> */}
            <div className="mt-10 bg-gray-100 px-3 py-5 rounded-md">
              <h3>Items</h3>
              <article className="bg-white p-5 my-3 rounded-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <div className="bg-gray-100 w-10 h-10 rounded-full flex items-center justify-center">
                      <img src={iconDictionary["jeans"]} alt="" width={20} />
                    </div>
                    <p>Jeans</p>
                  </div>
                  <p className="text-xl">4</p>
                </div>
              </article>

              <h3>Services</h3>
              <article className="bg-white p-5 my-3 rounded-md">
                <div className="flex items-center justify-between">
                  <p>Wash, Iron</p>
                </div>
              </article>

              <h3>Price</h3>
              <article className="bg-white p-5 my-3 rounded-md">
                <div className="flex items-center justify-between">
                  <p>Wash</p>
                  <p className="text-[17px] font-semibold">GHC20</p>
                </div>
                <div className="flex items-center justify-between mt-5">
                  <p>Iron</p>
                  <p className="text-[17px] font-semibold">GHC20</p>
                </div>
              </article>

              <h3>Bill</h3>
              <article className="bg-white p-5 my-3 rounded-md">
                <div className="flex items-center justify-between">
                  <p>Total</p>
                  <p className="text-[17px] font-semibold">GHC40</p>
                </div>
              </article>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDetails;
