import dayjs from "dayjs";
import { useEffect, useMemo, useReducer, useState } from "react";
import GlobalContext from "./GlobalContext";

const savedEventsReducer = (state, { type, payload }) => {
  switch (type) {
    case "init":
      return [...payload];
    case "push":
      return [...state, payload];
    case "update":
      return state.map((event) => (event.id === payload.id ? payload : event));
    case "delete":
      return state.filter((event) => event.id !== payload.id);
    default:
      throw new Error();
  }
};

const initEvents = () => {
  const storageEvents = localStorage.getItem("savedEvents");
  const parsedEvents = storageEvents ? JSON.parse(storageEvents) : [];
  // console.log("initEvents");
  return parsedEvents;
};

const ContextWrapper = ({ children }) => {
  const [monthIndex, setMonthIndex] = useState(dayjs().month());
  const [date, setDate] = useState(dayjs().date());
  const [smallCalendarMonthIndex, setSmallCalendarMonthIndex] = useState(null);
  const [daySelected, setDaySelected] = useState(dayjs());
  const [showEventModel, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [labels, setLabels] = useState([]);
  const [savedEvents, dispatchCalenderEvents] = useReducer(
    savedEventsReducer,
    [],
    initEvents
  );

  const filteredEvents = useMemo(() => {
    return savedEvents.filter((event) =>
      labels
        .filter((item) => item.checked)
        .map((item) => item.label)
        .includes(event.label)
    );
  }, [savedEvents, labels]);

  useEffect(() => {
    localStorage.setItem("savedEvents", JSON.stringify(savedEvents));
  }, [savedEvents]);

  useEffect(() => {
    if (!showEventModel) {
      setSelectedEvent(null);
    }
  }, [showEventModel]);

  useEffect(() => {
    setLabels((prev) => {
      return [...new Set(savedEvents.map((event) => event.label))].map(
        (label) => {
          const currentLabel = prev.find((item) => item.label === label);
          return {
            label,
            checked: currentLabel ? currentLabel.checked : true,
          };
        }
      );
    });
  }, [savedEvents]);

  const updateLabel = (labelObj) => {
    setLabels((prevItems) =>
      prevItems.map((item) => (item.label === labelObj.label ? labelObj : item))
    );
  };

  return (
    <GlobalContext.Provider
      value={{
        monthIndex,
        setMonthIndex,
        date,
        setDate,
        smallCalendarMonthIndex,
        setSmallCalendarMonthIndex,
        daySelected,
        setDaySelected,
        showEventModel,
        setShowEventModal,
        dispatchCalenderEvents,
        savedEvents,
        selectedEvent,
        setSelectedEvent,
        setLabels,
        labels,
        updateLabel,
        filteredEvents,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
export default ContextWrapper;
