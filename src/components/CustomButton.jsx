import PropTypes from "prop-types";

const CustomButton = ({ type, label, onClick, icon, variant }) => {
  return (
    <button
      type={type ? type : "button"}
      onClick={onClick}
      className={`w-fit outline-none py-1 px-2 sm:py-2 sm:px-5 rounded-md focus:outline-none flex items-center sm:gap-x-2 border-2 text-dark active:scale-105 transition-all duration-300 ${
        variant === "outlined"
          ? "bg-transparent border-gray-300 active:bg-gray-300"
          : "bg-custom_yellow  border-transparent active:bg-custom_yellow_dark"
      }`}
    >
      {icon ? icon : ""}
      {label}
    </button>
  );
};

CustomButton.propTypes = {
  type: PropTypes.string,
  label: PropTypes.string.isRequired,
  icon: PropTypes.element,
  variant: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default CustomButton;
