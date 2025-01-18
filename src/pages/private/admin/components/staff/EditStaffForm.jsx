import CustomButton from "@/components/CustomButton";
import Dropdown from "@/components/Dropdown";
import Input from "@/components/Input";
import useAppContext from "@/hooks/useAppContext";
import { useEffect } from "react";
import { useState } from "react";

const EditStaffForm = () => {
  const { currentItem: staff } = useAppContext();
  const [branch, setStaffBranch] = useState("");
  const [message, setMessage] = useState(null);

  const [formData, setFormData] = useState({
    staffName: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (staff) {
      setFormData({
        staffName: staff.staffName || "",
        email: staff.email || "",
        password: staff.password || "",
      });
      setStaffBranch(staff.branch || "");
    }
  }, [staff]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const branches = ["Branch 1", "Branch 2", "Branch 3", "Branch 4"];

  const handleUpdateStaff = async () => {
    if (
      !formData.staffName ||
      !formData.email ||
      !formData.password ||
      !branch
    ) {
      setMessage((prev) => ({
        ...prev,
        text: "All fields are required",
        type: "error",
      }));
      return;
    }

    setMessage(null);
    const newInfo = {
      staffName: formData.staffName,
      email: formData.email,
      password: formData.password,
    };

    console.log(newInfo);
  };

  return (
    <>
      {message && (
        <p
          className={`${
            message.type === "success" ? "bg-success" : "bg-danger"
          } text-white px-5 py-3 rounded-md text-center w-[90%] mx-auto mt-2`}
        >
          {message.text}
        </p>
      )}
      <form className="p-4 my-5">
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
            onClick={handleUpdateStaff}
          />
        </div>
      </form>
    </>
  );
};

export default EditStaffForm;
