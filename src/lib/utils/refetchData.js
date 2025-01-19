import axios from "@/api/axios";

export const refetchData = async ({ setData, accessToken, endpoint }) => {
  try {
    console.log("Refetching data...");

    if (!endpoint || !accessToken) {
      console.error(
        "endpoint or access token is missing. Cannot fetch branches."
      );
      return;
    }

    const response = await axios.get(endpoint, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const fetchedData = response?.data?.data;

    if (Array.isArray(fetchedData)) {
      setData([...fetchedData].reverse());
      console.log("Fetched Data:", fetchedData);
    } else {
      console.warn("Unexpected data format received:", fetchedData);
    }
  } catch (error) {
    if (!error?.response) {
      console.error("Network error or no response from the server.");
    } else if (error.response.status === 401) {
      console.error(
        "Unauthorized. Please check the access token or log in again."
      );
    } else {
      console.error(
        "Error fetching data:",
        error.response?.data?.message || error.message
      );
    }
  }
};
