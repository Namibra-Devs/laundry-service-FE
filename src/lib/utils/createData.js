import axios from "@/api/axios";
import { isTokenValid } from "./validateToken";

export const createData = async (page, data, accessToken) => {
  const result = {
    message: {},
    loading: true,
    data: {},
  };

  const endpoints = {
    staff: "/api/staff/create",
    branch: "/api/branches/create",
    service: "/api/services/create",
    customer: "/api/customers/create",
    item: "/api/items/create",
  };

  const endpoint = endpoints[page];

  if (!page || !data || !accessToken) {
    result.message = { type: "error", text: "missing function params" };
    result.loading = false;
    return result;
  }

  if (!endpoint) {
    result.message = `Invalid page: ${page}`;
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
  } else {
    try {
      const response = await axios.post(endpoint, data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      result.data = response?.data;
      result.message = {
        type: "success",
        text: response?.data?.message || `${page} created successfully`,
      };
    } catch (error) {
      if (!error?.response) {
        result.message = {
          type: "error",
          text: "No server response. Please check your connection",
        };
      } else if (error?.response?.status == 400) {
        result.message = {
          type: "error",
          text: "Missing Input Fields",
        };
      } else if (error?.response?.status == 401) {
        result.message = {
          type: "error",
          text: "Unauthorized. Please log in again.",
        };
      } else {
        result.message = {
          type: "error",
          text: error.response?.data?.message || error.message,
        };
        console.error("Error:", error);
      }
    } finally {
      result.loading = false;
    }
  }

  return result;
};
