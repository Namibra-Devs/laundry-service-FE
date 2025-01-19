import CustomButton from "@/components/CustomButton";
import Input from "@/components/Input";
import useAppContext from "@/hooks/useAppContext";
import { useEffect } from "react";
import { useState } from "react";
import PropTypes from "prop-types";
import { useBranchForm } from "@/lib/store/PageForms";
import { updateData } from "@/lib/utils/updateData";
import useAuth from "@/hooks/useAuth";
import StringDropdown from "./StringDropdown";

const EditBranchForm = ({ refetchFunction }) => {
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);
  const { currentItem: branch } = useAppContext();
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
    setMessage("");

    if (!formData?.branchName || !formData?.location || !status) {
      setMessageType("error");
      setMessage("All fields are required.");
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
        setMessageType(message?.type);
        setMessage(message?.text);
      }

      if (data) {
        clearBranchForm();
        await refetchFunction();
      }
    } catch (error) {
      console.error("Unexpected error during branch update:", error);
      setMessageType("error");
      setMessage(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
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
        <p>{branch?.location}</p>
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

EditBranchForm.propTypes = {
  refetchFunction: PropTypes.func,
};

export default EditBranchForm;
