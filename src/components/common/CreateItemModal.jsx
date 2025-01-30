import PropTypes from "prop-types";
import { X } from "lucide-react";
import CustomButton from "../CustomButton";
import CreateItemForm from "../../pages/private/shared/components/Items/CreateItemForm";
import BranchForm from "../../pages/private/admin/components/branch/BranchForm";
import StaffForm from "../../pages/private/admin/components/staff/StaffForm";
import ServicesForm from "../../pages/private/shared/components/services/ServicesForm";
import CustomersForm from "../../pages/private/shared/components/customers/CustomersForm";
import ReactDOM from "react-dom";

const CreateItemModal = ({
  isModalOpen,
  onClose,
  section,
  onSubmit,
  loading,
}) => {
  const allowedSections = ["Item", "Service", "Customer", "Branch", "Staff"];
  if (!isModalOpen || !allowedSections.includes(section)) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl h-screen sm:max-h-[80vh] flex flex-col relative">
        {loading && (
          <div className="absolute top-0 left-0 w-full h-full bg-black/40 z-10 rounded-lg flex items-center justify-center">
            <div className="h-12 w-12 border-4 border-t-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
          </div>
        )}
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h4 className="text-base text-gray-500">Add {section}</h4>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 transition"
          >
            <X />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {section === "Item" ? (
            <CreateItemForm />
          ) : section === "Service" ? (
            <ServicesForm />
          ) : section === "Customer" ? (
            <CustomersForm />
          ) : section === "Branch" ? (
            <BranchForm />
          ) : section === "Staff" ? (
            <StaffForm />
          ) : null}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-4">
          <CustomButton label="Cancel" variant="outlined" onClick={onClose} />
          <CustomButton label="Submit" variant="contained" onClick={onSubmit} />
        </div>
      </div>
    </div>,
    document.getElementById("modal")
  );
};

CreateItemModal.propTypes = {
  isModalOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  section: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default CreateItemModal;
