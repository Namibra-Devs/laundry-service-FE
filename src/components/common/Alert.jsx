import { AlertTriangle, AlertOctagon, CheckCircle } from "lucide-react";
import PropTypes from "prop-types";

const Alert = ({ message, type }) => {
  const typeMappings = {
    warning: {
      style: "bg-yellow-100 border-yellow-500 text-yellow-700",
      icon: <AlertTriangle className="w-5 h-5 mr-3" />,
    },
    error: {
      style: "bg-red-200 border-red-500 text-red-700",
      icon: <AlertOctagon className="w-5 h-5 mr-3" />,
    },
    success: {
      style: "bg-green-100 border-green-500 text-green-700",
      icon: <CheckCircle className="w-5 h-5 mr-3" />,
    },
  };

  const { style, icon } = typeMappings[type] || typeMappings.success;

  return (
    <div
      className={`w-[90%] sm:w-[50%] lg:w-[30%] fixed top-5 right-5 z-50 flex items-center p-4 border-l-4 ${style} 
  animate-[fadeInScaleUp_0.3s_ease-out]`}
    >
      {icon}
      <p className="text-sm">{message}</p>
    </div>
  );
};

Alert.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

export default Alert;
