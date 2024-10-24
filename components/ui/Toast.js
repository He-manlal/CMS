// components/ui/toast.js

import PropTypes from 'prop-types';

const Toast = ({ toast, onRemove }) => {
  return (
    <div className="bg-gray-800 text-white p-4 rounded-md shadow-md mb-2">
      {toast.title && <strong>{toast.title}</strong>}
      {toast.description && <p>{toast.description}</p>}
      <button onClick={onRemove} className="text-red-400 ml-2">
        ×
      </button>
    </div>
  );
};

Toast.propTypes = {
  toast: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string,
    description: PropTypes.string,
  }).isRequired,
  onRemove: PropTypes.func.isRequired,
};

export default Toast;

