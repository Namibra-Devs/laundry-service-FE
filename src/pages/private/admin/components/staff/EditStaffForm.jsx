import CustomButton from "@/components/CustomButton";
import Dropdown from "@/components/Dropdown";
import Input from "@/components/Input";
import useAppContext from "@/hooks/useAppContext";
import useAuth from "@/hooks/useAuth";
import { useStaffForm } from "@/lib/store/PageForms";
import { updateData } from "@/lib/utils/updateData";
import { useEffect } from "react";
import { useState } from "react";
import PropTypes from "prop-types";

const EditStaffForm = ({ refetchFunction }) => {
  const { currentItem: staff } = useAppContext();
  const [branch, setStaffBranch] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);
  const { clearStaffForm } = useStaffForm((state) => state);
  const {
    auth: { accessToken },
  } = useAuth();

  const [formData, setFormData] = useState({
    staffName: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (staff) {
      setFormData({
        staffName: staff.name || "",
        email: staff.email || "",
        password: staff.password || "",
      });
      setStaffBranch(staff.branch?._id || "");
    }
  }, [staff]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const { branches } = useAppContext();

  const branchesList = [...new Set(branches?.map((branch) => branch))];

  const getBranchName = (branchId) => {
    const branch = branches.find((b) => b._id === branchId);
    return branch?.name || branchId;
  };

  const UpdateStaff = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    if (
      !formData?.staffName?.trim() ||
      !formData?.email?.trim() ||
      !formData?.password ||
      !branch
    ) {
      setMessageType("error");
      setMessage("All fields are required.");
      setLoading(false);
      return;
    }

    const updatedStaff = {
      name: formData.staffName.trim(),
      email: formData.email.trim(),
      password: formData.password,
      branch,
    };

    try {
      const { data, message } = await updateData(
        "staff",
        staff?._id,
        updatedStaff,
        accessToken
      );

      if (message) {
        setMessageType(message.type);
        setMessage(message.text);
      }

      if (data) {
        console.log("Staff updated successfully:", data);
        clearStaffForm();
        await refetchFunction();
      }
    } catch (error) {
      console.error("Unexpected error during staff update:", error);
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
        <Input
          label="Staff Name"
          name="staffName"
          id="staffName"
          value={formData?.staffName}
          onChange={handleChange}
          type="text"
        />
        <Input
          label="Email"
          name="staffEmail"
          id="staffEmail"
          value={formData?.email}
          onChange={handleChange}
          type="email"
        />
        <Input
          label="Password"
          name="password"
          id="password"
          value={formData?.password}
          onChange={handleChange}
          type="password"
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
            onClick={UpdateStaff}
          />
        </div>
      </form>
    </>
  );
};

EditStaffForm.propTypes = {
  refetchFunction: PropTypes.func.isRequired,
};

export default EditStaffForm;
