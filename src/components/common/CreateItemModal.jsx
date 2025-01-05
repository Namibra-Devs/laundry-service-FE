import PropTypes from "prop-types";
import { X } from "lucide-react";
import CustomButton from "../CustomButton";
import CreateItemForm from "../../pages/private/shared/components/Items/CreateItemForm";

const CreateItemModal = ({ isModalOpen, onClose, section, onSubmit }) => {
  const allowedSections = ["Item", "Service", "Customer", "Branch", "Staff"];
  if (!isModalOpen || !allowedSections.includes(section)) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl h-[90vh] flex flex-col">
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
            "services form"
          ) : section === "Customer" ? (
            "Customer form"
          ) : section === "Branch" ? (
            "Branch form"
          ) : section === "Staff" ? (
            "Staff form"
          ) : null}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-4">
          <CustomButton label="Cancel" variant="outlined" onClick={onClose} />
          <CustomButton label="Submit" variant="contained" onClick={onSubmit} />
        </div>
      </div>
    </div>
  );
};

CreateItemModal.propTypes = {
  isModalOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  section: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default CreateItemModal;
