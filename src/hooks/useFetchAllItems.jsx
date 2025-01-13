import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import useAuth from "./useAuth";
import axios from "@/api/axios";

const useFetchAllItems = ({ resourceType }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const {
    auth: { accessToken, user },
  } = useAuth();

  const endpoints = {
    branches: "/api/branches/user",
  };

  const endpoint = endpoints[resourceType];

  useEffect(() => {
    const fetchData = async () => {
      setMessage("");
      setLoading(true);

      if (!resourceType || !endpoint) {
        setMessage("Resource type not specified or invalid");
        setMessageType("error");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${endpoint}/${user?.id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setData(response?.data);
        setMessage("Data fetched successfully");
        setMessageType("success");
      } catch (error) {
        console.error("Error fetching data:", error);
        setMessage("Failed to fetch data");
        setMessageType("error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.id, accessToken, resourceType, endpoint]);

  return { data, loading, message, messageType };
};

useFetchAllItems.propTypes = {
  resourceType: PropTypes.string.isRequired,
};

export default useFetchAllItems;
