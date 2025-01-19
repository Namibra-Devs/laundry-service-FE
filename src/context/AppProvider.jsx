import { useState } from "react";
import { createContext } from "react";
import PropTypes from "prop-types";
import useFetchAllItems from "@/hooks/useFetchAllItems";
import { useEffect } from "react";

export const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentForm, setCurrentForm] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewModalType, setViewModalType] = useState("view");
  const [currentItem, setCurrentItem] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);

  const [dataVersion, setDataVersion] = useState(0); // Trigger updates
  const [modifiedResource, setModifiedResource] = useState(null);

  // fetch data
  const {
    data: { data: branches },
    refetch: refetchBranches,
  } = useFetchAllItems({
    resourceType: "branches",
  });

  const {
    data: { data: staff },
    refetch: refetchStaff,
  } = useFetchAllItems({
    resourceType: "staff",
    customEndpoint: "/api/staffs",
  });

  const {
    data: { data: services },
    refetch: refetchServices,
  } = useFetchAllItems({
    resourceType: "services",
  });

  const {
    data: { data: customers },
    refetch: refetchCustomers,
  } = useFetchAllItems({
    resourceType: "customers",
    customEndpoint: "/api/customers",
  });

  const {
    data: { data: items },
    refetch: refetchItems,
  } = useFetchAllItems({
    resourceType: "items",
    customEndpoint: "/api/service/items",
  });

  const {
    data: { data: orders },
    refetch: refetchOrders,
  } = useFetchAllItems({
    resourceType: "orders",
    customEndpoint: "/api/orders",
  });

  const triggerUpdate = (resource) => {
    setModifiedResource(resource);
    setDataVersion((prev) => prev + 1);
  };

  useEffect(() => {
    if (modifiedResource) {
      console.log(dataVersion, modifiedResource);
      switch (modifiedResource) {
        case "branch":
          refetchBranches();
          break;
        case "staff":
          refetchStaff();
          break;
        case "service":
          refetchServices();
          break;
        case "customer":
          refetchCustomers();
          break;
        case "item":
          refetchItems();
          break;
        case "order":
          refetchOrders();
          break;
        default:
          console.warn("Unknown resource:", modifiedResource);
      }
    }
  }, [dataVersion]);

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
    branches,
    staff,
    services,
    customers,
    items,
    orders,
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
    triggerUpdate,
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
