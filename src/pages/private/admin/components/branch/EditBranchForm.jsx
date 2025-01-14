import CustomButton from "@/components/CustomButton";
import Dropdown from "@/components/Dropdown";
import Input from "@/components/Input";
import useAppContext from "@/hooks/useAppContext";
import useAuth from "@/hooks/useAuth";
import { useBranchForm } from "@/lib/store/PageForms";
import { updateData } from "@/lib/utils/updateData";
import { useEffect } from "react";
import { useState } from "react";
import PropTypes from "prop-types";

const EditBranchForm = ({ refetchFunction }) => {
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const { currentItem: branch } = useAppContext();
  const {
    auth: { accessToken },
  } = useAuth();

  const { clearBranchForm } = useBranchForm((state) => state);

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

  const handleUpdateBranch = async (e) => {
    e.preventDefault();

    const newInfo = {
      name: formData?.branchName,
      location: formData?.location,
      status,
    };

    setMessage("");
    setLoading(true);

    if (!formData?.branchName || !formData?.location || !status) {
      setMessageType("error");
      setMessage("All fields are required");
      setLoading(false);
      return;
    }

    try {
      const { data, message } = await updateData(
        "branch",
        branch?._id,
        newInfo,
        accessToken
      );

      if (message?.type === "success") {
        console.log("Success:", data);
        await refetchFunction();
        setMessageType("success");
        setMessage(message?.text);
        clearBranchForm();
      } else {
        console.error("Error:", message?.text);
        setMessageType("error");
        setMessage(message?.text);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      setMessageType("error");
      setMessage("An unexpected error occurred. Please try again.");
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
        <Dropdown
          options={statusOptions}
          setItem={setStatus}
          item={status}
          label="Status"
        />

        <div className="mt-10">
          <CustomButton
            label="Update Branch"
            variant="contained"
            onClick={handleUpdateBranch}
          />
        </div>
      </form>
    </div>
  );
};

EditBranchForm.propTypes = {
  refetchFunction: PropTypes.func.isRequired,
};
export default EditBranchForm;
