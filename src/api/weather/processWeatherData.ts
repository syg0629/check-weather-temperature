import { createChart } from "../../chart";
import { UPDATE_HOURS } from "../../constants/api";
import {
  ShortTermItem,
  userLocation,
  WeatherData,
  WeeklyItems,
  WeeklyWeatherItems,
  YesterdayItem,
} from "../../types/type";
import { DATES, week } from "../../constants/date";
import {
  pytEmojis,
  skyEmojis,
  weeklyWeather,
  weeklyWeatherEmojis,
} from "../../constants/weatherEmojis";
import {
  fetchShortTermForecast,
  fetchWeeklyForecast,
  fetchYesterdayForecast,
} from "./fetchWeather";
import { CHART_TMN, CHART_TMX } from "../../constants/chartConfig";
import { getCutrrentHour } from "../../utils/date";
import {
  SHORT_TERM_WEATHER_CATEGORY,
  ShortTermWeatherCategory,
  YESTERDAY_WEATHER_CATEGORY,
  YesterdayWeatherCategory,
} from "../../constants/weather";

const weatherData: WeatherData = {
  TMNs: [],
  TMXs: [],
  weatherConditions: [],
  weatherEmojis: [],
};

// 날씨 데이터 찾기(어제)
const findYesterdayWeatherData = ({
  item,
  category,
}: {
  item: YesterdayItem;
  category: YesterdayWeatherCategory;
}) => {
  return category === YESTERDAY_WEATHER_CATEGORY.minTa
    ? item.minTa
    : item.maxTa ?? "-";
};

// 날씨 데이터 찾기(오늘, 내일)
const findShortTermWeatherData = ({
  items,
  category,
  date,
}: {
  items: ShortTermItem[];
  category: ShortTermWeatherCategory;
  date: string;
}) => {
  const item = items.find(
    (item) => item.category === category && item.fcstDate === date
  );
  return item?.fcstValue ?? "-";
};

// 단기 예보 정보를 받아와 필요한 데이터만 화면에 노출
const processShortTermData = (
  yesterdayItems: YesterdayItem[],
  shortTermItems: ShortTermItem[]
) => {
  const yesterdayItem = yesterdayItems[0];
  const dates = [
    DATES.today,
    DATES.tomorrow,
    DATES.dayAfterTomorrow,
    DATES.twoDaysAfterTomorrow,
  ];

  weatherData.TMNs = [
    findYesterdayWeatherData({
      item: yesterdayItem,
      category: YESTERDAY_WEATHER_CATEGORY.minTa,
    }),
    ...dates.map((date) =>
      findShortTermWeatherData({
        items: shortTermItems,
        category: SHORT_TERM_WEATHER_CATEGORY.TMN,
        date,
      })
    ),
  ];
  weatherData.TMXs = [
    findYesterdayWeatherData({
      item: yesterdayItem,
      category: YESTERDAY_WEATHER_CATEGORY.maxTa,
    }),
    ...dates.map((date) =>
      findShortTermWeatherData({
        items: shortTermItems,
        category: SHORT_TERM_WEATHER_CATEGORY.TMX,
        date,
      })
    ),
  ];
  weatherData.weatherConditions = [
    // 어제는 하늘상태, 강수형태 데이터가 없음
    ["-", "-"],
    ...dates.map((date) => [
      findShortTermWeatherData({
        items: shortTermItems,
        category: SHORT_TERM_WEATHER_CATEGORY.SKY,
        date,
      }),
      findShortTermWeatherData({
        items: shortTermItems,
        category: SHORT_TERM_WEATHER_CATEGORY.PTY,
        date,
      }),
    ]),
  ];

  weatherData.weatherEmojis = weatherData.weatherConditions.map(
    ([skyCode, pytCode]) => {
      //강수 없음
      if (pytCode === "0" && ["1", "3", "4"].includes(skyCode)) {
        return skyEmojis[skyCode];
        //비
      } else if (["1", "2", "5"].includes(pytCode)) {
        return pytEmojis[1];
        //눈
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
    CHART_TMN(weatherData.TMNs),
    CHART_TMX(weatherData.TMXs),
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
    const [yesterdayResult, shortTermResult] = await Promise.allSettled([
      fetchYesterdayForecast(userLocation),
      fetchShortTermForecast(userLocation),
    ]);

    if (
      yesterdayResult.status === "rejected" ||
      shortTermResult.status === "rejected"
    ) {
      throw new Error("데이터 가져오기 실패");
    }

    const yesterdayItems = yesterdayResult.value;
    const todayItems = shortTermResult.value;

    processShortTermData(yesterdayItems, todayItems);
    createShortTermChart();
  } catch (error) {
    console.error("단기 예보 데이터 처리 중 오류 발생:", error);
    throw error;
  }
};

// 주간 예보 정보를 받아와 필요한 데이터만 화면에 노출
const processWeeklyData = (
  weeklyItems: WeeklyItems,
  weatherItems: WeeklyWeatherItems
) => {
  const weeklyTMNs = [
    weeklyItems.taMin4,
    weeklyItems.taMin5,
    weeklyItems.taMin6,
  ];
  const weeklyTMXs = [
    weeklyItems.taMax4,
    weeklyItems.taMax5,
    weeklyItems.taMax6,
  ];
  const weatherAms = [
    weatherItems.wf4Am,
    weatherItems.wf5Am,
    weatherItems.wf6Am,
  ];
  const weatherPms = [
    weatherItems.wf4Pm,
    weatherItems.wf5Pm,
    weatherItems.wf6Pm,
  ];

  let weatherEmojis = [];
  if (getCutrrentHour() < UPDATE_HOURS.WEEKLY_WEATHER) {
    weatherEmojis = [...weatherAms];
  } else {
    weatherEmojis = [...weatherPms];
  }
  weatherEmojis = weatherEmojis.map((weatherData) => {
    return findWeatherEmojis(weatherData);
  });
  weatherData.TMNs = [...weatherData.TMNs, ...weeklyTMNs];
  weatherData.TMXs = [...weatherData.TMXs, ...weeklyTMXs];
  weatherData.weatherEmojis = [...weatherData.weatherEmojis, ...weatherEmojis];
};

const findWeatherEmojis = (condition: string) => {
  for (const [key, value] of Object.entries(weeklyWeather)) {
    if (value.includes(condition)) {
      return weeklyWeatherEmojis[key];
    }
  }
  return "-";
};

const createWeeklyChart = () => {
  //chart에서 날짜와 날씨 이모지를 함깨 노출하기 위한 배열
  const dateAndWeatherEmojis = week
    .slice(0, 7)
    .map((date, index) => `${date}\n${weatherData.weatherEmojis[index]}`);

  createChart(".weekly-chart", dateAndWeatherEmojis.slice(0, 7), [
    CHART_TMN(weatherData.TMNs),
    CHART_TMX(weatherData.TMXs),
  ]);
};

export const processWeeklyForecast = async (userLocation: userLocation) => {
  try {
    const weeklyItems = await fetchWeeklyForecast(DATES.today, userLocation);
    processWeeklyData(weeklyItems[0], weeklyItems[1]);
    createWeeklyChart();
  } catch (error) {
    console.error("주간 데이터 처리 중 오류 발생:", error);
    alert("주간 데이터 처리 중 오류가 발생했습니다.");
  }
};
