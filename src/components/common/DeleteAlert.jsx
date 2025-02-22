import { X } from "lucide-react";
import CustomButton from "../CustomButton";
import PropTypes from "prop-types";
import { handleDelete } from "@/lib/utils/deleteData";
import useAuth from "@/hooks/useAuth";
import { useState } from "react";
import useAppContext from "@/hooks/useAppContext";

const DeleteAlert = ({ page, setDeleteModal, deleteModal, itemId }) => {
  const {
    auth: { accessToken },
  } = useAuth();

  const { triggerUpdate, setAlert } = useAppContext();
  const [loading, setLoading] = useState(false);

  const deleteItem = async () => {
    setLoading(true);
    try {
      const { data, message } = await handleDelete(accessToken, page, itemId);

      if (message && !data) {
        setAlert((prev) => ({ ...prev, message, type: "error" }));
      }

      if (data) {
        setAlert((prev) => ({
          ...prev,
          message: `${page} deleted successfully`,
          type: "success",
        }));
        setDeleteModal(false);
        if (page === "branch") {
          triggerUpdate("branch");
          triggerUpdate("service");
          triggerUpdate("customer");
          triggerUpdate("item");
          triggerUpdate("order");
        } else {
          triggerUpdate(page);
        }
      }
    } catch (error) {
      console.error("Error during deletion:", error.message || error);
      setAlert((prev) => ({
        ...prev,
        message: "Couldn't delete item",
        type: "error",
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`w-full h-[100vh] fixed left-0 top-0 ${
        deleteModal ? "block" : "hidden"
      } 
          flex items-start justify-center bg-black bg-opacity-50 z-20 pt-5 top-0`}
    >
      <div className="w-[90%] sm:w-[30rem] max-w-md bg-white rounded-lg shadow-lg relative">
        {loading && (
          <div className="absolute top-0 left-0 w-full h-full bg-black/40 z-10 rounded-lg flex items-center justify-center">
            <div className="h-12 w-12 border-4 border-t-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
          </div>
        )}

        <div className="flex items-center justify-between bg-danger px-5 py-2 text-white rounded-t-sm">
          <h3 className="text-base capitalize">Delete {page} details</h3>
          <button
            onClick={() => {
              setDeleteModal(false);
              setAlert((prev) => ({
                ...prev,
                message: "",
              }));
            }}
            className=""
            aria-label="Close Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="p-5 text-base text-gray-600 border-b-2 border-gray-200">
          Deleting {page} item with ID ({itemId})
        </p>

        <div className="flex justify-end gap-2 m-3">
          <CustomButton
            label="Cancel"
            variant="outlined"
            onClick={() => {
              setDeleteModal(false);
              setAlert((prev) => ({
                ...prev,
                message: "",
              }));
            }}
          />
          <CustomButton
            label="Delete"
            variant="contained"
            onClick={deleteItem}
          />
        </div>
      </div>
    </div>
  );
};

DeleteAlert.propTypes = {
  page: PropTypes.string.isRequired,
  setDeleteModal: PropTypes.func.isRequired,
  deleteModal: PropTypes.bool.isRequired,
  itemId: PropTypes.string,
};

export default DeleteAlert;
