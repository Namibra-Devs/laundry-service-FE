import CustomButton from "../../../../components/CustomButton";
import { Plus } from "lucide-react";
import SearchInput from "../../../../components/SearchInput";
import Dropdown from "../../../../components/Dropdown";
import ViewToggle from "../components/OrdersViewToggle";
import { useState } from "react";
import OrdersTable from "../components/OrdersTable";
import OrdersContainers from "../components/OrdersContainers";
import useAppContext from "../../../../hooks/useAppContext";
import ViewItemModal from "../../../../components/common/ViewItemModal";
import CreateOrderModal from "../components/CreateOrderModal";

const Orders = () => {
  const [activeMode, setActiveMode] = useState("containers");
  const [currentItemId, setCurrentItemId] = useState(null);
  const [orderModal, setOrderModal] = useState(false);

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

  const { currentForm, viewItem, editItem, isViewModalOpen, closeViewModal } =
    useAppContext();

  const onViewClick = (id) => {
    viewItem("Order");
    setCurrentItemId(id);
  };

  const onEditClick = (id) => {
    editItem("Order");
    setCurrentItemId(id);
  };

  const openOrderModal = () => {
    setOrderModal(true);
  };

  const closeOrderModal = () => {
    setOrderModal(false);
  };

  return (
    <>
      <CreateOrderModal isModalOpen={orderModal} onClose={closeOrderModal} />

      <ViewItemModal
        isModalOpen={isViewModalOpen}
        onClose={closeViewModal}
        section={currentForm || ""}
        currentItemId={currentItemId}
        // onSubmit={() => console.log(`submitting ${currentForm} form`)}
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
            onClick={openOrderModal}
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
        <CustomButton
          label="View Order 1"
          variant="contained"
          onClick={() => onViewClick(1)}
        />
        <CustomButton
          label="View Order 2"
          variant="contained"
          onClick={() => onViewClick(2)}
        />
        <CustomButton
          label="Edit Order 1"
          variant="contained"
          onClick={() => onEditClick(1)}
        />
        <CustomButton
          label="Edit Order 2"
          variant="contained"
          onClick={() => onEditClick(2)}
        />
      </div>
    </>
  );
};
export default Orders;
