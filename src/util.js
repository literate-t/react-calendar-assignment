import dayjs from "dayjs";

export const SCOPE = "https://www.googleapis.com/auth/calendar";

// 주간 설정
export const getWeek = (date = dayjs().date()) => {
  const year = dayjs().year();
  const month = dayjs().month();
  const today = dayjs(new Date(year, month, date)).day();
  let dayCount = date - today;

  const week = new Array(7).fill(null).map(() => {
    return dayjs(new Date(year, month, dayCount++));
  });

  return week;
};

export const YYMMDDFormat = "YY-MM-DD";
export const YYYYMMDDFormat = "YYYY-MM-DD";

// 색상 설정 관련
const labelColorPalette = {
  1: "lavender",
  2: "sage",
  3: "grape",
  4: "pink",
  5: "banana",
  6: "mandarin",
  7: "peacock" /* default */,
  8: "graphite",
  9: "blueberry",
  10: "basil",
  11: "tomato",
};
export const getColor = (colorId) => labelColorPalette[colorId];

export const getColorId = (color = "peacock") =>
  Object.keys(labelColorPalette).find(
    (key) => labelColorPalette[key] === color
  );

export const labelColorClasses = [
  "lavender",
  "sage",
  "grape",
  "pink",
  "banana",
  "mandarin",
  "peacock",
  "graphite",
  "blueberry",
  "basil",
  "tomato",
];

// 라이브러리 초기화
const intializeGapiClient = async (gadpi) => {
  await gadpi.client.init({
    apiKey: process.env.REACT_APP_API_KEY,
    discoveryDocs: [process.env.REACT_APP_DISCOVERY_DOC],
  });
};

export const setGapiClient = (gapi) => {
  gapi.load("client", async () => intializeGapiClient(gapi));
};

// 요청 후 처리
export const postRequest = (event, fn) => {
  if (event.code === 400) {
    alert("요청이 잘못됐네요");
  } else if (event.code === 401) {
    alert("다시 로그인 해주세요");
  } else {
    alert("요청이 성공했어요");
    fn();
  }
};
