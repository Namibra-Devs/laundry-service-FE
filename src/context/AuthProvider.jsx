import { createContext } from "react";
import PropTypes from "prop-types";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const values = {
    user: {},
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

// Prop validation
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;
