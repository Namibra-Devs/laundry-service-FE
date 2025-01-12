import CustomButton from "../../../../components/CustomButton";
import { Plus } from "lucide-react";
import ViewToggle from "../components/OrdersViewToggle";
import { useState } from "react";
import { OrdersTable } from "../components/Orders/OrdersTable";
import OrdersContainers from "../components/OrdersContainers";
import useAppContext from "../../../../hooks/useAppContext";
import ViewItemModal from "../../../../components/common/ViewItemModal";
import CreateOrderModal from "../components/CreateOrderModal";
import Filters from "../components/Orders/Filters";
import { useOrders } from "@/lib/store/OrdersStore";

const Orders = () => {
  const [orderModal, setOrderModal] = useState(false);

  const {
    viewItem,
    editItem,
    setCurrentItem,
    isViewModalOpen,
    closeViewModal,
    currentForm,
    currentItem,
  } = useAppContext();

  const { activeMode } = useOrders((state) => state);

  const onViewClick = (orderItem) => {
    viewItem("Order");
    setCurrentItem(orderItem);
  };

  const onEditClick = (orderItem) => {
    editItem("Order");
    setCurrentItem(orderItem);
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
        currentItem={currentItem}
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
            <ViewToggle />
          </div>
        </div>
      </div>

      {activeMode === "containers" && <Filters />}

      <div>
        {activeMode === "table" ? (
          <OrdersTable onViewClick={onViewClick} onEditClick={onEditClick} />
        ) : (
          <OrdersContainers />
        )}
      </div>
    </>
  );
};
export default Orders;
