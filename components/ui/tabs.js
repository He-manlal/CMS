import React, { useState } from "react";

// Main Tabs Component
export default function Tabs({ defaultValue, onValueChange, children }) {
  const [activeTab, setActiveTab] = useState(defaultValue);

  const handleChange = (value) => {
    setActiveTab(value);
    if (onValueChange && typeof onValueChange === 'function') {
      onValueChange(value);
    }
  };

  return (
    <div>
      {React.Children.toArray(children).map((child, index) => {
        if (child.type === TabsList) {
          return React.cloneElement(child, { activeTab, onValueChange: handleChange, key: index });
        }
        return React.cloneElement(child, { activeTab, key: index });
      })}
    </div>
  );
}

// TabsList Component
export function TabsList({ children, activeTab, onValueChange }) {
  return (
    <div className="flex space-x-2">
      {React.Children.toArray(children).map((child, index) =>
        React.cloneElement(child, { activeTab, onValueChange, key: index })
      )}
    </div>
  );
}

// TabsTrigger Component
export function TabsTrigger({ value, children, activeTab, onValueChange }) {
  const isActive = activeTab === value;

  return (
    <button
      onClick={() => {
        if (onValueChange && typeof onValueChange === 'function') {
          onValueChange(value);
        } else {
          console.error('onValueChange is not a function:', onValueChange);
        }
      }}
      className={`px-4 py-2 ${
        isActive ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
      }`}
    >
      {children}
    </button>
  );
}

// TabsContent Component
export function TabsContent({ value, children, activeTab }) {
  return activeTab === value ? <div>{children}</div> : null;
}
