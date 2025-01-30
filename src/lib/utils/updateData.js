import axios from "@/api/axios";
import { isTokenValid } from "./validateToken";

export const updateData = async (page, itemId, data, accessToken) => {
  const result = {
    message: {},
    data: null,
  };

  const endpoints = {
    staff: "/api/staffs",
    branch: "/api/branches",
    service: "/api/services",
    customer: "/api/customers/update",
    item: "/api/service/items/update",
    order: "/api/orders",
  };

  const endpoint = endpoints[page];

  if (!page || !itemId || !data || !accessToken) {
    result.message = { type: "error", text: "Missing function parameters" };
    result.loading = false;
    return result;
  }

  if (!endpoint) {
    result.message = { type: "error", text: `Invalid page: ${page}` };
    result.loading = false;
    return result;
  }

  if (!isTokenValid(accessToken)) {
    console.log("Token is invalid or expired. Please log in again.");
    window.location.href = "/";
    result.message = {
      type: "error",
      text: "Token expired. Redirecting to login...",
    };
    return result;
  }

  try {
    const response = await axios.put(`${endpoint}/${itemId}`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    result.data = response?.data;
    result.message = {
      type: "success",
      text: response?.data?.message || `${page} updated successfully`,
    };
  } catch (error) {
    if (!error?.response) {
      result.message = {
        type: "error",
        text: "No server response. Please check your connection.",
      };
    } else if (error.response.status === 400) {
      result.message = {
        type: "error",
        text: "Invalid input. Please check the data and try again.",
      };
    } else if (error.response.status === 401) {
      result.message = {
        type: "error",
        text: "Unauthorized access. Please log in again.",
      };
    } else if (error.response.status === 404) {
      result.message = {
        type: "error",
        text: "Item not found. Please check the item ID and try again.",
      };
    } else {
      result.message = {
        type: "error",
        text: error.response?.data?.message || "An unexpected error occurred.",
      };
      console.error("Error:", error);
    }
  }

  return result;
};
