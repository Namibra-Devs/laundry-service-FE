import Dropdown from "../../../../components/Dropdown";
import Input from "../../../../components/Input";
import { useBranchForm } from "../../../../lib/store/PageForms";

const BranchForm = () => {
  const {
    name,
    setBranchName,
    location,
    setBranchLocation,
    status,
    setBranchStatus,
  } = useBranchForm((state) => state);

  const statusOptions = ["open", "closed"];

  return (
    <>
      <form className="p-4 my-5">
        <Input
          label="Name"
          name="branchName"
          id="branchName"
          value={name}
          onChange={(e) => setBranchName(e.target.value)}
          type="text"
        />
        <Input
          label="Location"
          name="branchLocation"
          id="branchLocation"
          value={location}
          onChange={(e) => setBranchLocation(e.target.value)}
          type="text"
        />
        <Dropdown
          options={statusOptions}
          item={status}
          setItem={setBranchStatus}
          label="Status"
        />
      </form>
    </>
  );
};
export default BranchForm;
