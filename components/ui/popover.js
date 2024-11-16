import React, { useState } from "react";

export const Popover = ({ children }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      {React.Children.map(children, (child) => {
        if (child.type === PopoverTrigger) {
          return React.cloneElement(child, { onClick: () => setOpen(!open) });
        }
        if (child.type === PopoverContent) {
          return React.cloneElement(child, { open });
        }
        return child;
      })}
    </div>
  );
};

export const PopoverTrigger = ({ children, onClick }) => {
  return (
    <button
      className="inline-flex items-center px-4 py-2 bg-gray-100 text-lg font-medium border rounded-md"
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export const PopoverContent = ({ children, open }) => {
  return (
    open && (
      <div className="absolute mt-2 p-4 w-60 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
        {children}
      </div>
    )
  );
};

