import { X } from "lucide-react";
import CustomButton from "../CustomButton";
import PropTypes from "prop-types";
import useAppContext from "../../hooks/useAppContext";
import OrderDetails from "../../pages/private/shared/components/OrderDetails";
import EditOrder from "../../pages/private/shared/components/EditOrder";
import EditStaffForm from "@/pages/private/admin/components/staff/EditStaffForm";
import EditBranchForm from "@/pages/private/admin/components/branch/EditBranchForm";
import CustomerDetails from "@/pages/private/shared/components/customers/CustomerDetails";
import EditCustomerForm from "@/pages/private/shared/components/customers/EditCustomerForm";
import EditServiceForm from "@/pages/private/shared/components/services/EditServiceForm";
import ItemDetails from "@/pages/private/shared/components/Items/ItemDetails";
import EditItemForm from "@/pages/private/shared/components/Items/EditItemForm";
import ReactDOM from "react-dom";

const ViewContents = ({ section }) => {
  return (
    <div className="flex-1 overflow-y-auto px-6 py-4 view_screen">
      {section === "Order" ? (
        <OrderDetails />
      ) : section === "Item" ? (
        <ItemDetails />
      ) : section === "Customer" ? (
        <CustomerDetails />
      ) : null}
    </div>
  );
};

ViewContents.propTypes = {
  section: PropTypes.string.isRequired,
};

const EditContents = ({ section }) => {
  return (
    <div className="flex-1 overflow-y-auto px-6 py-4 view_screen">
      {section === "Order" ? (
        <EditOrder />
      ) : section === "Item" ? (
        <EditItemForm />
      ) : section === "Service" ? (
        <EditServiceForm />
      ) : section === "Customer" ? (
        <EditCustomerForm />
      ) : section === "Branch" ? (
        <EditBranchForm />
      ) : section === "Staff" ? (
        <EditStaffForm />
      ) : null}
    </div>
  );
};

EditContents.propTypes = {
  section: PropTypes.string.isRequired,
};

const ViewItemModal = ({ isModalOpen, onClose, section }) => {
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

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black bg-opacity-50 sm:pr-2">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl h-screen flex flex-col z-20 relative">
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
          <ViewContents section={section} />
        ) : (
          <EditContents section={section} />
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
            <>
              {["Staff", "Branch", "Service"].includes(section) || (
                <CustomButton
                  label="View"
                  variant="contained"
                  onClick={() => setViewModalType("view")}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>,
    document.getElementById("modal")
  );
};

ViewItemModal.propTypes = {
  isModalOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  section: PropTypes.string.isRequired,
};

export default ViewItemModal;
