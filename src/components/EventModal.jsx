import { useContext, useState } from "react";
import GlobalContext from "../context/GlobalContext";
import LibraryContext from "../context/LibraryContext";
import {
  getColor,
  getColorId,
  labelColorClasses,
  postRequest,
  setGapiClient,
} from "../util";

const SCOPES = "https://www.googleapis.com/auth/calendar";

const EventModal = () => {
  const {
    setShowEventModal,
    daySelected,
    dispatchCalenderEvents,
    selectedEvent,
  } = useContext(GlobalContext);

  const { gapi, google } = useContext(LibraryContext);

  setGapiClient(gapi);

  google.accounts.oauth2.initTokenClient({
    client_id: process.env.REACT_APP_CLIENT_ID,
    scope: SCOPES,
    callback: "",
  });

  const [summary, setSummary] = useState(
    selectedEvent ? selectedEvent.summary : ""
  );

  const [description, setDescription] = useState(
    selectedEvent ? selectedEvent.description : ""
  );

  const [selectedLabel, setSelectedLabel] = useState(
    selectedEvent
      ? labelColorClasses.find(
          (labelColor) => getColor(selectedEvent.colorId) === labelColor
        )
      : labelColorClasses[0]
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    const event = {
      summary,
      description,
      colorId: getColorId(selectedLabel),
      ...(!selectedEvent
        ? { date: daySelected.format("YYYY-MM-DD") }
        : selectedEvent.date
        ? { date: selectedEvent.date }
        : { dateTime: selectedEvent.dateTime }),
      ...(selectedEvent ? { id: selectedEvent.id } : null),
    };

    if (selectedEvent) {
      gapi.client.calendar.events
        .patch({
          calendarId: "primary",
          eventId: event.id,
          resource: event,
        })
        .execute((result) => {
          // if (event.code === 400) {
          //   alert("요청이 잘못됐어요");
          // } else if (event.code === 401) {
          //   alert("다시 로그인 해주세요");
          // } else {
          //   alert("이벤트 수정이 성공했어요");
          //   dispatchCalenderEvents({ type: "update", payload: event });
          // }
          postRequest(result, () =>
            dispatchCalenderEvents({ type: "update", payload: event })
          );
          console.log("patch", result);
        });
    } else {
      const insertEvent = {
        ...event,
        end: {
          date: daySelected.format("YYYY-MM-DD"),
        },
        start: {
          date: daySelected.format("YYYY-MM-DD"),
        },
      };

      gapi.client.calendar.events
        .insert({
          calendarId: "primary",
          resource: insertEvent,
        })
        .execute((result) => {
          // dispatchCalenderEvents({
          //   type: "push",
          //   payload: {
          //     ...insertEvent,
          //     id: event.id,
          //   },
          // });
          postRequest(result, () => {
            // const newEvent = {
            //   ...event
            // }
            console.log("insert", event);

            dispatchCalenderEvents({
              type: "push",
              payload: {
                ...event,
                id: result.id,
              },
            });
          });

          //console.log("insert", result);
        });
    }

    setShowEventModal(false);
  };

  const handleDelete = () => {
    // dispatchCalenderEvents({
    //   type: "delete",
    //   payload: selectedEvent,
    // });

    gapi.client.calendar.events
      .delete({
        calendarId: "primary",
        eventId: selectedEvent.id,
      })
      .execute((result) => {
        postRequest(result, () =>
          dispatchCalenderEvents({
            type: "delete",
            payload: selectedEvent,
          })
        );

        console.log("delete", result);
      });

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
                onClick={handleDelete}
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
              name="summary"
              placeholder="Add title"
              value={summary}
              required
              onChange={({ target: { value } }) => setSummary(value)}
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
              {labelColorClasses.map((labelClass, index) => (
                <span
                  key={index}
                  onClick={() => setSelectedLabel(labelClass)}
                  className={`w-6 h-6 bg-${labelClass} rounded-full flex items-center justify-center cursor-pointer`}
                >
                  {/* {console.log(selectedLabel, labelClass)} */}
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
