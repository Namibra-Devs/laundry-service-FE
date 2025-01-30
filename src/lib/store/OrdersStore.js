import { create } from "zustand";

export const useOrders = create((set) => ({
  orders: [],

  activeMode: "containers",
  setActiveMode: (mode) => set({ activeMode: mode }),

  draggedOrder: null,
  setDraggedOrder: (order) => set({ draggedOrder: order }),

  moveOrder: (order, status) => {
    set((store) => ({
      orders: store.orders.map((item) =>
        item._id === order?._id ? { ...order, status } : item
      ),
    }));
  },

  updateOrderState: (order, state) => {
    set((store) => ({
      orders: store.orders.map((item) =>
        item.id === order?.id ? { ...order, state } : item
      ),
    }));
  },
}));
