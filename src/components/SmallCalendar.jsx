import dayjs from "dayjs";
import React, { useContext, useEffect, useState } from "react";
import GlobalContext from "../context/GlobalContext";
import { getMonth } from "../util";

const SmallCalendar = () => {
  const [currentCalendarIndex, setCurrentCalendarIndex] = useState(
    dayjs().month()
  );
  const [currentCalendar, setCurrentCalendar] = useState(getMonth());

  useEffect(() => {
    setCurrentCalendar(getMonth(currentCalendarIndex));
  }, [currentCalendarIndex]);

  const {
    monthIndex,
    setSmallCalendarMonthIndex,
    setDaySelected,
    daySelected,
  } = useContext(GlobalContext);

  useEffect(() => {
    setCurrentCalendarIndex(monthIndex);
  }, [monthIndex]);

  const handlePrevCalendar = () => {
    setCurrentCalendarIndex((index) => index - 1);
  };

  const handleNextCalendar = () => {
    setCurrentCalendarIndex((index) => index + 1);
  };

  const getDayClass = (day) => {
    const format = "DD-MM-YY";
    const today = dayjs().format(format);
    const currDay = day.format(format);
    const selectedDay = daySelected?.format(format);

    if (today === currDay) {
      return "bg-blue-500 rounded-full text-white";
    } else if (selectedDay === currDay) {
      return "bg-blue-100 rounded-full text-blue-600 font-bold";
    } else {
      return "";
    }
  };

  return (
    <div className="mt-9">
      <header className="flex justify-between">
        <p className="text-gray-500 font-bold">
          {dayjs(new Date(dayjs().year(), currentCalendarIndex)).format(
            "MMMM YYYY"
          )}
        </p>
        <div>
          <button onClick={handlePrevCalendar}>
            <span className="material-symbols-rounded cursor-pointer text-gray-600 mx-2">
              chevron_left
            </span>
          </button>
          <button onClick={handleNextCalendar}>
            <span className="material-symbols-rounded cursor-pointer text-gray-600 mx-2">
              chevron_right
            </span>
          </button>
        </div>
      </header>
      <div className="grid grid-cols-7 grid-rows-6">
        {currentCalendar[0].map((date, i) => (
          <span key={i} className="text-sm py-1 text-center">
            {date.format("dd").charAt(0)}
          </span>
        ))}
        {currentCalendar.map((row, index) => (
          <React.Fragment key={index}>
            {row.map((day, idx) => (
              <button
                onClick={() => {
                  setSmallCalendarMonthIndex(currentCalendarIndex);
                  setDaySelected(day);
                }}
                key={idx}
                className={`py-1 ${getDayClass(day)}`}
              >
                <span data-date={`${day.format("D")}`} className="text-sm">
                  {day.format("D")}
                </span>
              </button>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default SmallCalendar;
