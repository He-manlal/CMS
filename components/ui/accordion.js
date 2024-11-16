import * as React from "react";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";

export const Accordion = ({ children, type = "multiple" }) => {
  const [open, setOpen] = React.useState(type === "single" ? [] : []);

  const handleToggle = (value) => {
    if (type === "single") {
      setOpen(open[0] === value ? [] : [value]);
    } else {
      setOpen((prev) =>
        prev.includes(value)
          ? prev.filter((item) => item !== value)
          : [...prev, value]
      );
    }
  };

  return (
    <div>{React.Children.map(children, (child) => React.cloneElement(child, { onToggle: handleToggle, open }))}</div>
  );
};

export const AccordionItem = ({ children, value, open, onToggle }) => {
  return (
    <div className="border-b border-gray-300">
      {React.Children.map(children, (child) => {
        if (child.type === AccordionTrigger) {
          return React.cloneElement(child, { onClick: () => onToggle(value) });
        }
        if (child.type === AccordionContent) {
          return React.cloneElement(child, { open: open.includes(value) });
        }
        return child;
      })}
    </div>
  );
};

export const AccordionTrigger = ({ children, onClick }) => {
  return (
    <button
      className="flex justify-between w-full px-4 py-2 bg-gray-100 text-lg font-semibold text-left"
      onClick={onClick}
    >
      {children}
      <ChevronDownIcon className="h-5 w-5" />
    </button>
  );
};

export const AccordionContent = ({ children, open }) => {
  return open ? (
    <div className="px-4 py-2 bg-gray-50">{children}</div>
  ) : null;
};
