import { userLocation } from "../../types/type";
import { DATES, getFormattedDate } from "../../utils/date";
import { fetchData } from "../fetchData";
import { fetchReverseGeo } from "../geo/kakaoReverseGeo";

const APP_SERVICE_KEY = process.env.APP_SERVICE_KEY;
const currentDate = new Date();
const currentHour = currentDate.getHours();

//데이터 갱신 주기에 따른 시간 설정
const YESTERDAY_DATA_UPDATE_HOUR = 11;
const WEEKLY_DATA_UPDATE_HOUR = 6;

// 종간 예보(어제)
const getYesterdayBaseTime = () => {
  if (currentHour < YESTERDAY_DATA_UPDATE_HOUR) {
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

export const fetchYesterdayForecast = async (userLocation: userLocation) => {
  try {
    const date = getYesterdayBaseTime();
    const branchCode = (await fetchReverseGeo(userLocation)).branchCode;
    if (!branchCode) throw new Error("지역 코드를 가져오는데 실패했습니다.");

    const url = `https://apis.data.go.kr/1360000/AsosDalyInfoService/getWthrDataList?serviceKey=${APP_SERVICE_KEY}&pageNo=1&numOfRows=10&dataType=JSON&dataCd=ASOS&dateCd=DAY&startDt=${date}&endDt=${date}&stnIds=${branchCode}`;
    const data = await fetchData(url);

    if (!data?.response?.body?.items?.item) {
      console.error("API 응답: ", data);
      throw new Error("API 응답 데이터 형식이 올바르지 않습니다.");
    }

    return data.response.body.items.item;
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

    const url = `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=${APP_SERVICE_KEY}&pageNo=1&numOfRows=1000&dataType=JSON&base_date=${date}&base_time=${time}&nx=${userLocation.x}&ny=${userLocation.y}`;
    const data = await fetchData(url);

    if (!data?.response?.body?.items?.item) {
      console.error("API 응답: ", data);
      throw new Error("API 응답 데이터 형식이 올바르지 않습니다.");
    }

    return data.response.body.items.item;
  } catch (error) {
    console.error(`단기 데이터를 가져오는 중 오류 발생: `, error);
    throw error;
  }
};

// 중기 예보
const getWeeklyBaseDate = (date: string) => {
  if (currentHour < WEEKLY_DATA_UPDATE_HOUR) {
    return DATES.yesterday;
  }
  return date;
};

export const fetchWeeklyForecast = async (
  date: string,
  userLocation: userLocation
) => {
  try {
    date = getWeeklyBaseDate(date);
    const areaCode = (await fetchReverseGeo(userLocation)).areaCode;
    if (!areaCode) throw new Error("지역 코드를 가져오는데 실패했습니다.");

    const url = `https://apis.data.go.kr/1360000/MidFcstInfoService/getMidTa?serviceKey=${APP_SERVICE_KEY}&pageNo=1&numOfRows=10&dataType=JSON&regId=${areaCode}&tmFc=${date}0600`;
    const data = await fetchData(url);
    if (!data?.response?.body?.items?.item?.[0]) {
      throw new Error("API 응답 데이터 형식이 올바르지 않습니다.");
    }

    return data.response.body.items.item[0];
  } catch (error) {
    console.error("주간 예보 데이터를 가져오는 중 오류 발생:", error);
    throw error;
  }
};
