import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import useAuth from "./useAuth";
import axios from "@/api/axios";

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
    // orders: "/api/customers",
  };

  const endpoint = customEndpoint || `${endpoints[resourceType]}/${user?.id}`;

  useEffect(() => {
    const fetchData = async () => {
      if (!resourceType || !endpoint) {
        setError("Resource type not specified or invalid");
        return;
      }

      setLoading(true);
      setError("");

      try {
        const response = await axios.get(`${endpoint}`, {
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
    };

    if (user?.id && accessToken) {
      fetchData();
    }
  }, [user?.id, accessToken, resourceType, endpoint]);

  return { data, error, loading };
};

useFetchAllItems.propTypes = {
  resourceType: PropTypes.string.isRequired,
  customEndpoint: PropTypes.string,
};

export default useFetchAllItems;
