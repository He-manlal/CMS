// components/ui/badge.js

import PropTypes from 'prop-types';

const Badge = ({ children, className }) => {
  return (
    <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${className}`}>
      {children}
    </span>
  );
};

// Adding PropTypes for validation
Badge.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

// Default export
export default Badge;


