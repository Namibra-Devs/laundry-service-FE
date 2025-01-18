import CustomButton from "@/components/CustomButton";
import Dropdown from "@/components/Dropdown";
import Input from "@/components/Input";
import useAppContext from "@/hooks/useAppContext";
import { useState } from "react";
import PropTypes from "prop-types";

const EditStaffForm = ({ refetchFunction }) => {
  const { currentItem: staff } = useAppContext();
  const [branch, setStaffBranch] = useState("");

  const [formData, setFormData] = useState({
    staffName: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const branches = ["Branch 1", "Branch 2", "Branch 3", "Branch 4"];

  return (
    <form className="p-4 my-5">
      <p>{staff?.email}</p>
      <Input
        label="Staff Name"
        name="staffName"
        id="staffName"
        value={formData?.staffName}
        onChange={handleChange}
        type="text"
      />
      <Input
        label="Email"
        name="staffEmail"
        id="staffEmail"
        value={formData?.email}
        onChange={handleChange}
        type="email"
      />
      <Input
        label="Password"
        name="staffPassword"
        id="staffPassword"
        value={formData?.password}
        onChange={handleChange}
        type="password"
      />
      <Dropdown
        options={branches}
        item={branch}
        setItem={setStaffBranch}
        label="Branch"
      />

      <div className="mt-10">
        <CustomButton
          label="Update Staff"
          variant="contained"
          onClick={() => {}}
        />
      </div>
    </form>
  );
};

EditStaffForm.propTypes = {
  refetchFunction: PropTypes.func.isRequired,
};
export default EditStaffForm;
