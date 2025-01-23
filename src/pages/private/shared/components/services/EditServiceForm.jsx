import CustomButton from "@/components/CustomButton";
import Dropdown from "@/components/Dropdown";
import Input from "@/components/Input";
import useAppContext from "@/hooks/useAppContext";
import useAuth from "@/hooks/useAuth";
import { updateData } from "@/lib/utils/updateData";
import { useState } from "react";
import { useEffect } from "react";

const EditServiceForm = () => {
  const { currentItem: service, branches, triggerUpdate } = useAppContext();
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);
  const [serviceName, setServiceName] = useState("");
  const [serviceBranch, setServiceBranch] = useState("");

  const {
    auth: { accessToken },
  } = useAuth();

  const branchesList = [...new Set(branches?.map((branch) => branch))];

  const getBranchName = (branchId) => {
    const branch = branches.find((b) => b._id === branchId);
    return branch?.name || branchId;
  };

  useEffect(() => {
    setServiceName(service?.name);
    setServiceBranch(service?.branch);
  }, [service]);

  const UpdateService = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!serviceName || !serviceBranch) {
      setMessageType("error");
      setMessage("All fields are required.");
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
        setMessageType(message?.type);
        setMessage(message?.text);
      }

      if (data) {
        triggerUpdate("service");
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
        <Input
          label="Service Name"
          name="serviceName"
          id="serviceName"
          value={serviceName}
          onChange={(e) => setServiceName(e.target.value)}
          type="text"
        />
        <Dropdown
          options={branchesList}
          item={getBranchName(serviceBranch)}
          setItem={setServiceBranch}
          label="Branch"
        />

        <div className="mt-10">
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
