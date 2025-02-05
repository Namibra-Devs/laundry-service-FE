import axios from "@/api/axios";
import { isTokenValid } from "./validateToken";

export const updateOrderState = async (accessToken, itemId, status) => {
  let responseData = null;
  let message = null;

  if (!accessToken || !itemId || !status) {
    return { data: responseData, message: "Missing params." };
  }

  if (!isTokenValid(accessToken)) {
    message = {
      text: "Token expired. Redirecting to login...",
      type: "error",
    };
    console.error(message);
    setTimeout(() => {
      window.location.href = "/";
    }, 2000);
    return { data: responseData, message };
  }

  try {
    console.log(
      `updating item ${itemId} to state ${status} on endpoint: /api/orders/${itemId}/status`
    );
    const response = await axios.put(
      `/api/orders/${itemId}/status`,
      { status: status },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    responseData = response?.data;
    console.log("update successfully");
    message = {
      text: "Order updated",
      type: "success",
    };
  } catch (error) {
    console.error(
      "There was an error while trying to update order state",
      error
    );
    message = {
      text: "Couldn't update order ",
      type: "error",
    };
  }

  return { data: responseData, message };
};
