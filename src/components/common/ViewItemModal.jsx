import { X } from "lucide-react";
import CustomButton from "../CustomButton";
import PropTypes from "prop-types";
import useAppContext from "../../hooks/useAppContext";
import OrderDetails from "../../pages/private/shared/components/OrderDetails";
import EditOrder from "../../pages/private/shared/components/EditOrder";
import StaffDetails from "@/pages/private/admin/components/staff/StaffDetails";
import EditStaffForm from "@/pages/private/admin/components/staff/EditStaffForm";

const ViewContents = ({ section, itemId }) => {
  return (
    <div className="flex-1 overflow-y-auto px-6 py-4 view_screen">
      {section === "Order" ? (
        <OrderDetails itemId={itemId} />
      ) : section === "Item" ? (
        "item details"
      ) : section === "Service" ? (
        "services details"
      ) : section === "Customer" ? (
        "Customer details"
      ) : section === "Branch" ? (
        "Branch details"
      ) : section === "Staff" ? (
        <StaffDetails itemId={itemId} />
      ) : null}
    </div>
  );
};

ViewContents.propTypes = {
  section: PropTypes.string.isRequired,
  itemId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

const EditContents = ({ section, itemId }) => {
  return (
    <div className="flex-1 overflow-y-auto px-6 py-4 view_screen">
      {section === "Order" ? (
        <EditOrder itemId={itemId} />
      ) : section === "Item" ? (
        "Edit item"
      ) : section === "Service" ? (
        "Edit services"
      ) : section === "Customer" ? (
        "Edit Customer"
      ) : section === "Branch" ? (
        "Edit Branch"
      ) : section === "Staff" ? (
        <EditStaffForm itemId={itemId} />
      ) : null}
    </div>
  );
};

EditContents.propTypes = {
  section: PropTypes.string.isRequired,
  itemId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

const ViewItemModal = ({ isModalOpen, onClose, section, currentItemId }) => {
  const { viewModalType, setViewModalType } = useAppContext();

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
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl h-[80vh] sm:h-[98vh] flex flex-col z-20">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h4 className="text-base text-gray-500">
            {viewModalType === "view" ? "View" : "Edit"} {section}
          </h4>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 transition"
          >
            <X />
          </button>
        </div>

        {/* Content */}
        {viewModalType === "view" ? (
          <ViewContents section={section} itemId={currentItemId} />
        ) : (
          <EditContents section={section} itemId={currentItemId} />
        )}

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-4">
          <CustomButton label="Back" variant="outlined" onClick={onClose} />

          {viewModalType === "view" ? (
            <CustomButton
              label="Edit"
              variant="contained"
              onClick={() => setViewModalType("edit")}
            />
          ) : (
            <CustomButton
              label="View"
              variant="contained"
              onClick={() => setViewModalType("view")}
            />
          )}
        </div>
      </div>
    </div>
  );
};

ViewItemModal.propTypes = {
  isModalOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  section: PropTypes.string.isRequired,
  currentItemId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default ViewItemModal;
