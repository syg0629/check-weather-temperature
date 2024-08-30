import { createChart } from "../../chart";
import {
  userLocation,
  WeatherData,
  WeatherItem,
  WeeklyItems,
} from "../../types/type";
import { getFormattedDate, week } from "../../utils/date";
import { pytEmojis, skyEmojis } from "../../utils/weatherEmojis";
import { fetchShortTermForecast, fetchWeeklyForecast } from "./fetchWeather";

const weatherData: WeatherData = {
  TMNs: [],
  TMXs: [],
  weather: [],
  weatherEmojis: [],
};

// 기상청 API 호출용 날짜 포맷
const dates = {
  yesterday: getFormattedDate(-1),
  today: getFormattedDate(0),
  tomorrow: getFormattedDate(1),
  dayAfterTomorrow: getFormattedDate(2),
};

// 조회해야 할 카테고리, 예상일보 날짜로 해당 데이터 가져오기
const findWeatherData = (
  items: WeatherItem[],
  category: string,
  date: string
) => {
  const item = items.find(
    (item) => item.category === category && item.fcstDate === date
  ).fcstValue;

  if (!item) {
    console.error(
      `${date} 데이터에서 카테고리 ${category}를 찾을 수 없습니다. `
    );
    return "N/A";
  }

  return item;
};

// 단기 예보 정보를 받아와 필요한 데이터만 화면에 노출
const processShortTermData = (
  yesterdayItems: WeatherItem[],
  shortTermItems: WeatherItem[]
) => {
  weatherData.TMNs = [
    findWeatherData(yesterdayItems, "TMN", dates.yesterday),
    findWeatherData(shortTermItems, "TMN", dates.today),
    findWeatherData(shortTermItems, "TMN", dates.tomorrow),
    //어제, 오늘, 내일 온도에서는 필요 없지만 주간 예보를 위해 미리 넣어둠
    findWeatherData(shortTermItems, "TMN", dates.dayAfterTomorrow),
  ];
  weatherData.TMXs = [
    findWeatherData(yesterdayItems, "TMX", dates.yesterday),
    findWeatherData(shortTermItems, "TMX", dates.today),
    findWeatherData(shortTermItems, "TMX", dates.tomorrow),
    //어제, 오늘, 내일 온도에서는 필요 없지만 주간 예보를 위해 미리 넣어둠
    findWeatherData(shortTermItems, "TMX", dates.dayAfterTomorrow),
  ];
  weatherData.weather = [
    [
      findWeatherData(yesterdayItems, "SKY", dates.yesterday),
      findWeatherData(yesterdayItems, "PTY", dates.yesterday),
    ],
    [
      findWeatherData(shortTermItems, "SKY", dates.today),
      findWeatherData(shortTermItems, "PTY", dates.today),
    ],
    [
      findWeatherData(shortTermItems, "SKY", dates.tomorrow),
      findWeatherData(shortTermItems, "PTY", dates.tomorrow),
    ],
  ];

  weatherData.weatherEmojis = weatherData.weather.map(([skyCode, pytCode]) => {
    if (pytCode === "0") {
      if (["1", "3", "4"].includes(skyCode)) return skyEmojis[skyCode];
    } else if (["1", "2", "5"].includes(pytCode)) {
      return pytEmojis[1];
    } else if (["3", "6", "7"].includes(pytCode)) {
      return pytEmojis[3];
    }
    return "";
  });
};

const createShortTermChart = () => {
  //chart에서 날짜와 날씨 이모지를 함깨 노출하기 위한 배열
  const dateAndWeatherEmojis = week
    .slice(0, 3)
    .map((date, index) => `${date}\n${weatherData.weatherEmojis[index]}`);

  createChart(".today-chart", dateAndWeatherEmojis.slice(0, 3), [
    {
      label: "최저온도",
      fill: false,
      data: weatherData.TMNs,
      backgroundColor: ["rgba(77,201,246, 0.2)"],
      borderColor: ["rgba(77,201,246, 1)"],
      borderWidth: 3,
    },
    {
      label: "최고온도",
      fill: false,
      data: weatherData.TMXs,
      backgroundColor: ["rgba(255, 99, 132, 0.2)"],
      borderColor: ["rgba(255, 99, 132, 1)"],
      borderWidth: 3,
    },
  ]);

  const maxTempDiff = Number(weatherData.TMXs[1]) - Number(weatherData.TMXs[0]);
  const minTempDiff = Number(weatherData.TMNs[1]) - Number(weatherData.TMNs[0]);

  document.querySelector(".temperature-comparison").innerHTML = `어제보다 오늘은
  <div> 
  최고온도 <span class="${
    maxTempDiff > 0 ? "red-text" : "blue-text"
  }">${maxTempDiff}도 ${
    Math.abs(maxTempDiff) > 0 ? "높고" : "낮고"
  }</span>, 최저온도
  <span class="${
    minTempDiff > 0 ? "red-text" : "blue-text"
  }">${minTempDiff}도 ${
    Math.abs(maxTempDiff) > 0 ? "낮습니다." : "높습니다."
  }</span>
  <div>
  `;
};

export const processShortTermForecast = async (userLocation: userLocation) => {
  try {
    const [yesterdayItems, shortTermItems] = await Promise.all([
      fetchShortTermForecast(dates.yesterday, userLocation),
      fetchShortTermForecast(dates.today, userLocation),
    ]);
    processShortTermData(yesterdayItems, shortTermItems);
    createShortTermChart();
  } catch (error) {
    console.error("단기 예보 데이터 처리 중 오류가 발생했습니다:", error);
    alert("단기 예보 데이터 처리 중 오류가 발생했습니다.");
  }
};

// 주간 예보 정보를 받아와 필요한 데이터만 화면에 노출
const processWeeklyData = async (weeklyItems: WeeklyItems) => {
  const weeklyTMNs = [
    weeklyItems.taMin3,
    weeklyItems.taMin4,
    weeklyItems.taMin5,
    weeklyItems.taMin6,
    weeklyItems.taMin7,
  ];
  const weeklyTMXs = [
    weeklyItems.taMax3,
    weeklyItems.taMax4,
    weeklyItems.taMax5,
    weeklyItems.taMax6,
    weeklyItems.taMax7,
  ];

  weatherData.TMNs = [...weatherData.TMNs, ...weeklyTMNs];
  weatherData.TMXs = [...weatherData.TMXs, ...weeklyTMXs];
};

const createWeeklyChart = () => {
  createChart(".weekly-chart", week, [
    {
      label: "최저온도",
      fill: false,
      data: weatherData.TMNs,
      backgroundColor: ["rgba(77,201,246, 0.2)"],
      borderColor: ["rgba(77,201,246, 1)"],
      borderWidth: 3,
    },
    {
      label: "최고온도",
      fill: false,
      data: weatherData.TMXs,
      backgroundColor: ["rgba(255, 99, 132, 0.2)"],
      borderColor: ["rgba(255, 99, 132, 1)"],
      borderWidth: 3,
    },
  ]);
};

export const processWeeklyForecast = async (userLocation: userLocation) => {
  try {
    const weeklyItems = await fetchWeeklyForecast(dates.today, userLocation);
    processWeeklyData(weeklyItems);
    createWeeklyChart();
  } catch (error) {
    console.error("주간 데이터 처리 중 오류가 발생했습니다:", error);
    alert("주간 데이터 처리 중 오류가 발생했습니다.");
  }
};
