import Dropdown from "@/components/Dropdown";
import Input from "@/components/Input";
import useAppContext from "@/hooks/useAppContext";
import { useCustomerForm } from "@/lib/store/PageForms";

const CustomersForm = () => {
  const customer = useCustomerForm((state) => state);

  const { branches } = useAppContext();

  const branchesList = [...new Set(branches?.map((branch) => branch))];

  const getBranchName = (branchId) => {
    const branch = branches?.find((b) => b._id === branchId);
    return branch?.name || branchId;
  };

  return (
    <>
      <form className="p-4 my-5">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
          <Input
            label="First Name"
            name="firstName"
            id="firstName"
            value={customer?.firstName}
            onChange={(e) => customer?.setCustomerFirstName(e.target.value)}
            type="text"
          />
          <Input
            label="Middle Name"
            name="middleName"
            id="middleName"
            value={customer?.middleName}
            onChange={(e) => customer?.setCustomerMiddleName(e.target.value)}
            type="text"
          />
          <Input
            label="Surname"
            name="surName"
            id="surName"
            value={customer?.surName}
            onChange={(e) => customer?.setCustomerSurName(e.target.value)}
            type="text"
          />
        </div>

        <Input
          label="Email"
          name="email"
          id="email"
          value={customer?.email}
          onChange={(e) => customer?.setCustomerEmail(e.target.value)}
          type="email"
        />

        <Input
          label="Phone Number"
          name="phoneNumber"
          id="phoneNumber"
          value={customer?.phoneNumber}
          onChange={(e) => customer?.setCustomerPhoneNumber(e.target.value)}
          type="text"
        />

        <Input
          label="House Number"
          name="houseNumber"
          id="houseNumber"
          value={customer?.houseNumber}
          onChange={(e) => customer?.setCustomerHouseNumber(e.target.value)}
          type="text"
        />

        <Dropdown
          options={branchesList.length > 0 ? branchesList : [{}]}
          item={getBranchName(customer?.branch)}
          setItem={customer?.setCustomerBranch}
          label="Branch"
        />
      </form>
    </>
  );
};
export default CustomersForm;
