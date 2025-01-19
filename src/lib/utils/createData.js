import axios from "@/api/axios";
import { isTokenValid } from "./validateToken";

export const createData = async (page, data, accessToken) => {
  const result = {
    message: { type: "info", text: "" },
    loading: true,
    data: null,
  };

  const endpoints = {
    staff: "/api/auth/register",
    branch: "/api/branches/create",
    service: "/api/services/create",
    customer: "/api/customers/create",
    item: "/api/service/items/create",
  };

  // Validate input parameters
  if (!page || !data || !accessToken) {
    result.message = { type: "error", text: "Missing function parameters" };
    result.loading = false;
    return result;
  }

  const endpoint = endpoints[page];
  if (!endpoint) {
    result.message = { type: "error", text: `Invalid page: ${page}` };
    result.loading = false;
    return result;
  }

  // Validate token
  if (!isTokenValid(accessToken)) {
    console.warn("Token is invalid or expired. Redirecting to login...");
    result.message = {
      type: "error",
      text: "Token expired. Redirecting to login...",
    };
    result.loading = false;
    window.location.href = "/";
    return result;
  }

  // Make API request
  try {
    const response = await axios.post(endpoint, data, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    result.data = response.data;
    result.message = {
      type: "success",
      text: response?.data?.message || `${page} created successfully`,
    };
  } catch (error) {
    const status = error?.response?.status;

    if (!error?.response) {
      result.message = {
        type: "error",
        text: "No server response. Please check your connection.",
      };
    } else if (status === 400) {
      result.message = { type: "error", text: "Missing input fields." };
    } else if (status === 401) {
      result.message = {
        type: "error",
        text: "Unauthorized. Please log in again.",
      };
    } else {
      result.message = {
        type: "error",
        text: error.response?.data?.message || "Oops! Failed to create data.",
      };
      console.error("Error:", error);
    }
  } finally {
    result.loading = false;
  }

  return result;
};
