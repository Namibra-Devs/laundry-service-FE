import CustomButton from "@/components/CustomButton";
import Input from "@/components/Input";
import useAppContext from "@/hooks/useAppContext";
import { useEffect } from "react";
import { useState } from "react";
import { useBranchForm } from "@/lib/store/PageForms";
import { updateData } from "@/lib/utils/updateData";
import useAuth from "@/hooks/useAuth";
import StringDropdown from "./StringDropdown";

const EditBranchForm = () => {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const {
    currentItem: branch,
    triggerUpdate,
    setAlert,
    closeViewModal,
  } = useAppContext();
  const { clearBranchForm } = useBranchForm((state) => state);

  const {
    auth: { accessToken },
  } = useAuth();

  const [formData, setFormData] = useState({
    branchName: "",
    location: "",
  });

  const statusOptions = ["active", "inactive"];

  useEffect(() => {
    if (branch) {
      setFormData({
        branchName: branch?.name || "",
        location: branch?.location || "",
      });
      setStatus(branch?.status || "");
    }
  }, [branch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const UpdateBranch = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData?.branchName || !formData?.location || !status) {
      setAlert((prev) => ({
        ...prev,
        message: "All fields are required.",
        type: "warning",
      }));
      setLoading(false);
      return;
    }

    const updatedBranch = {
      name: formData?.branchName.trim(),
      location: formData?.location.trim(),
      status,
    };

    try {
      const { data, message } = await updateData(
        "branch",
        branch?._id,
        updatedBranch,
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
        clearBranchForm();
        closeViewModal();
        triggerUpdate("branch");
      }
    } catch (error) {
      console.error("Unexpected error during branch update:", error);
      setAlert((prev) => ({
        ...prev,
        message: error,
        type: "error",
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form className="p-4 my-5">
        {loading && (
          <div className="absolute top-0 left-0 w-full h-full bg-black/40 z-10 rounded-lg flex items-center justify-center">
            <div className="h-12 w-12 border-4 border-t-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
          </div>
        )}
        <Input
          label="Name"
          name="branchName"
          id="name"
          value={formData?.branchName}
          onChange={handleChange}
          type="text"
        />
        <Input
          label="Location"
          name="location"
          id="location"
          value={formData?.location}
          onChange={handleChange}
          type="text"
        />

        <StringDropdown
          options={statusOptions}
          setItem={setStatus}
          item={status}
          label="Status"
        />

        <div className="mt-10">
          <CustomButton
            label="Update Branch"
            variant="contained"
            onClick={UpdateBranch}
          />
        </div>
      </form>
    </div>
  );
};

export default EditBranchForm;
