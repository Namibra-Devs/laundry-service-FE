import { Users, Grid2X2Icon } from "lucide-react";
import PropTypes from "prop-types";

const ViewToggle = ({ activeMode, setActiveMode }) => {
  return (
    <div className="w-fit flex items-center gap-2 bg-gray-100 p-1 rounded-md shadow-sm">
      <button
        onClick={() => setActiveMode("table")}
        className={`flex items-center justify-center w-10 h-10 rounded-md transition-all duration-300 ${
          activeMode === "table" ? "bg-white shadow-md" : "bg-transparent"
        }`}
      >
        <Users />
      </button>

      <button
        onClick={() => setActiveMode("containers")}
        className={`flex items-center justify-center w-10 h-10 rounded-md transition-all duration-300 ${
          activeMode === "containers" ? "bg-white shadow-md" : "bg-transparent"
        }`}
      >
        <Grid2X2Icon />
      </button>
    </div>
  );
};

ViewToggle.propTypes = {
  activeMode: PropTypes.string.isRequired,
  setActiveMode: PropTypes.func.isRequired,
};

export default ViewToggle;
