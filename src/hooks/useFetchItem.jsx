import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import useAuth from "./useAuth";
import axios from "@/api/axios";

const useFetchItem = ({ resourceType, itemId }) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const {
    auth: { accessToken },
  } = useAuth();

  const endpoints = {
    branch: "/api/branches/",
    //  services: "/api/services/user",
  };

  const endpoint = endpoints[resourceType];

  useEffect(() => {
    const fetchData = async () => {
      if (!resourceType || !endpoint || !itemId) {
        setError("Resource type, endpoint, or item ID not specified.");
        return;
      }

      try {
        const response = await axios.get(`${endpoint}/${itemId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setData(response?.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message || "An error occurred.");
      }
    };

    fetchData();
  }, [itemId, accessToken, resourceType, endpoint]);

  return { data, error };
};

useFetchItem.propTypes = {
  resourceType: PropTypes.string.isRequired,
  itemId: PropTypes.string.isRequired,
};

export default useFetchItem;
