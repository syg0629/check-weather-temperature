import { Swiper, Navigation } from "swiper";
import "./styles/style.css";
import { dfsXyConv } from "./utils/dfsXyConv";
import { userLocation } from "./types/type";
import {
  processShortTermForecast,
  processWeeklyForecast,
} from "./api/weather/processWeatherData";
import { error } from "console";

// 기본 사용자 위치(서울)
const DEFAULT_LOCATION: userLocation = {
  lat: 37.5665,
  lng: 126.978,
  x: 60,
  y: 127,
};

// 로딩 스피너
const loadingSpinner = (show: boolean) => {
  document.querySelector<HTMLElement>(".loading-spinner").style.display = show
    ? "block"
    : "none";
};

// 사용자 위치 정보와 날씨 정보 가져오기
const initGeoAndWeather = () => {
  if (!navigator.geolocation) {
    alert(
      "이 브라우저는 위치 정보를 지원하지 않습니다. 기본 위치(서울)로 설정합니다."
    );
    fetchAllWeatherData(DEFAULT_LOCATION);
    return;
  }
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      const userLocation = dfsXyConv("toXY", latitude, longitude);
      fetchAllWeatherData(userLocation);
    },
    (error) => {
      console.error("위치 정보 확인 시 오류 발생", error.message);
      alert("위치 확인이 불가능하여 기본 위치(서울)로 설정합니다.");
      fetchAllWeatherData(DEFAULT_LOCATION);
    }
  );
};

// chart 초기화
const initSwiper = () => {
  new Swiper(".swiper", {
    modules: [Navigation],
    direction: "horizontal",
    loop: true,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    observer: true,
    observeParents: true,
    parallax: true,
  });
};

// 날씨 데이터 처리
const processForecastData = async (
  userLocation: userLocation,
  processFunction: (location: userLocation) => Promise<void>,
  errorMessage: string
) => {
  try {
    await processFunction(userLocation);
    console.log("날씨 데이터 처리 성공: ", errorMessage);
  } catch (error) {
    console.error(`${errorMessage}: `, error);
    throw new Error(errorMessage);
  }
};

// 모든 날씨 데이터 가져오기
const fetchAllWeatherData = async (userLocation: userLocation) => {
  try {
    await processShortTermForecast(userLocation),
      await processWeeklyForecast(userLocation);
  } catch (error) {
    console.error("날씨 데이터 가져오는 중 오류: ", error);
    alert("날씨 데이터를 가져오는 중 오류가 발생했습니다.");
  } finally {
    loadingSpinner(false);
  }
};

initGeoAndWeather();
initSwiper();
