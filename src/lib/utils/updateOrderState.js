import axios from "@/api/axios";
import { isTokenValid } from "./validateToken";

export const updateOrderState = async (accessToken, itemId, status) => {
  let responseData = null;
  let message = "";

  if (!accessToken || !itemId || !status) {
    return { data: responseData, message: "Missing params." };
  }

  if (!isTokenValid(accessToken)) {
    message = "Token expired. Redirecting to login...";
    console.error(message);
    setTimeout(() => {
      window.location.href = "/";
    }, 2000);
    return { data: responseData, message };
  }

  try {
    console.log(
      `updating item ${itemId} to state ${status} on endpoint: /api/orders/${itemId}/${status}`
    );
    const response = await axios.put(`/api/orders/${itemId}/${status}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    responseData = response?.data;
    console.log("update successfully");
  } catch (error) {
    console.error(
      "There was an error while trying to update order state",
      error
    );
  }

  return { data: responseData, message };
};
