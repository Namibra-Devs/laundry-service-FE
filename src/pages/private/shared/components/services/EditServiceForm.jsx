import CustomButton from "@/components/CustomButton";
import Dropdown from "@/components/Dropdown";
import Input from "@/components/Input";
import useAppContext from "@/hooks/useAppContext";
import useAuth from "@/hooks/useAuth";
import { updateData } from "@/lib/utils/updateData";
import { useState } from "react";
import { useEffect } from "react";

const EditServiceForm = () => {
  const {
    currentItem: service,
    branches,
    triggerUpdate,
    setAlert,
    closeViewModal,
  } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [serviceName, setServiceName] = useState("");
  const [serviceBranch, setServiceBranch] = useState("");

  const {
    auth: { accessToken },
  } = useAuth();

  const branchesList = [
    ...new Map(
      branches
        ?.filter((branch) => branch?.status === "active")
        .map((branch) => [branch?._id, branch])
    ).values(),
  ];

  const getBranchName = (branchId) => {
    const branch = branchesList.find((b) => b._id === branchId);
    return branch?.name || branchId;
  };

  useEffect(() => {
    setServiceName(service?.name);
    setServiceBranch(service?.branch?._id);
  }, [service]);

  const UpdateService = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!serviceName || !serviceBranch) {
      setAlert((prev) => ({
        ...prev,
        message: "All fields are required.",
        type: "warning",
      }));
      setLoading(false);
      return;
    }

    try {
      const { data, message } = await updateData(
        "service",
        service?._id,
        { name: serviceName, branch: serviceBranch },
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
        console.log("Service updated:", data);
        setAlert((prev) => ({
          ...prev,
          message: "Service updated",
          type: "success",
        }));
        closeViewModal();
        triggerUpdate("service");
      }
    } catch (error) {
      console.error("Unexpected error during branch update:", error);
      setAlert((prev) => ({
        ...prev,
        message: "Couldn't update service",
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
          label="Service Name"
          name="serviceName"
          id="serviceName"
          value={serviceName}
          onChange={(e) => setServiceName(e.target.value)}
          type="text"
        />
        <Dropdown
          options={branchesList.length > 0 ? branchesList : [{}]}
          item={getBranchName(serviceBranch)}
          setItem={setServiceBranch}
          label="Branch"
        />

        <div className="mt-24">
          <CustomButton
            label="Update Branch"
            variant="contained"
            onClick={UpdateService}
          />
        </div>
      </form>
    </div>
  );
};

export default EditServiceForm;
