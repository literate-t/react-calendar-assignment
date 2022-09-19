import React from "react";
import Date from "./Date";
const Calendar = ({ calendar }) => {
  return (
    <div className="flex-1 grid grid-cols-7 grid-rows-1">
      {calendar.map((date, index) => (
        <Date key={index} date={date} />
      ))}
    </div>
  );
};

export default Calendar;
