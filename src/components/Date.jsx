import dayjs from "dayjs";
import { useContext, useEffect, useState } from "react";
import GlobalContext from "../context/GlobalContext";
import { getColor, YYMMDDFormat } from "../util";

const Date = ({ date }) => {
  const [dateEvents, setDateEvents] = useState([]);

  const {
    setDaySelected,
    setShowEventModal,
    filteredEvents,
    setSelectedEvent,
  } = useContext(GlobalContext);

  useEffect(() => {
    const events = filteredEvents.filter(
      (event) =>
        dayjs(event.date || event.dateTime).format(YYMMDDFormat) ===
        date.format(YYMMDDFormat)
    );

    setDateEvents(events);
  }, [filteredEvents, date]);

  const getTodayClass = () => {
    return date.format(YYMMDDFormat) === dayjs().format(YYMMDDFormat)
      ? "bg-blue-600 text-white rounded-full w-7"
      : "";
  };

  return (
    <div className="flex flex-col border border-gray-200">
      <header className="flex flex-col items-center">
        <p className="text-sm mt-1">{date.format("ddd").toUpperCase()}</p>
        <p className={`text-sm p-1 my-1 text-center ${getTodayClass()}`}>
          {date.format("DD")}
        </p>
      </header>
      <div
        className="flex-1 cursor-pointer"
        onClick={() => {
          setDaySelected(date);
          setShowEventModal(true);
        }}
      >
        {dateEvents.map((event, index) => (
          <div
            key={index}
            onClick={() => {
              setSelectedEvent(event);
            }}
            className={`bg-${getColor(
              event.colorId
            )} p-1 mr-3 text-white text-sm rounded mb-1 truncate`}
          >
            {event.summary}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Date;
