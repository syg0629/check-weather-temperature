import { createChart } from "../../chart";
import {
  ShortTermItem,
  userLocation,
  WeatherData,
  WeatherItem,
  WeeklyItems,
  YesterdayItem,
} from "../../types/type";
import { DATES, week } from "../../utils/date";
import { pytEmojis, skyEmojis } from "../../utils/weatherEmojis";
import {
  fetchShortTermForecast,
  fetchWeeklyForecast,
  fetchYesterdayForecast,
} from "./fetchWeather";

const weatherData: WeatherData = {
  TMNs: [],
  TMXs: [],
  weatherConditions: [],
  weatherEmojis: [],
};

// 날씨 데이터 찾기(어제, 오늘, 내일)
const findWeatherData = (
  items: WeatherItem[],
  category: string,
  date: string
) => {
  // 어제 날짜인 경우
  if (date === DATES.yesterday) {
    const item = items[0] as YesterdayItem;
    return category === "minTa" ? item.minTa : item.maxTa ?? "-";
  }

  // 오늘, 내일 날짜인 경우
  const shortTermItems = items as ShortTermItem[];
  const item = shortTermItems.find(
    (item) => item.category === category && item.fcstDate === date
  );

  return item.fcstValue ?? "-";
};

// 단기 예보 정보를 받아와 필요한 데이터만 화면에 노출
const processShortTermData = (
  yesterdayItems: YesterdayItem[],
  shortTermItems: ShortTermItem[]
) => {
  weatherData.TMNs = [
    findWeatherData([yesterdayItems[0]], "minTa", DATES.yesterday),
    findWeatherData(shortTermItems, "TMN", DATES.today),
    findWeatherData(shortTermItems, "TMN", DATES.tomorrow),
    //어제, 오늘, 내일 온도에서는 필요 없지만 주간 예보를 위해 미리 넣어둠
    findWeatherData(shortTermItems, "TMN", DATES.dayAfterTomorrow),
    findWeatherData(shortTermItems, "TMN", DATES.twoDaysAfterTomorrow),
  ];
  weatherData.TMXs = [
    findWeatherData([yesterdayItems[0]], "maxTa", DATES.yesterday),
    findWeatherData(shortTermItems, "TMX", DATES.today),
    findWeatherData(shortTermItems, "TMX", DATES.tomorrow),
    //어제, 오늘, 내일 온도에서는 필요 없지만 주간 예보를 위해 미리 넣어둠
    findWeatherData(shortTermItems, "TMX", DATES.dayAfterTomorrow),
    findWeatherData(shortTermItems, "TMX", DATES.twoDaysAfterTomorrow),
  ];
  weatherData.weatherConditions = [
    [
      findWeatherData(yesterdayItems, "SKY", DATES.yesterday),
      findWeatherData(yesterdayItems, "PTY", DATES.yesterday),
    ],
    [
      findWeatherData(shortTermItems, "SKY", DATES.today),
      findWeatherData(shortTermItems, "PTY", DATES.today),
    ],
    [
      findWeatherData(shortTermItems, "SKY", DATES.tomorrow),
      findWeatherData(shortTermItems, "PTY", DATES.tomorrow),
    ],
  ];

  weatherData.weatherEmojis = weatherData.weatherConditions.map(
    ([skyCode, pytCode]) => {
      if (pytCode === "0") {
        if (["1", "3", "4"].includes(skyCode)) return skyEmojis[skyCode];
      } else if (["1", "2", "5"].includes(pytCode)) {
        return pytEmojis[1];
      } else if (["3", "6", "7"].includes(pytCode)) {
        return pytEmojis[3];
      }
      return "";
    }
  );
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
  최고온도 <span class="${maxTempDiff > 0 ? "red-text" : "blue-text"}">${Number(
    Math.abs(maxTempDiff).toFixed(2)
  )}도 ${maxTempDiff > 0 ? "높고" : "낮고"}</span>, 최저온도
  <span class="${minTempDiff > 0 ? "red-text" : "blue-text"}">${Number(
    Math.abs(minTempDiff).toFixed(2)
  )}도 ${minTempDiff > 0 ? "높습니다." : "낮습니다."}</span>
  <div>
  `;
};

export const processShortTermForecast = async (userLocation: userLocation) => {
  try {
    const results = await Promise.allSettled([
      fetchYesterdayForecast(userLocation),
      fetchShortTermForecast(userLocation),
    ]);

    if (results[0].status === "rejected" || results[1].status === "rejected") {
      throw new Error("데이터 가져오기 실패");
    }

    const yesterdayItems = results[0].value as YesterdayItem[];
    const todayItems = results[1].value as ShortTermItem[];

    processShortTermData(yesterdayItems, todayItems);
    createShortTermChart();
  } catch (error) {
    console.error("단기 예보 데이터 처리 중 오류 발생:", error);
    throw error;
  }
};

// 주간 예보 정보를 받아와 필요한 데이터만 화면에 노출
const processWeeklyData = async (weeklyItems: WeeklyItems) => {
  const weeklyTMNs = [
    weeklyItems.taMin5,
    weeklyItems.taMin6,
    weeklyItems.taMin7,
  ];
  const weeklyTMXs = [
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
    const weeklyItems = await fetchWeeklyForecast(DATES.today, userLocation);
    processWeeklyData(weeklyItems);
    createWeeklyChart();
  } catch (error) {
    console.error("주간 데이터 처리 중 오류 발생:", error);
    alert("주간 데이터 처리 중 오류가 발생했습니다.");
  }
};
