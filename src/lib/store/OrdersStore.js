import { create } from "zustand";

export const useOrders = create((set) => ({
  orders: [
    {
      id: 1,
      customerName: "John Mike",
      customerPhoneNumber: "+233 88 989 8989",
      customerEmail: "john@email.com",
      time: "09:00",
      day: "13 Dec 2024",
      quantity: "3",
      price: "100",
      items: ["jeans", "t_shirt"],
      state: "pending",
    },
    {
      id: 2,
      customerName: "John Mike",
      customerPhoneNumber: "+233 88 989 8989",
      customerEmail: "john@email.com",
      time: "09:00",
      day: "13 Dec 2024",
      quantity: "3",
      price: "100",
      items: ["jeans", "t_shirt"],
      state: "completed",
    },
  ],
}));
