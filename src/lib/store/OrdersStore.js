import { create } from "zustand";
import useAuth from "@/hooks/useAuth";

export const useOrders = create((set) => ({
  orders: [
    // {
    //   id: 11,
    //   customerName: "Customer 1",
    //   customerPhoneNumber: "+233 88 989 8989",
    //   customerEmail: "john@email.com",
    //   time: "09:00",
    //   day: "13 Dec 2024",
    //   quantity: "3",
    //   price: "100",
    //   items: ["jeans", "t_shirt"],
    //   state: "pending",
    // },
    // {
    //   id: 12,
    //   customerName: "Customer 2",
    //   customerPhoneNumber: "+233 88 989 8989",
    //   customerEmail: "john@email.com",
    //   time: "09:00",
    //   day: "13 Dec 2024",
    //   quantity: "3",
    //   price: "100",
    //   items: ["jeans", "t_shirt"],
    //   state: "completed",
    // },
  ],

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
