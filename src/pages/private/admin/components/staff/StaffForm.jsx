import Dropdown from "@/components/Dropdown";
import Input from "@/components/Input";
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

  const branches = ["branch 1", "branch 2"];

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
        options={branches}
        item={branch}
        setItem={setStaffBranch}
        label="Branch"
      />
    </form>
  );
};
export default StaffForm;
