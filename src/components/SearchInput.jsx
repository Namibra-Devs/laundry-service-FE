import { Search } from "lucide-react";
import PropTypes from "prop-types";

const SearchInput = ({ placeholder }) => {
  return (
    <div className="flex items-center border-2 border-gray-300 rounded-md p-2 w-full max-w-sm">
      <Search className="cursor-pointer" />
      <input
        type="text"
        placeholder={placeholder}
        className="outline-none flex-1 text-dark placeholder-gray-400 ml-1"
      />
    </div>
  );
};

SearchInput.propTypes = {
  placeholder: PropTypes.string.isRequired,
};

export default SearchInput;
