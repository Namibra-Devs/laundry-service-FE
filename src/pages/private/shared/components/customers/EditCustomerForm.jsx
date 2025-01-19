import CustomButton from "@/components/CustomButton";
import Dropdown from "@/components/Dropdown";
import Input from "@/components/Input";
import useAppContext from "@/hooks/useAppContext";
import useAuth from "@/hooks/useAuth";
import { updateData } from "@/lib/utils/updateData";
import { useEffect } from "react";
import { useState } from "react";

const EditCustomerForm = () => {
  const { currentItem: customer, triggerUpdate, branches } = useAppContext();
  const [branch, setStaffBranch] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);
  const {
    auth: { accessToken },
  } = useAuth();

  const branchesList = [...new Set(branches?.map((branch) => branch))];

  const getBranchName = (branchId) => {
    const branch = branches.find((b) => b._id === branchId);
    return branch?.name || branchId;
  };

  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    phone: "",
    houseNumber: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (customer) {
      setFormData((prev) => ({
        ...prev,
        firstName: customer?.firstName || "",
        middleName: customer?.middleName || "",
        lastName: customer?.lastName || "",
        email: customer?.email || "",
        phone: customer?.phone || "",
        houseNumber: customer?.houseNumber || "",
      }));
      setStaffBranch(customer.branch?._id || "");
    }
  }, [customer]);

  const UpdateCustomer = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    if (
      !formData.firstName ||
      !formData.middleName ||
      !formData.lastName ||
      !formData.email ||
      !formData.phone ||
      !formData.houseNumber
    ) {
      setMessageType("error");
      setMessage("All fields are required.");
      setLoading(false);
      return;
    }

    if (!branch) {
      setMessageType("error");
      setMessage("Branch is required.");
      setLoading(false);
      return;
    }

    try {
      const { data, message } = await updateData(
        "customer",
        customer?._id,
        { ...formData, branch },
        accessToken
      );

      if (message) {
        setMessageType(message.type);
        setMessage(message.text);
      }

      if (data) {
        console.log("Customer updated successfully:", data);
        triggerUpdate("customer");
      }
    } catch (error) {
      console.error("Unexpected error during customer update:", error);
      const errorMessage =
        error?.response?.data?.message || "An unexpected error occurred.";
      setMessageType("error");
      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {message && (
        <p
          className={`${
            messageType === "success" ? "bg-success" : "bg-danger"
          } text-white px-5 py-3 rounded-md text-center w-[90%] mx-auto mt-2`}
        >
          {message}
        </p>
      )}
      <form className="p-4 my-5">
        {loading && (
          <div className="absolute top-0 left-0 w-full h-full bg-black/40 z-10 rounded-lg flex items-center justify-center">
            <div className="h-12 w-12 border-4 border-t-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
          <Input
            label="First Name"
            name="firstName"
            id="firstName"
            value={formData.firstName}
            onChange={handleChange}
            type="text"
          />
          <Input
            label="Middle Name"
            name="middleName"
            id="middleName"
            value={formData.middleName}
            onChange={handleChange}
            type="text"
          />
          <Input
            label="Surname"
            name="lastName"
            id="lastName"
            value={formData.lastName}
            onChange={handleChange}
            type="text"
          />
        </div>

        <Input
          label="Email"
          name="email"
          id="email"
          value={formData.email}
          onChange={handleChange}
          type="email"
        />

        <Input
          label="Phone Number"
          name="phone"
          id="phone"
          value={formData.phone}
          onChange={handleChange}
          type="text"
        />

        <Input
          label="House Number"
          name="houseNumber"
          id="houseNumber"
          value={formData.houseNumber}
          onChange={handleChange}
          type="text"
        />

        <Dropdown
          options={branchesList}
          item={getBranchName(branch)}
          setItem={setStaffBranch}
          label="Branch"
        />

        <div className="mt-10">
          <CustomButton
            label="Update Staff"
            variant="contained"
            onClick={UpdateCustomer}
          />
        </div>
      </form>
    </>
  );
};

export default EditCustomerForm;
