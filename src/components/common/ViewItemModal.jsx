import { X } from "lucide-react";
import CustomButton from "../CustomButton";
import PropTypes from "prop-types";

const ViewItemModal = ({ isModalOpen, onClose, section }) => {
  const allowedSections = [
    "Order",
    "Item",
    "Service",
    "Customer",
    "Branch",
    "Staff",
  ];
  if (!isModalOpen || !allowedSections.includes(section)) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black bg-opacity-50 sm:pr-2">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl h-[80vh] sm:h-[98vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h4 className="text-base text-gray-500">View {section}</h4>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 transition"
          >
            <X />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {section === "Order"
            ? "order details"
            : section === "Item"
            ? "item details"
            : section === "Service"
            ? "services details"
            : section === "Customer"
            ? "Customer details"
            : section === "Branch"
            ? "Branch details"
            : section === "Staff"
            ? "Staff details"
            : null}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-4">
          <CustomButton label="Back" variant="outlined" onClick={onClose} />
          <CustomButton label="Edit" variant="contained" onClick={() => {}} />
        </div>
      </div>
    </div>
  );
};

ViewItemModal.propTypes = {
  isModalOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  section: PropTypes.string.isRequired,
};

export default ViewItemModal;
