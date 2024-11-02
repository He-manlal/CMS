// Table Component
export function Table({ children }) {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 divide-y divide-gray-200">
          {children}
        </table>
      </div>
    );
  }
  
  // TableHeader Component
  export function TableHeader({ children }) {
    return <thead className="bg-gray-100">{children}</thead>;
  }
  
  // TableRow Component
  export function TableRow({ children }) {
    return <tr className="border-b border-gray-200">{children}</tr>;
  }
  
  // TableHead Component
  export function TableHead({ children }) {
    return (
      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
        {children}
      </th>
    );
  }
  
  // TableBody Component
  export function TableBody({ children }) {
    return <tbody className="bg-white divide-y divide-gray-200">{children}</tbody>;
  }
  
  // TableCell Component
  export function TableCell({ children }) {
    return (
      <td className="px-4 py-2 text-sm text-gray-600 whitespace-nowrap">
        {children}
      </td>
    );
  }
  