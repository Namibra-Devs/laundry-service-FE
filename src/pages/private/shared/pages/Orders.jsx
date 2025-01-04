import CustomButton from "../../../../components/CustomButton";
import { Plus } from "lucide-react";
import SearchInput from "../../../../components/SearchInput";
import Dropdown from "../../../../components/Dropdown";
import ViewToggle from "../components/OrdersViewToggle";
import { useState } from "react";
import OrdersTable from "../components/OrdersTable";
import OrdersContainers from "../components/OrdersContainers";
import CreateItemModal from "../../../../components/common/CreateItemModal";
import useAppContext from "../../../../hooks/useAppContext";

const Orders = () => {
  const [activeMode, setActiveMode] = useState("containers");

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const branches = ["Branch 1", "Branch 2", "Branch 3", "Branch 4"];

  const { isModalOpen, currentForm, openModal, closeModal } = useAppContext();

  return (
    <>
      <CreateItemModal
        isModalOpen={isModalOpen}
        onClose={closeModal}
        section={currentForm || ""}
        onSubmit={() => console.log(`submitting ${currentForm} form`)}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between">
        <div className="mb-3 sm:mb-0">
          <h1 className="font-[700] text-[25px] capitalize">Orders</h1>
          <p>Here is an overview of your dashboard</p>
        </div>

        <div className="flex items-center sm:space-x-2 justify-between sm:justify-start mb-2 sm:mb-0">
          <CustomButton
            label="Add Order"
            icon={<Plus />}
            variant="contained"
            onClick={() => openModal("Order")}
          />
          <div className="sm:hidden block">
            <ViewToggle setActiveMode={setActiveMode} activeMode={activeMode} />
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between">
        <div className="hidden sm:block">
          <ViewToggle setActiveMode={setActiveMode} activeMode={activeMode} />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center space-x-4">
          <SearchInput placeholder="search by employee etc..." />

          <div className="flex items-center space-x-3 mt-2 lg:mt-0">
            <Dropdown options={["Day", ...days]} />
            <Dropdown options={["Branch", ...branches]} />
          </div>
        </div>
      </div>

      <div>
        {activeMode === "table" ? <OrdersTable /> : <OrdersContainers />}
      </div>
    </>
  );
};
export default Orders;
