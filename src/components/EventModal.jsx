import { useContext, useState } from 'react';
import GlobalContext from '../context/GlobalContext';
import LibraryContext from '../context/LibraryContext';
import { useNavigate } from 'react-router-dom';
import {
  getColor,
  getColorId,
  labelColorClasses,
  postRequest,
  SCOPE,
  setGapiClient,
  YYYYMMDDFormat,
} from '../util';

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
    scope: SCOPE,
    callback: '',
  });

  const [summary, setSummary] = useState(
    selectedEvent ? selectedEvent.summary : ''
  );

  const [description, setDescription] = useState(
    selectedEvent ? selectedEvent.description : ''
  );

  const [selectedLabel, setSelectedLabel] = useState(
    selectedEvent
      ? labelColorClasses.find(
          (labelColor) => getColor(selectedEvent.colorId) === labelColor
        )
      : labelColorClasses[0]
  );

  const navigate = useNavigate();
  const handleCode = (code) => {
    if (code === 401) {
      navigate('/');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const event = {
      summary: summary ? summary : '제목없음',
      description,
      colorId: getColorId(selectedLabel),
      ...(!selectedEvent
        ? { date: daySelected.format(YYYYMMDDFormat) }
        : selectedEvent.date
        ? { date: selectedEvent.date }
        : { dateTime: selectedEvent.dateTime }),
      ...(selectedEvent ? { id: selectedEvent.id } : null),
    };

    if (selectedEvent) {
      gapi.client.calendar.events
        .patch({
          calendarId: 'primary',
          eventId: event.id,
          resource: event,
        })
        .execute((result) => {
          postRequest(result, 'insert', () =>
            dispatchCalenderEvents({ type: 'update', payload: event })
          );
          handleCode(result.code);
        });
    } else {
      const insertEvent = {
        ...event,
        end: {
          date: daySelected.format(YYYYMMDDFormat),
        },
        start: {
          date: daySelected.format(YYYYMMDDFormat),
        },
      };

      gapi.client.calendar.events
        .insert({
          calendarId: 'primary',
          resource: insertEvent,
        })
        .execute((result) => {
          postRequest(result, 'insert', () =>
            dispatchCalenderEvents({
              type: 'push',
              payload: {
                ...event,
                id: result.id,
              },
            })
          );
          handleCode(result.code);
        });
    }

    setShowEventModal(false);
  };

  const handleDelete = () => {
    gapi.client.calendar.events
      .delete({
        calendarId: 'primary',
        eventId: selectedEvent.id,
      })
      .execute((result) => {
        postRequest(result, 'delete', () => {
          dispatchCalenderEvents({
            type: 'delete',
            payload: selectedEvent,
          });
        });
        handleCode(result.code);
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
            <p>{daySelected.format('dddd, MMMM DD')}</p>
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
