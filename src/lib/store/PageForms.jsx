import { create } from "zustand";

export const useBranchForm = create((set) => ({
  name: "",
  location: "",
  status: "open",

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
    set(() => ({ status: "open" }));
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
