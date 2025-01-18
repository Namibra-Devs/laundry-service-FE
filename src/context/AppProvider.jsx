import { useState } from "react";
import { createContext } from "react";
import PropTypes from "prop-types";
import useFetchAllItems from "@/hooks/useFetchAllItems";

export const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentForm, setCurrentForm] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewModalType, setViewModalType] = useState("view");
  const [currentItem, setCurrentItem] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);

  const {
    data: { data: branches },
  } = useFetchAllItems({ resourceType: "branches" });

  const {
    data: { data: staff },
  } = useFetchAllItems({ resourceType: "staff" });

  const {
    data: { data: services },
  } = useFetchAllItems({ resourceType: "services" });

  const {
    data: { data: customers },
  } = useFetchAllItems({ resourceType: "customers" });

  // create item modal actions
  const openModal = (form) => {
    setCurrentForm(form);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentForm(null);
  };

  // view item modal actions
  const openViewModal = (form) => {
    setCurrentForm(form);
    setIsViewModalOpen(true);
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setCurrentForm(null);
  };

  const viewItem = (section) => {
    openViewModal(section);
    setViewModalType("view");
  };

  const editItem = (section) => {
    openViewModal(section);
    setViewModalType("edit");
  };

  const dataValues = {
    staff,
    branches,
    services,
    customers,
  };

  const values = {
    currentForm,
    isModalOpen,
    openModal,
    closeModal,
    isViewModalOpen,
    openViewModal,
    closeViewModal,
    viewModalType,
    setViewModalType,
    viewItem,
    editItem,
    currentItem,
    setCurrentItem,
    setDeleteModal,
    deleteModal,
  };

  return (
    <AppContext.Provider value={{ ...values, ...dataValues }}>
      {children}
    </AppContext.Provider>
  );
};

AppProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppProvider;
