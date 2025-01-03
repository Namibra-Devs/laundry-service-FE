import PropTypes from "prop-types";

const Input = ({ label, name, id, value, onChange, type }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm" htmlFor={id}>
        {label}
      </label>
      <input
        type={type}
        id={id}
        name={name ? name : ""}
        value={value}
        onChange={onChange}
        required
        className="mt-1 block w-full p-2 border rounded-md border-gray-300 focus:ring-red-500 focus:border-red-500 text-gray-600"
      />
    </div>
  );
};

Input.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  id: PropTypes.any,
  value: PropTypes.any,
  type: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default Input;
