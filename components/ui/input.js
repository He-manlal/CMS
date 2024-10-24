// components/ui/input.js

import PropTypes from 'prop-types';

const Input = ({ className, ...props }) => {
  return (
    <input
      className={`border border-gray-300 rounded-md p-2 ${className}`}
      {...props}
    />
  );
};

// Adding PropTypes for validation
Input.propTypes = {
  className: PropTypes.string,
};

export default Input;
