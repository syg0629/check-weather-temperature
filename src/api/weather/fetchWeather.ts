import { API_KEY, UPDATE_HOURS } from "../../constants/api";
import {
  ShortTermItem,
  userLocation,
  WeatherResponse,
  WeeklyItems,
  WeeklyWeatherItems,
  YesterdayItem,
} from "../../types/type";
import { DATES } from "../../constants/date";
import { fetchData } from "../fetchData";
import { fetchReverseGeo } from "../geo/kakaoReverseGeo";
import { getCutrrentHour, getFormattedDate } from "../../utils/date";

const currentHour = getCutrrentHour();

// 종간 예보(어제)
const getYesterdayBaseTime = () => {
  if (currentHour < UPDATE_HOURS.YESTERDAY) {
    return getFormattedDate(-2);
  }
  return DATES.yesterday;
};

// 단기 예보(오늘, 내일, 글피, 그글피)
const getShortTermBaseTime = () => {
  // 0~1시는 전날 23시 데이터 사용
  if (currentHour < 2) {
    return {
      date: getFormattedDate(-1),
      time: "2300",
    };
  }

  // 그 외 시간은 02시 데이터
  // 시간대 마다 가져오는 정보(fcstValue 예보날짜, category)가 다르기 때문에 02시로 지정하여 사용
  return {
    date: getFormattedDate(0),
    time: "0200",
  };
};

const validateResponse = <T>(data: WeatherResponse<T>) => {
  if (!data?.response?.body?.items?.item) {
    console.error("API 응답: ", data);
    throw new Error("API 응답 데이터 형식이 올바르지 않습니다.");
  }
  return data.response.body.items.item;
};

export const fetchYesterdayForecast = async (userLocation: userLocation) => {
  try {
    const date = getYesterdayBaseTime();
    const branchCode = (await fetchReverseGeo(userLocation)).branchCode;
    if (!branchCode) throw new Error("지역 코드를 가져오는데 실패했습니다.");

    const url = `https://apis.data.go.kr/1360000/AsosDalyInfoService/getWthrDataList?serviceKey=${API_KEY.APP_SERVICE_KEY}&pageNo=1&numOfRows=10&dataType=JSON&dataCd=ASOS&dateCd=DAY&startDt=${date}&endDt=${date}&stnIds=${branchCode}`;
    const data = await fetchData(url);
    return validateResponse<YesterdayItem>(data);
  } catch (error) {
    console.error(`어제 데이터를 가져오는 중 오류 발생: `, error);
    throw error;
  }
};

// 단기 예보(오늘, 내일 예보)
export const fetchShortTermForecast = async (userLocation: userLocation) => {
  try {
    const { date, time } = getShortTermBaseTime();
    if (!userLocation) throw new Error("지역 코드를 가져오는데 실패했습니다.");

    const url = `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=${API_KEY.APP_SERVICE_KEY}&pageNo=1&numOfRows=1000&dataType=JSON&base_date=${date}&base_time=${time}&nx=${userLocation.x}&ny=${userLocation.y}`;
    const data = await fetchData(url);
    return validateResponse<ShortTermItem>(data);
  } catch (error) {
    console.error(`단기 데이터를 가져오는 중 오류 발생: `, error);
    throw error;
  }
};

// 중기 예보
const getWeeklyBaseDate = (date: string) => {
  if (currentHour < UPDATE_HOURS.WEEKLY) {
    return DATES.yesterday + "1800";
  }
  // 중기예보 발표 6시가 4일부터, 18시는 5일부터 제공
  return date + "0600";
};

export const fetchWeeklyForecast = async (
  date: string,
  userLocation: userLocation
): Promise<[WeeklyItems, WeeklyWeatherItems]> => {
  try {
    date = getWeeklyBaseDate(date);
    const { areaCode, landForecastAreaCode } = await fetchReverseGeo(
      userLocation
    );

    if (!areaCode) throw new Error("지역 코드를 가져오는데 실패했습니다.");

    const temperatureUrl = `https://apis.data.go.kr/1360000/MidFcstInfoService/getMidTa?serviceKey=${API_KEY.APP_SERVICE_KEY}&pageNo=1&numOfRows=10&dataType=JSON&regId=${areaCode}&tmFc=${date}`;
    const weatherUrl = `https://apis.data.go.kr/1360000/MidFcstInfoService/getMidLandFcst?serviceKey=${API_KEY.APP_SERVICE_KEY}&pageNo=1&numOfRows=10&dataType=JSON&regId=${landForecastAreaCode}&tmFc=${date}`;
    const temperatureData = await fetchData(temperatureUrl);
    const weatherData = await fetchData(weatherUrl);

    return [
      validateResponse<WeeklyItems>(temperatureData)[0],
      validateResponse<WeeklyWeatherItems>(weatherData)[0],
    ];
  } catch (error) {
    console.error("주간 예보 데이터를 가져오는 중 오류 발생:", error);
    throw error;
  }
};
