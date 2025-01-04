import { useState } from "react";
import { createContext } from "react";
import PropTypes from "prop-types";

export const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentForm, setCurrentForm] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

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

  const values = {
    currentForm,
    isModalOpen,
    openModal,
    closeModal,
    isViewModalOpen,
    openViewModal,
    closeViewModal,
  };

  return <AppContext.Provider value={values}>{children}</AppContext.Provider>;
};

AppProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppProvider;
