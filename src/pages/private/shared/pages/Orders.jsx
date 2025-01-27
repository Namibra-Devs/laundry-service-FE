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
import DeleteAlert from "@/components/common/DeleteAlert";
import { useEffect } from "react";
import useAuth from "@/hooks/useAuth";
import { useOrderForm } from "@/lib/store/PageForms";
import { createData } from "@/lib/utils/createData";

const Orders = () => {
  const [orderModal, setOrderModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const { data, resetAll } = useOrderForm();
  const { triggerUpdate } = useAppContext();

  const {
    auth: { accessToken },
  } = useAuth();

  const { orders } = useAppContext();
  const [ordersData, setOrdersData] = useState([]);

  useEffect(() => {
    if (Array.isArray(orders)) {
      const reversed = [...orders].reverse();
      setOrdersData(reversed);
    }
  }, [orders]);

  const {
    editItem,
    viewItem,
    setCurrentItem,
    isViewModalOpen,
    closeViewModal,
    currentForm,
    currentItem,
    deleteModal,
    setDeleteModal,
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

  const onDeleteClick = (id) => {
    setSelectedId(id);
    setDeleteModal(true);
  };

  const openOrderModal = () => {
    setOrderModal(true);
  };

  const createOrder = async () => {
    setLoading(true);
    setMessage("");

    let orderData = {};

    let servicesRendered = data?.servicesRendered?.map(({ id, ...rest }) => ({
      serviceItem: rest?.orderItem?._id,
      service: rest?.service,
      isIroned: rest?.isIroned,
      quantity: rest?.quantity,
    }));

    if (data?.customer) {
      orderData = {
        branch: data?.branch,
        customer: data?.customer,
        servicesRendered,
      };
    } else {
      orderData = {
        firstName: data?.firstName,
        lastName: data?.lastName,
        email: data?.email,
        phone: data?.phone,
        houseNumber: data?.houseNumber,
        branch: data?.branch,
        servicesRendered,
      };
    }

    try {
      // console.log(orderData);
      const { data: responseData, message } = await createData(
        "order",
        orderData,
        accessToken
      );
      if (message) {
        setMessage(message.text);
        setMessageType(message.type);
      }
      if (responseData) {
        console.log("Order created successfully:", responseData);
        resetAll();
        setCurrentStep(1);
        triggerUpdate("order");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      setMessage(message?.text);
      setMessageType(message?.type);
    } finally {
      setLoading(false);
    }
  };

  const onClose = () => {
    setOrderModal(false);
    resetAll();
    setMessage("");
    setCurrentStep(1);
  };

  return (
    <>
      <DeleteAlert
        page="order"
        deleteModal={deleteModal}
        setDeleteModal={setDeleteModal}
        itemId={selectedId}
      />

      <CreateOrderModal
        isModalOpen={orderModal}
        onClose={onClose}
        section={currentForm || ""}
        createOrder={createOrder}
        message={message}
        messageType={messageType}
        loading={loading}
        setCurrentStep={setCurrentStep}
        currentStep={currentStep}
      />

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

      <div className="w-screen sm:w-full overflow-auto">
        {activeMode === "table" ? (
          <OrdersTable
            onViewClick={onViewClick}
            onEditClick={onEditClick}
            onDeleteClick={onDeleteClick}
            orders={ordersData || []}
          />
        ) : (
          <OrdersContainers />
        )}
      </div>
    </>
  );
};
export default Orders;
