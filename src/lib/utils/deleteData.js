import axios from "@/api/axios";
import { isTokenValid } from "./validateToken";

export const handleDelete = async (accessToken, page, itemId) => {
  let responseData = null;
  let message = "";

  const endpoints = {
    branch: "/api/branches",
    staff: "/api/staffs",
    service: "/api/services/delete",
    customer: "/api/customers/delete",
    item: "/api/service/items/delete",
    order: "/api/orders",
  };

  const endpoint = endpoints[page];

  if (!page || !accessToken || !itemId) {
    return { data: responseData, message: "Missing required parameter(s)." };
  }

  if (!endpoint) {
    return { data: responseData, message: `Invalid page: ${page}` };
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
    const response = await axios.delete(`${endpoint}/${itemId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    responseData = response?.data;
    message = response?.data?.message || `${page} deleted successfully!`;
  } catch (error) {
    if (!error.response) {
      message = "Network error or no response from the server.";
    } else {
      switch (error.response.status) {
        case 400:
          message = "Bad request. Missing or invalid parameters.";
          break;
        case 401:
          message = "Unauthorized. Please log in again.";
          break;
        case 404:
          message = `${page} not found.`;
          break;
        default:
          message =
            error.response?.data?.message || "An unexpected error occurred.";
      }
    }
    console.error("Error during deletion:", error);
  }

  return { data: responseData, message };
};
