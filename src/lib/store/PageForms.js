import { create } from "zustand";

export const useBranchForm = create((set) => ({
  name: "",
  location: "",
  status: "",

  setBranchName: (nameValue) => {
    set(() => ({ name: nameValue }));
  },
  setBranchLocation: (locationValue) => {
    set(() => ({ location: locationValue }));
  },
  setBranchStatus: (statusValue) => {
    set(() => ({ status: statusValue }));
  },
  clearBranchForm: () => {
    set(() => ({ name: "" }));
    set(() => ({ location: "" }));
    set(() => ({ status: "" }));
  },
}));

export const useStaffForm = create((set) => ({
  name: "",
  email: "",
  password: "",
  branch: "",

  setStaffName: (value) => {
    set(() => ({ name: value }));
  },
  setStaffEmail: (value) => {
    set(() => ({ email: value }));
  },
  setStaffPassword: (value) => {
    set(() => ({ password: value }));
  },
  setStaffBranch: (value) => {
    set(() => ({ branch: value }));
  },
  clearStaffForm: () => {
    set(() => ({ name: "" }));
    set(() => ({ email: "" }));
    set(() => ({ password: "" }));
    set(() => ({ branch: "" }));
  },
}));

export const useServiceForm = create((set) => ({
  name: "",
  branch: "",

  setServiceName: (value) => {
    set(() => ({ name: value }));
  },
  setServiceBranch: (value) => {
    set(() => ({ branch: value }));
  },
  clearServiceForm: () => {
    set(() => ({ name: "" }));
    set(() => ({ branch: "" }));
  },
}));

export const useCustomerForm = create((set) => ({
  firstName: "",
  middleName: "",
  surName: "",
  email: "",
  phoneNumber: "",
  houseNumber: "",
  branch: "",

  setCustomerFirstName: (value) => {
    set(() => ({ firstName: value }));
  },
  setCustomerMiddleName: (value) => {
    set(() => ({ middleName: value }));
  },
  setCustomerSurName: (value) => {
    set(() => ({ surName: value }));
  },
  setCustomerEmail: (value) => {
    set(() => ({ email: value }));
  },
  setCustomerPhoneNumber: (value) => {
    set(() => ({ phoneNumber: value }));
  },
  setCustomerHouseNumber: (value) => {
    set(() => ({ houseNumber: value }));
  },
  setCustomerBranch: (value) => {
    set(() => ({ branch: value }));
  },
  clearCustomerForm: () => {
    set(() => ({ firstName: "" }));
    set(() => ({ middleName: "" }));
    set(() => ({ surName: "" }));
    set(() => ({ email: "" }));
    set(() => ({ phoneNumber: "" }));
    set(() => ({ houseNumber: "" }));
    set(() => ({ branch: "" }));
  },
}));

export const useItemsForm = create((set) => ({
  itemName: "",
  setItemName: (value) => {
    set(() => ({ itemName: value }));
  },

  prices: [
    // {
    //   id: 1,
    //   branch: "first branch",
    //   washPrice: 200,
    //   ironPrice: 230,
    // },
  ],

  addNewPrice: (newId) => {
    set((state) => ({
      prices: [
        ...state.prices,
        {
          id: newId,
          branch: "",
          washingPrice: 0,
          ironingPrice: 0,
        },
      ],
    }));
  },

  deletePrice: (id) => {
    set((state) => ({
      prices: state.prices.filter((item) => item.id !== id),
    }));
  },

  setItemBranch: (id, newBranch) => {
    set((state) => ({
      prices: state.prices.map((item) =>
        item.id === id ? { ...item, branch: newBranch } : item
      ),
    }));
  },

  setWashPrice: (id, value) => {
    set((state) => ({
      prices: state.prices.map((item) =>
        item.id === id ? { ...item, washingPrice: value } : item
      ),
    }));
  },

  // setWashCurrency: (id, value) => {
  //   set((state) => ({
  //     prices: state.prices.map((item) =>
  //       item.id === id ? { ...item, washCurrency: value } : item
  //     ),
  //   }));
  // },

  setIronPrice: (id, value) => {
    set((state) => ({
      prices: state.prices.map((item) =>
        item.id === id ? { ...item, ironingPrice: value } : item
      ),
    }));
  },

  // setIronCurrency: (id, value) => {
  //   set((state) => ({
  //     prices: state.prices.map((item) =>
  //       item.id === id ? { ...item, ironCurrency: value } : item
  //     ),
  //   }));
  // },

  clearItemForm: () => {
    set(() => ({ itemName: "" }));
    set(() => ({ prices: [] }));
  },
}));
