// components/ui/label.js

import PropTypes from 'prop-types';

const Label = ({ children, className, ...props }) => {
  return (
    <label className={`text-sm font-medium text-gray-700 ${className}`} {...props}>
      {children}
    </label>
  );
};

// Adding PropTypes for validation
Label.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default Label;

