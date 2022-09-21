import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { getColorId, setGapiClient } from '../util';
import GlobalContext from '../context/GlobalContext';
import LibraryContext from '../context/LibraryContext';

const SCOPES = 'https://www.googleapis.com/auth/calendar';

const Auth = () => {
  const navigate = useNavigate();

  const { dispatchCalenderEvents } = useContext(GlobalContext);

  const { gapi, google } = useContext(LibraryContext);

  // 라이브러리 초기화
  setGapiClient(gapi);

  const tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: process.env.REACT_APP_CLIENT_ID,
    scope: SCOPES,
    callback: async (resp) => {
      if (resp.error !== undefined) {
        throw resp;
      }
      await listUpcomingEvents();
    },
  });

  const handleAuth = () => {
    if (gapi.client.getToken() === null) {
      // tokenClient의 callback 함수가 호출됨
      tokenClient.requestAccessToken({ prompt: 'consent' });
    } else {
      tokenClient.requestAccessToken({ prompt: '' });
    }
  };

  const listUpcomingEvents = async () => {
    let response;
    try {
      const request = {
        calendarId: 'primary',
        timeMin: new Date().toISOString(),
        showDeleted: false,
        singleEvents: true,
        maxResults: 10,
        orderBy: 'startTime',
      };

      response = await gapi.client.calendar.events.list(request);
    } catch (err) {
      console.err(err);

      return;
    }

    const events = response.result.items.map((item) => ({
      summary: item.summary,
      description: item.description ? item.description : '',
      colorId: item.colorId ? item.colorId : getColorId(),
      ...(item.start.date
        ? { date: item.start.date }
        : { dateTime: item.start.dateTime }),
      id: item.id,
    }));

    console.log(events);

    dispatchCalenderEvents({ type: 'init', payload: events });

    navigate('/calendar');
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <button
        className="bg-gray-400 w-20 h-10 font-semibold border rounded text-white"
        onClick={handleAuth}
      >
        Auth
      </button>
    </div>
  );
};

export default Auth;
