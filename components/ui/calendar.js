import { useState } from "react";

const Calendar = ({ selected, onSelect, mode, initialFocus }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const days = Array.from({ length: daysInMonth }, (_, index) => index + 1);

  const handleDateClick = (day) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    onSelect(date);
  };

  const renderDays = () => {
    const gridDays = [];

    // Add empty slots for the days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      gridDays.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // Add the days of the month
    days.forEach((day) => {
      gridDays.push(
        <div
          key={day}
          className={`calendar-day p-2 w-12 h-12 flex items-center justify-center rounded-md cursor-pointer ${
            selected && selected.getDate && selected.getDate() === day
              ? "bg-green-500 text-white"
              : "bg-gray-200"
          }`}
          onClick={() => handleDateClick(day)}
        >
          {day}
        </div>
      );
    });

    return gridDays;
  };

  return (
    <div className="calendar-container w-full max-w-[300px] mx-auto">
      <div className="calendar-header flex justify-between items-center mb-4">
        <button
          className="p-2 rounded-md bg-gray-200"
          onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
        >
          Prev
        </button>
        <span>{currentDate.toLocaleString("default", { month: "long" })} {currentDate.getFullYear()}</span>
        <button
          className="p-2 rounded-md bg-gray-200"
          onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
        >
          Next
        </button>
      </div>
      <div className="calendar-grid grid grid-cols-7 gap-2">
        {renderDays()}
      </div>
    </div>
  );
};

export default Calendar;
