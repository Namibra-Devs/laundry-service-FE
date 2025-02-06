import CustomButton from "@/components/CustomButton";
import Dropdown from "@/components/Dropdown";
import Input from "@/components/Input";
import useAppContext from "@/hooks/useAppContext";
import useAuth from "@/hooks/useAuth";
import { updateData } from "@/lib/utils/updateData";
import { useEffect } from "react";
import { useState } from "react";

const EditCustomerForm = () => {
  const {
    currentItem: customer,
    triggerUpdate,
    branches,
    setAlert,
    closeViewModal,
  } = useAppContext();
  const [branch, setStaffBranch] = useState("");
  const [loading, setLoading] = useState(false);
  const {
    auth: { accessToken },
  } = useAuth();

  const branchesList = [...new Set(branches?.map((branch) => branch))];

  const getBranchName = (branchId) => {
    const branch = branches?.find((b) => b._id === branchId);
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

    if (
      !formData.firstName ||
      !formData.middleName ||
      !formData.lastName ||
      !formData.email ||
      !formData.phone ||
      !formData.houseNumber
    ) {
      setAlert((prev) => ({
        ...prev,
        message: "All fields are required.",
        type: "warning",
      }));
      setLoading(false);
      return;
    }

    if (!branch) {
      setAlert((prev) => ({
        ...prev,
        message: "Branch is required.",
        type: "warning",
      }));
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
        setAlert((prev) => ({
          ...prev,
          message: message?.text,
          type: message?.type,
        }));
      }

      if (data) {
        console.log("Customer updated successfully:", data);
        setAlert((prev) => ({
          ...prev,
          message: "Customer updated",
          type: "success",
        }));
        closeViewModal();
        triggerUpdate("customer");
      }
    } catch (error) {
      console.error("Unexpected error during customer update:", error);
      setAlert((prev) => ({
        ...prev,
        message: "Couldn't update customer",
        type: "error",
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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
          options={branchesList.length > 0 ? branchesList : [{}]}
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
