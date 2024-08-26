import { userLocation } from "../../types/type";
import { fetchData } from "../fetchData";
import { fetchReverseGeo } from "../geo/kakaoReverseGeo";

const APP_SERVICE_KEY = process.env.APP_SERVICE_KEY;

// 단기 예보(어제, 오늘, 내일 예보)
export const fetchShortTermForecast = async (
  date: string,
  userLocation: userLocation
) => {
  try {
    const url = `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=${APP_SERVICE_KEY}&pageNo=1&numOfRows=1000&dataType=JSON&base_date=${date}&base_time=0200&nx=${userLocation.x}&ny=${userLocation.y}`;
    const data = await fetchData(url);
    return data.response.body.items.item;
  } catch (error) {
    console.error("단기 예보 데이터를 가져오는 중 오류가 발생했습니다:", error);
    alert("단기 예보 데이터를 가져오는 중 오류가 발생했습니다.");
  }
};

// 주간 예보
export const fetchWeeklyForecast = async (
  date: string,
  userLocation: userLocation
) => {
  try {
    const locationCode = await fetchReverseGeo(userLocation);
    const url = `https://apis.data.go.kr/1360000/MidFcstInfoService/getMidTa?serviceKey=${APP_SERVICE_KEY}&pageNo=1&numOfRows=10&dataType=JSON&regId=${locationCode}&tmFc=${date}
  0600`;
    const data = await fetchData(url);
    return data.response.body.items.item[0];
  } catch (error) {
    console.error("주간 예보 데이터를 가져오는 중 오류가 발생했습니다:", error);
    alert("주간 예보 데이터를 가져오는 중 오류가 발생했습니다.");
  }
};
