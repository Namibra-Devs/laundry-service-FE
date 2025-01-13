import { Navigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import useAuth from "@/hooks/useAuth";

const AdminProtected = ({ children }) => {
  const location = useLocation();

  const {
    auth: { user },
  } = useAuth();

  return (
    <>
      {user?.role === "admin" ? (
        children
      ) : (
        <Navigate to="/unauthorized" state={{ from: location }} replace />
      )}
    </>
  );
};

AdminProtected.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AdminProtected;
