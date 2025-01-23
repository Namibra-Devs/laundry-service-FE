import PropTypes from "prop-types";
import { useState, useCallback, useEffect } from "react";
import useAuth from "./useAuth";
import axios from "@/api/axios";
import { isTokenValid } from "@/lib/utils/validateToken";

const useFetchOne = ({ endpoint }) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const {
    auth: { accessToken },
  } = useAuth();

  const fetchData = useCallback(async () => {
    setError("");

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
    }
  }, [accessToken, endpoint]);

  useEffect(() => {
    if (endpoint) {
      fetchData();
    }
  }, [fetchData, endpoint]);

  return { data, error };
};

useFetchOne.propTypes = {
  endpoint: PropTypes.string.isRequired,
};

export default useFetchOne;
