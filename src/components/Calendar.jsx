import React, { useContext } from "react";
import Date from "./Date";
import GlobalContext from "../context/GlobalContext";

const Calendar = ({ calendar }) => {
  // const { savedEvents } = useContext(GlobalContext);

  // console.log(savedEvents);
  return (
    <div className="flex-1 grid grid-cols-7 grid-rows-1">
      {calendar.map((date, index) => (
        <Date key={index} date={date} />
      ))}
    </div>
  );
};

export default Calendar;
