import axios from "@/api/axios";
import { isTokenValid } from "./validateToken";

export const handleDelete = async (accessToken, page, itemId) => {
  let message = "";
  let data = null;

  const endpoints = {
    Branch: "/api/branches",
    Staff: " /api/staff",
    Service: " /api/branches",
    Customer: "/api/customers/delete",
  };

  const endpoint = endpoints[page];

  if (!page || !accessToken || !itemId) {
    return { data, message: "Missing function parameter(s)" };
  }

  if (!endpoint) {
    return { data, message: `Invalid page: ${page}` };
  }

  if (!isTokenValid(accessToken)) {
    console.log("Token is invalid or expired. Please log in again.");
    message = "Token expired. Redirecting to login...";
    setTimeout(() => {
      window.location.href = "/";
    }, 2000);
    return { data, message };
  }

  try {
    const response = await axios.delete(`${endpoint}/${itemId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    data = response?.data;
    message = response?.data?.message || "Item deleted successfully!";
  } catch (error) {
    switch (error.response?.status) {
      case 400:
        message = "Missing parameter";
        console.log(error.response);
        break;
      case 401:
        message = "Unauthorized. Please log in again.";
        break;
      case 404:
        message = "Item not found.";
        break;
      default:
        message = error.response?.data?.message || "An error occurred.";
        console.error("Error:", error);
    }
  }

  return { data, message };
};
