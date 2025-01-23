import PropTypes from "prop-types";
import { useEffect, useState, useCallback } from "react";
import useAuth from "./useAuth";
import axios from "@/api/axios";
import { isTokenValid } from "@/lib/utils/validateToken";

const useFetchAllItems = ({ resourceType, customEndpoint }) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    auth: { accessToken, user },
  } = useAuth();

  const endpoints = {
    branches: "/api/branches/user",
    staff: "/api/staffs",
    services: "/api/services/user",
    customers: "/api/customers",
    items: "/api/service/items",
    orders: "/api/orders",
  };

  const endpoint = customEndpoint || `${endpoints[resourceType]}/${user?.id}`;

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");

    if (!resourceType || !endpoint) {
      setError("Resource type not specified or invalid");
      return;
    }

    if (!isTokenValid(accessToken)) {
      window.location.href = "/";
      return;
    }

    try {
      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setData(response?.data);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err?.response?.data?.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  }, [accessToken, endpoint, resourceType]);

  useEffect(() => {
    if (user?.id && accessToken) {
      fetchData();
    }
  }, [user?.id, accessToken, fetchData]);

  return { data, error, loading, refetch: fetchData };
};

useFetchAllItems.propTypes = {
  resourceType: PropTypes.string.isRequired,
  customEndpoint: PropTypes.string,
};

export default useFetchAllItems;
