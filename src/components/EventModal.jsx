import { useContext, useState } from "react";
import GlobalContext from "../context/GlobalContext";

const labelClasses = ["blue", "indigo", "gray", "green", "red", "purple"];

const EventModal = () => {
  const {
    setShowEventModal,
    daySelected,
    dispatchCalenderEvents,
    selectedEvent,
  } = useContext(GlobalContext);

  const [title, setTitle] = useState(selectedEvent ? selectedEvent.title : "");
  const [description, setDescription] = useState(
    selectedEvent ? selectedEvent.description : ""
  );
  const [selectedLabel, setSelectedLabel] = useState(
    selectedEvent
      ? labelClasses.find((label) => selectedEvent.label === label)
      : labelClasses[0]
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    const calendarEvent = {
      title,
      description,
      label: selectedLabel,
      day: daySelected.valueOf(),
      id: selectedEvent ? selectedEvent.id : Date.now(),
    };

    if (selectedEvent) {
      dispatchCalenderEvents({ type: "update", payload: calendarEvent });
    } else {
      dispatchCalenderEvents({ type: "push", payload: calendarEvent });
    }

    setShowEventModal(false);
  };

  return (
    <div className="fixed h-screen w-full left-0 top-0 flex justify-center items-center">
      <form className="bg-white rounded-lg shadow-xl w-1/4">
        <header className="bg-gray-100 px-4 py-2 flex justify-between items-center">
          <span className="material-symbols-rounded text-gray-400">
            drag_handle
          </span>
          <div>
            {selectedEvent && (
              <span
                onClick={() => {
                  dispatchCalenderEvents({
                    type: "delete",
                    payload: selectedEvent,
                  });
                  setShowEventModal(false);
                }}
                className="material-symbols-rounded text-gray-400 cursor-pointer"
              >
                delete
              </span>
            )}
            <button onClick={() => setShowEventModal(false)}>
              <span className="material-symbols-rounded text-gray-400">
                close
              </span>
            </button>
          </div>
        </header>
        <div className="p-3">
          <div className="grid grid-cols-1/5 gap-y-7 items-center">
            <div></div>
            <input
              className="pt-3 border-0 text-gray-600 text-xl font-semibold pb-2 w-full border-b-2 border-gray-200 focus:ring-0 focus:border-blue-500"
              type="text"
              name="title"
              placeholder="Add title"
              value={title}
              required
              onChange={({ target: { value } }) => setTitle(value)}
            />
            <span className="material-symbols-rounded text-gray-400">
              schedule
            </span>
            <p>{daySelected.format("dddd, MMMM DD")}</p>
            <span className="material-symbols-rounded text-gray-400">
              segment
            </span>
            <input
              className="pt-3 border-0 text-gray-600 pb-2 w-full border-b-2 border-gray-200 focus:ring-0 focus:border-blue-500"
              type="text"
              name="description"
              placeholder="Add a description"
              value={description}
              required
              onChange={({ target: { value } }) => setDescription(value)}
            />
            <span className="material-symbols-rounded text-gray-400">
              bookmarks
            </span>
            <div className="flex gap-x-2">
              {labelClasses.map((labelClass, index) => (
                <span
                  key={index}
                  onClick={() => setSelectedLabel(labelClass)}
                  className={`w-6 h-6 bg-${labelClass}-500 rounded-full flex items-center justify-center cursor-pointer`}
                >
                  {selectedLabel === labelClass && (
                    <span className="material-symbols-rounded text-white text-sm">
                      check
                    </span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>
        <footer className="flex justify-end border-t p-3 mt-5">
          <button
            type="submit"
            onClick={handleSubmit}
            className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded text-white"
          >
            Save
          </button>
        </footer>
      </form>
    </div>
  );
};

export default EventModal;
