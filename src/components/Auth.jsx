import { useContext, useState } from "react";
import useScript from "../useScript";
import { useNavigate } from "react-router-dom";
import { getColor } from "../util";
import GlobalContext from "../context/GlobalContext";

const API_KEY = "AIzaSyCwIr8gPqmZdCw7r5f7MWZMaPkHW3PtQJk";
const CLIENT_ID =
  "521668391210-om44rsvbscur2fa4qnnkcu6hpld037og.apps.googleusercontent.com";
const DISCOVERY_DOC =
  "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest";
const SCOPES = "https://www.googleapis.com/auth/calendar";

const Auth = () => {
  const [apiLoading, apiError] = useScript("https://apis.google.com/js/api.js");
  const [gsiLoading, gsiError] = useScript(
    "https://accounts.google.com/gsi/client"
  );

  //   const [output, setOutput] = useState();

  const navigate = useNavigate();

  const { dispatchCalenderEvents } = useContext(GlobalContext);

  if (apiLoading || gsiLoading) return <p>loading</p>;
  if (apiError || gsiError) return <p>error</p>;

  const { gapi, google } = window;

  const intializeGapiClient = async () => {
    await gapi.client.init({
      apiKey: API_KEY,
      discoveryDocs: [DISCOVERY_DOC],
    });
  };

  gapi.load("client", intializeGapiClient);

  const tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: async (resp) => {
      if (resp.error !== undefined) {
        throw resp;
      }
      await listUpcomingEvents();
    },
  });

  const handleAuth = () => {
    // console.log({ gapi, google });

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
      //   const eventColor = await gapi.client.calendar.events.get({
      //     calendarId: "primary",
      //     eventId: "2rmomadl6m2lknel47t5bqi85p",
      //   });
      //console.log(eventColor);
    } catch (err) {
      //   setOutput(err.message);
      return;
    }
    const events = response.result.items.map((item) => ({
      title: item.summary,
      description: item.description ? item.description : "",
      label: item.colorId ? getColor(item.colorId) : "peacock",
      date: item.start.dateTime || item.start.date,
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
