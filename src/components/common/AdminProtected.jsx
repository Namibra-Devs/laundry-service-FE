import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import PropTypes from "prop-types";

const AdminProtected = ({ children }) => {
  const { auth } = useAuth();
  const location = useLocation();

  return (
    <>
      {auth?.role === "admin" ? (
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
