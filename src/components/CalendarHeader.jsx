import dayjs from "dayjs";
import { useContext } from "react";
import logo from "../assets/logo.png";
import GlobalContext from "../context/GlobalContext";
import { getWeek } from "../util";

const CalendarHeader = () => {
  const { setDate, date } = useContext(GlobalContext);

  const handlePrevMonth = () => {
    setDate((index) => index - 7);
  };

  const handleNextMonth = () => {
    setDate((index) => index + 7);
  };

  const getYearMonth = () => {
    const week = getWeek(date);
    for (let i = 0; i < week.length; ++i) {
      if (i !== 0 && week[i].format("DD") === "01") {
        return `${week[0].format("MMMM")}/${week[i].format("MMMM YYYY")}`;
      }
    }
    return week[0].format("MMMM YYYY");
  };

  const handleToday = () => {
    setDate(dayjs().date());
  };

  return (
    <header className="px-4 py-2 flex items-center">
      <img src={logo} alt="calendar" className="mr-2 w-12 h-12" />
      <h1 className="mr-10 text-xl text-gray-500 font-bold"> Calendar</h1>
      <button onClick={handleToday} className="border rounded py-2 px-4 mr-5">
        Today
      </button>
      <button onClick={handlePrevMonth}>
        <span className="material-symbols-rounded cursor-pointer text-gray-600 mx-2">
          arrow_back
        </span>
      </button>
      <button onClick={handleNextMonth}>
        <span className="material-symbols-rounded cursor-pointer text-gray-600 mx-2">
          arrow_forward
        </span>
      </button>
      <h2 className="ml-4 text-xl text-gray-600 font-bold">{getYearMonth()}</h2>
    </header>
  );
};

export default CalendarHeader;
