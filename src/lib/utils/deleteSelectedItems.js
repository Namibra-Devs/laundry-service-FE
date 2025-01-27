import axios from "@/api/axios";
import { isTokenValid } from "./validateToken";

export const deleteSelectedItems = async (accessToken, page, selectedIds) => {
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

  if (!page || !accessToken) {
    return {
      data: responseData,
      message: "Missing required parameter(s) to complete this request.",
    };
  }

  if (!endpoint) {
    return {
      data: responseData,
      message: `There is no endpoint to perform this action`,
    };
  }

  if (!isTokenValid(accessToken)) {
    message = "Token expired. Redirecting to login...";
    setTimeout(() => {
      window.location.href = "/login";
    }, 2000);
    console.error(message);
    return { data: responseData, message };
  }

  try {
    let response = null;
    for (const id of selectedIds) {
      // console.log(`Deleting item with ID: ${id} using URL: ${endpoint}`);
      response = await axios.delete(`${endpoint}/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    }
    responseData = response?.data;
    // responseData = { text: "some data" };
    message = `${page} items deleted successfully!`;
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
