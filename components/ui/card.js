// components/ui/card.js

import PropTypes from 'prop-types';

const Card = ({ children, className }) => {
  return (
    <div className={`bg-white shadow-md rounded-lg p-4 ${className}`}>
      {children}
    </div>
  );
};

const CardHeader = ({ children }) => {
  return (<div className="mb-4">{children} </div>);
};

const CardTitle = ({ children }) => {
  return (<h2 className="text-xl font-bold">{children}</h2>);
};

const CardDescription = ({ children }) => {
  return (<p className="text-sm text-gray-600">{children}</p>);
};

const CardContent = ({ children }) => {
  return (<div className="py-2">{children}</div>);
};

const CardFooter = ({ children }) => {
  return (<div className="mt-4">{children}</div>);
};

// Prop types for validation
Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

CardHeader.propTypes = {
  children: PropTypes.node.isRequired,
};

CardTitle.propTypes = {
  children: PropTypes.node.isRequired,
};

CardDescription.propTypes = {
  children: PropTypes.node.isRequired,
};

CardContent.propTypes = {
  children: PropTypes.node.isRequired,
};

CardFooter.propTypes = {
  children: PropTypes.node.isRequired,
};

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
