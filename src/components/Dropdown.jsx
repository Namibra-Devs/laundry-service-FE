import PropTypes from "prop-types";
import { useState } from "react";

const Dropdown = ({ options, item, setItem, label }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <label className={`${label ? "block" : "hidden"} text-sm mb-1`}>
        {label}
      </label>
      <div className="relative text-dark cursor-pointer">
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between border-2 border-gray-300 rounded-md px-4 py-2 w-full text-sm"
        >
          {item ? item : "-- select --"}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
        {isOpen && (
          <ul className="absolute z-10 bg-white border border-gray-300 rounded-md mt-1 w-fit">
            {options?.map((option, index) => (
              <li
                key={index}
                className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer w-[10rem]"
                onClick={() => {
                  setItem(option?._id);
                  setIsOpen(false);
                }}
              >
                {option?.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

Dropdown.propTypes = {
  options: PropTypes.array.isRequired,
  item: PropTypes.string,
  setItem: PropTypes.func.isRequired,
  label: PropTypes.string,
};

export default Dropdown;
