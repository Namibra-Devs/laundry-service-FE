import CustomButton from "@/components/CustomButton";
import Dropdown from "@/components/Dropdown";
import Input from "@/components/Input";
import useAppContext from "@/hooks/useAppContext";
import useAuth from "@/hooks/useAuth";
import { useStaffForm } from "@/lib/store/PageForms";
import { updateData } from "@/lib/utils/updateData";
import { useEffect } from "react";
import { useState } from "react";

const EditStaffForm = () => {
  const {
    currentItem: staff,
    setAlert,
    branches,
    triggerUpdate,
    closeViewModal,
  } = useAppContext();
  const [branch, setStaffBranch] = useState("");
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

  const branchesList = [...new Set(branches?.map((branch) => branch))];

  const getBranchName = (branchId) => {
    const branch = branches.find((b) => b._id === branchId);
    return branch?.name || branchId;
  };

  const UpdateStaff = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (
      !formData?.staffName?.trim() ||
      !formData?.email?.trim() ||
      !formData?.password ||
      !branch
    ) {
      setAlert((prev) => ({
        ...prev,
        message: "All fields are required",
        type: "warning",
      }));
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
        setAlert((prev) => ({
          ...prev,
          message: message?.text,
          type: message?.type,
        }));
      }

      if (data) {
        console.log("Staff updated successfully:", data);
        setAlert((prev) => ({
          ...prev,
          message: "Staff updated successfully",
          type: "success",
        }));
        clearStaffForm();
        closeViewModal();
        triggerUpdate("staff");
      }
    } catch (error) {
      console.error("Unexpected error during staff update:", error);
      const errorMessage =
        error?.response?.data?.message || "An unexpected error occurred.";
      setAlert((prev) => ({
        ...prev,
        message: errorMessage,
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
          name="email"
          id="email"
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
          options={branchesList.length > 0 ? branchesList : [{}]}
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

export default EditStaffForm;
