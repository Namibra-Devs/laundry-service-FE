import Dropdown from "@/components/Dropdown";
import Input from "@/components/Input";
import useAppContext from "@/hooks/useAppContext";
import { useServiceForm } from "@/lib/store/PageForms";

const ServicesForm = () => {
  const { name, setServiceName, branch, setServiceBranch } = useServiceForm(
    (state) => state
  );

  const { branches } = useAppContext();

  const branchesList = [...new Set(branches?.map((branch) => branch))];

  const getBranchName = (branchId) => {
    const branch = branches?.find((b) => b._id === branchId);
    return branch?.name || branchId;
  };

  return (
    <>
      <form className="p-4 my-5">
        <Input
          label="Service Name"
          name="serviceName"
          id="serviceName"
          value={name}
          onChange={(e) => setServiceName(e.target.value)}
          type="text"
        />
        <Dropdown
          options={branchesList.length > 0 ? branchesList : [{}]}
          item={getBranchName(branch)}
          setItem={setServiceBranch}
          label="Branch"
        />
      </form>
    </>
  );
};
export default ServicesForm;
