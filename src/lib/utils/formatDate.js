export const formatDate = (isoDate, includeTime = false) => {
  const date = new Date(isoDate);

  // Format for the date
  const dateOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };

  const formattedDate = date.toLocaleDateString("en-US", dateOptions);

  if (includeTime) {
    // Format for the time
    const timeOptions = {
      hour: "2-digit",
      minute: "2-digit",
    };

    const formattedTime = date.toLocaleTimeString("en-US", timeOptions);
    return `${formattedDate}, ${formattedTime}`;
  }

  return formattedDate;
};
