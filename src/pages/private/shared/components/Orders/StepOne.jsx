import { useState } from "react";
import CustomButton from "../../../../../components/CustomButton";
import Input from "../../../../../components/Input";
import PropTypes from "prop-types";
import useAppContext from "@/hooks/useAppContext";
import { useOrderForm } from "@/lib/store/PageForms";

const FlowTag = () => {
  return (
    <div className="flex items-center justify-between w-[80%] mx-auto">
      <div className="flex flex-col items-center text-custom_yellow_dark">
        <span className="w-8 h-8 rounded-full bg-custom_yellow_dark text-white flex items-center justify-center">
          1
        </span>
        <small>Personal Information</small>
      </div>
      {/* <span className="flex-grow border-t mx-2"></span> */}
      <hr className="w-[5rem] h-[3px] bg-gray-200" />
      <div className="flex flex-col items-center text-gray-400">
        <span className="w-8 h-8 rounded-full bg-gray-500 text-white flex items-center justify-center">
          2
        </span>
        <small>Item Information</small>
      </div>
      <hr className="w-[5rem] h-[3px] bg-gray-200" />
      <div className="flex flex-col items-center text-gray-500">
        <span className="w-8 h-8 rounded-full bg-gray-500 text-white flex items-center justify-center">
          3
        </span>
        <small>Bill Information</small>
      </div>
    </div>
  );
};

const StepOne = ({ onClose, onNext }) => {
  const { data, updateField, setCustomer, resetCustomerForm } = useOrderForm();
  const [isOpen, setIsOpen] = useState(false);
  const [customerOption, setCustomerOption] = useState("existing");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const validateForm = () => {
    if (!data.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setMessage("Invalid email format");
      setMessageType("error");
      return false;
    }

    if (!data.phone.match(/^\d{10}$/)) {
      setMessage("Phone number must be 10 digits");
      setMessageType("error");
      return false;
    }

    return true;
  };

  const handleNext = () => {
    if (customerOption === "new") {
      if (
        !data.firstName ||
        !data.middleName ||
        !data.lastName ||
        !data.email ||
        !data.phone ||
        !data.houseNumber
      ) {
        setMessage("All fields are required");
        setMessageType("error");
        return;
      }
    }

    if (customerOption === "new" && !validateForm()) return;

    if (customerOption === "existing" && !data?.customer) {
      setMessage("Please select a customer");
      setMessageType("error");
      return;
    }

    onNext();
  };

  const { customers } = useAppContext();
  const customersList = [...new Set(customers?.map((customer) => customer))];
  const getCustomerName = (customerId) => {
    const customer = customers.find((c) => c._id === customerId);
    return customer?.firstName + " " + customer?.lastName || customerId;
  };

  return (
    <>
      <FlowTag />

      {message && (
        <p
          className={`${
            messageType === "success" ? "bg-success" : "bg-danger"
          } text-white px-5 py-3 rounded-md text-center w-[90%] mx-auto mt-2`}
        >
          {message}
        </p>
      )}

      <div className="my-5">
        <div className="flex items-center space-x-2 mb-2">
          <input
            type="radio"
            name="itemInfo"
            onChange={() => {
              setCustomerOption("existing");
              resetCustomerForm();
            }}
            checked={customerOption === "existing"}
          />
          <p className="text-[15px]">Select Customer</p>
        </div>

        {customerOption === "new" ? (
          <div className="top-0 left-0 w-full h-10 bg-gray-200"></div>
        ) : (
          <div
            className={`relative text-dark cursor-pointer bg-gray-100 p-5 rounded-md border-2 ${
              customerOption === "existing"
                ? "border-yellow-500"
                : "border-gray-100"
            }`}
          >
            <div
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center justify-between border-2 border-gray-300 rounded-md px-4 py-2 w-full text-sm"
            >
              {data?.customer
                ? getCustomerName(data?.customer)
                : "-- customer --"}
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
                      setCustomer(option?._id);
                      setIsOpen(false);
                    }}
                  >
                    {option?.firstName + " " + option?.lastName}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      <div className="my-5 pb-14">
        <div className="flex items-center space-x-2 mb-2">
          <input
            type="radio"
            name="itemInfo"
            // checked={true}
            onChange={() => {
              setCustomerOption("new");
              setCustomer("");
            }}
          />
          <p className="text-[15px]">Add New Customer</p>
        </div>

        <form
          className={`bg-gray-100 p-5 rounded-md border-2 ${
            customerOption === "new" ? "border-yellow-500" : "border-gray-100"
          }`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
            <Input
              label="First Name"
              name="firstName"
              id="firstName"
              value={data?.firstName}
              onChange={(e) => updateField("firstName", e.target.value)}
              disabled={customerOption === "existing" ? true : false}
              type="text"
            />

            <Input
              label="Middle Name"
              name="middleName"
              id="middleName"
              value={data?.middleName}
              onChange={(e) => updateField("middleName", e.target.value)}
              type="text"
              disabled={customerOption === "existing" ? true : false}
            />
            <Input
              label="Surname"
              name="lastName"
              id="lastName"
              value={data?.lastName}
              onChange={(e) => updateField("lastName", e.target.value)}
              type="text"
              disabled={customerOption === "existing" ? true : false}
            />
          </div>

          <Input
            label="Email"
            name="email"
            id="email"
            value={data?.email}
            onChange={(e) => updateField("email", e.target.value)}
            type="text"
            disabled={customerOption === "existing" ? true : false}
          />
          <Input
            label="Phone Number"
            name="phone"
            id="phone"
            value={data?.phone}
            onChange={(e) => updateField("phone", e.target.value)}
            type="text"
            disabled={customerOption === "existing" ? true : false}
          />
          <Input
            label="House Number"
            name="houseNumber"
            id="houseNumber"
            value={data?.houseNumber}
            onChange={(e) => updateField("houseNumber", e.target.value)}
            type="text"
            disabled={customerOption === "existing" ? true : false}
          />
        </form>
      </div>

      <div className="absolute bottom-0 left-0 px-6 py-4 border-t border-gray-200 flex items-center justify-between w-full bg-white">
        <p onClick={onClose} className="cursor-pointer">
          Cancel
        </p>

        <CustomButton label="Next" variant="contained" onClick={handleNext} />
      </div>
    </>
  );
};

StepOne.propTypes = {
  onClose: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
};

export default StepOne;
