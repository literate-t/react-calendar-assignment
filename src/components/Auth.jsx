import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { getColorId, setGapiClient } from "../util";
import GlobalContext from "../context/GlobalContext";
import LibraryContext from "../context/LibraryContext";

const SCOPES = "https://www.googleapis.com/auth/calendar";

const Auth = () => {
  // const [apiLoading, apiError] = useScript("https://apis.google.com/js/api.js");
  // const [gsiLoading, gsiError] = useScript(
  //   "https://accounts.google.com/gsi/client"
  // );

  const navigate = useNavigate();

  const { dispatchCalenderEvents } = useContext(GlobalContext);
  const { gapi, google } = useContext(LibraryContext);

  // const intializeGapiClient = async () => {
  //   await gapi.client.init({
  //     apiKey: process.env.REACT_APP_API_KEY,
  //     discoveryDocs: [process.env.REACT_APP_DISCOVERY_DOC],
  //   });
  // };

  setGapiClient(gapi);

  // gapi.load("client", () => intializeGapiClient(gapi));

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
      // 이 과정에서 tokenClient의 callback 함수가 호출됨
      tokenClient.requestAccessToken({ prompt: "consent" });
    } else {
      tokenClient.requestAccessToken({ prompt: "" });
    }
  };

  const listUpcomingEvents = async () => {
    let response;
    try {
      const request = {
        calendarId: "primary",
        timeMin: new Date().toISOString(),
        showDeleted: false,
        singleEvents: true,
        maxResults: 10,
        orderBy: "startTime",
      };
      response = await gapi.client.calendar.events.list(request);
    } catch (err) {
      console.err(err);

      return;
    }

    const events = response.result.items.map((item) => ({
      summary: item.summary,
      description: item.description ? item.description : "",
      colorId: item.colorId ? item.colorId : getColorId(),
      ...(item.start.date
        ? { date: item.start.date }
        : { dateTime: item.start.dateTime }),
      id: item.id,
    }));

    dispatchCalenderEvents({ type: "init", payload: events });

    navigate("/calendar");

    // navigate("/calendar", { state: events });
    // if (!events || events.length === 0) {
    //   setOutput("No events found.");
    //   return;
    // }

    // const result = events.reduce(
    //   (str, event) =>
    //     `${str}${event.summary} (${
    //       event.start.dateTime || event.start.date
    //     } - ${event.end.dateTime || event.end.date})\n`,
    //   "Events:\n"
    // );

    // setOutput(result);
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
