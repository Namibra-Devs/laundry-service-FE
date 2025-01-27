import Dropdown from "@/components/Dropdown";
import useAppContext from "@/hooks/useAppContext";
import { useState } from "react";
import CustomButton from "@/components/CustomButton";
import EditItemBox from "./Orders/EditItemBox";
import { Plus } from "lucide-react";
import { updateData } from "@/lib/utils/updateData";
import useAuth from "@/hooks/useAuth";

const EditOrder = () => {
  const { currentItem: order, triggerUpdate } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);
  // const { updateField, resetCustomerForm } = useOrderForm();

  const {
    auth: { accessToken },
  } = useAuth();

  const { customers, branches } = useAppContext();

  const customersList = [...new Set(customers?.map((customer) => customer))];
  const branchesList = [...new Set(branches?.map((branch) => branch))];

  const getCustomerName = (customerId) => {
    const customer = customers.find((c) => c._id === customerId);
    return customer?.firstName + " " + customer?.lastName || customerId;
  };

  const getBranchName = (branchId) => {
    const branch = branches.find((b) => b._id === branchId);
    return branch?.name || branchId;
  };

  // const statusOptions = ["pending", "in_progress", "completed", "delivered"];

  const [branch, setBranch] = useState(order?.branch?._id || "");
  const [customer, setCustomer] = useState(order?.customer?._id || "");
  // const [status, setStatus] = useState(order?.status || "");
  const [servicesRendered, setServicesRendered] = useState(
    order?.servicesRendered || []
  );

  const addOrderItem = (index) => {
    setServicesRendered((prev) => [
      ...prev,
      {
        id: index,
        serviceItem: "",
        service: "",
        quantity: 1,
        isIroned: false,
      },
    ]);
  };

  const handleDeleteItem = (id) => {
    setServicesRendered((prev) => prev.filter((item) => item.id !== id));
  };

  const updateOrder = async () => {
    setLoading(true);
    setMessage("");

    if (!branch) {
      setMessage("Branch is required.");
      setMessageType("error");
      setLoading(false);
      return;
    }

    if (!customer) {
      setMessage("Customer is required.");
      setMessageType("error");
      setLoading(false);
      return;
    }

    if (servicesRendered === undefined || servicesRendered.length === 0) {
      setMessage("Add at least 1 item.");
      setMessageType("error");
      setLoading(false);
      return;
    }

    const invalidServices = servicesRendered.filter(
      ({ serviceItem, service, quantity }) =>
        !serviceItem?._id || !service || quantity === undefined || quantity < 1
    );

    if (invalidServices.length > 0) {
      setMessage("Some items have invalid or missing data:", invalidServices);
      setMessageType("error");
      setLoading(false);
      return;
    }

    const orderData = {
      branch,
      customer,
      servicesRendered: servicesRendered.map(
        ({ serviceItem, service, quantity, isIroned }) => ({
          serviceItem: serviceItem?._id,
          service,
          quantity,
          isIroned: isIroned || false,
        })
      ),
    };

    try {
      console.log(orderData);
      const { data, message } = await updateData(
        "order",
        order?._id,
        orderData,
        accessToken
      );

      if (message) {
        setMessageType(message?.type);
        setMessage(message?.text);
      }

      if (data) {
        triggerUpdate("order");
      }
    } catch (error) {
      console.error("Unexpected error during order update:", error);
      setMessageType("error");
      setMessage(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form>
        {loading && (
          <div className="absolute top-0 left-0 w-full h-full bg-black/40 z-10 rounded-lg flex items-center justify-center">
            <div className="h-12 w-12 border-4 border-t-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
          </div>
        )}
        <div className="mb-5">
          <p className="block text-sm">Customer</p>
          <div className="text-dark cursor-pointer relative">
            <div
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center justify-between border-2 border-gray-300 rounded-md px-4 py-2 w-full text-sm"
            >
              {customer ? getCustomerName(customer) : "-- customer --"}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
            {isOpen && (
              <ul className="absolute z-10 bg-white border border-gray-300 rounded-md mt-1 w-fit">
                {customersList?.map((option, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer w-[10rem]"
                    onClick={() => {
                      setCustomer(option._id);
                      setIsOpen(false);
                    }}
                  >
                    {option?.firstName + " " + option?.lastName}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <Dropdown
          options={branchesList}
          // item={getBranchName(order?.branch?._id)}
          item={getBranchName(branch)}
          setItem={setBranch}
          label="Branch"
        />

        {/* <div className="my-5">
          <p className="block text-sm">Order Date</p>
          <input
            type="date"
            id="date"
            name="tripDate"
            value={order?.createdAt?.split("T")[0] || ""}
            required
            onChange={() => {}}
            className="mt-1 block w-full p-2 border-2 rounded-md border-gray-300"
          />
        </div> */}

        {/* <StringDropdown
          options={statusOptions}
          item={status}
          setItem={setStatus}
          label="Status"
        /> */}

        <div className="flex items-center justify-end my-5">
          <span
            className="flex items-center space-x-1 cursor-pointer"
            onClick={() => {
              if (!order?.branch) {
                setMessage("Branch is required");
                setMessageType("error");
                return;
              } else setMessage("");
              addOrderItem(new Date().getTime());
            }}
          >
            <Plus size={20} />
            <p className="text-[12px]">Add New Item</p>
          </span>
        </div>

        <div>
          {servicesRendered?.map((item) => (
            <EditItemBox
              key={item._id}
              item={item}
              onUpdateItem={(id, changes) => {
                setServicesRendered((prev) =>
                  prev.map((it) => (it.id === id ? { ...it, ...changes } : it))
                );
              }}
              onDeleteItem={() => handleDeleteItem(item?.id)}
            />
          ))}
        </div>

        <div className="mt-10">
          <CustomButton
            label="Update Staff"
            variant="contained"
            onClick={updateOrder}
          />
        </div>

        {message && (
          <p
            className={`${
              messageType === "success" ? "bg-success" : "bg-danger"
            } text-white px-5 py-3 rounded-md text-center w-[90%] sm:w-[40%] mx-auto mt-2 fixed top-0 left-1/2 -translate-x-1/2`}
          >
            {message}
          </p>
        )}
      </form>
    </>
  );
};

export default EditOrder;
