import Dropdown from "../../../../components/Dropdown";
import Input from "../../../../components/Input";
import { useServiceForm } from "../../../../lib/store/PageForms";

const ServicesForm = () => {
  const { name, setServiceName, branch, setServiceBranch } = useServiceForm(
    (state) => state
  );

  const branches = ["Branch 1", "Branch 2", "Branch 3", "Branch 4"];
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
          options={branches}
          item={branch}
          setItem={setServiceBranch}
          label="Branch"
        />
      </form>
    </>
  );
};
export default ServicesForm;
