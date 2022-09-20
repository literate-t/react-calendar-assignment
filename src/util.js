import dayjs from "dayjs";

export const getMonth = (month = dayjs().month()) => {
  month = Math.floor(month);
  const year = dayjs().year();
  const firstDayOfTheMonth = dayjs(new Date(year, month, 1)).day();
  let dayCount = 0 - firstDayOfTheMonth;

  const datesMatrix = new Array(5).fill([]).map(() => {
    return new Array(7).fill(null).map(() => {
      dayCount++;
      return dayjs(new Date(year, month, dayCount));
    });
  });

  return datesMatrix;
};

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
/*
      1. #a4bdfc: 라벤더
      2. #7ae7bf: 세이지
      3. #dbadff: 포도
      4. #ff887c: 연분홍
      5. #fbd75b: 바나나
      6. #ffb878: 귤
      7. #46d6db: 공작 (default)
      8. #e1e1e1: 흑연
      9. #5484ed: 블루베리
     10. #51b749: 바질
     11. #dc2127: 토마토
*/

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

export const getColorId = (color) =>
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
