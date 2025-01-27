import Dropdown from "@/components/Dropdown";
import Input from "@/components/Input";
import useAppContext from "@/hooks/useAppContext";
import { useStaffForm } from "@/lib/store/PageForms";

const StaffForm = () => {
  const {
    name,
    setStaffName,
    email,
    setStaffEmail,
    password,
    setStaffPassword,
    branch,
    setStaffBranch,
  } = useStaffForm((state) => state);

  const { branches } = useAppContext();

  const branchesList = [...new Set(branches?.map((branch) => branch))];

  const getBranchName = (branchId) => {
    const branch = branches?.find((b) => b._id === branchId);
    return branch?.name || branchId;
  };

  return (
    <form className="p-4 my-5">
      <Input
        label="Staff Name"
        name="staffName"
        id="staffName"
        value={name}
        onChange={(e) => setStaffName(e.target.value)}
        type="text"
      />
      <Input
        label="Email"
        name="staffEmail"
        id="staffEmail"
        value={email}
        onChange={(e) => setStaffEmail(e.target.value)}
        type="email"
      />
      <Input
        label="Password"
        name="staffPassword"
        id="staffPassword"
        value={password}
        onChange={(e) => setStaffPassword(e.target.value)}
        type="password"
      />
      <Dropdown
        options={branchesList}
        item={getBranchName(branch)}
        setItem={setStaffBranch}
        label="Branch"
      />
    </form>
  );
};
export default StaffForm;
