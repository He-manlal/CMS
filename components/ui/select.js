import React, { useState, useRef, useEffect } from "react";

// Main Select Component
export default function Select({ children, onValueChange }) {
  const [selectedValue, setSelectedValue] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (value) => {
    setSelectedValue(value);
    setIsOpen(false);
    if (onValueChange) {
      onValueChange(value);
    }
  };

  return (
    <div className="relative">
      {children.map((child, index) => {
        if (React.isValidElement(child)) {
          // Ensure child is a valid React element
          if (child.type === SelectTrigger) {
            // Pass props to SelectTrigger
            return React.cloneElement(child, { selectedValue, setIsOpen, isOpen, key: index });
          } else if (child.type === SelectContent) {
            // Only render SelectContent if isOpen is true
            return isOpen
              ? React.cloneElement(child, { handleSelect, key: index })
              : null;
          }
          return React.cloneElement(child, { key: index }); // Add key for other children
        }
        return null; // Return null if the child is not valid
      })}
    </div>
  );
}

// SelectTrigger Component
export function SelectTrigger({ selectedValue, setIsOpen, isOpen, children }) {
  const handleClick = () => setIsOpen((prev) => !prev); // Toggle open state

  return (
    <button
      type="button" // Ensure this does not submit the form
      onClick={handleClick}
      className="px-4 py-2 bg-gray-200 text-black w-full flex justify-between items-center"
    >
      {selectedValue || children}
      <span>{isOpen ? "▲" : "▼"}</span>
    </button>
  );
}

// SelectContent Component
export function SelectContent({ children, handleSelect }) {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false); // Close dropdown on outside click
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="absolute bg-white border border-gray-300 shadow-md w-full z-10"
    >
      {children.map((child, index) =>
        React.cloneElement(child, { handleSelect, key: index }) // Pass handleSelect to children
      )}
    </div>
  );
}

// SelectItem Component
export function SelectItem({ value, children, handleSelect }) {
  return (
    <div
      onClick={() => handleSelect(value)}
      className="px-4 py-2 cursor-pointer hover:bg-gray-200"
    >
      {children}
    </div>
  );
}

// SelectValue Component
export function SelectValue({ placeholder, selectedValue }) {
  return <span>{selectedValue || placeholder}</span>;
}
/*
// Example usage of the Select component
export function ExampleSelect() {
  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent form submission
    console.log("Form submitted");
  };

  return (
    <form onSubmit={handleSubmit}>
      <Select onValueChange={(value) => console.log("Selected value:", value)}>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
          <SelectItem value="option3">Option 3</SelectItem>
        </SelectContent>
      </Select>
      <button type="submit">Submit</button> 
    </form>
  );
}
*/
