import { DATES } from "../constants/date";
import { userLocation } from "../types/type";
import { getFormattedDate } from "./date";

type CacheType = "shortTerm" | "weekly";

// 캐시 지속 시간 30분
const CACHE_DURATION = 30 * 60 * 1000;

export const getCachedWeather = (location: userLocation, type: CacheType) => {
  const today = getFormattedDate(0);
  const key = `weather_${type}_${today}_${location.x}_${location.y}`;
  const cached = localStorage.getItem(key);

  if (!cached) return null;
  const { data, time } = JSON.parse(cached);

  // 30분 지났으면 캐시 삭제
  if (Date.now() - time > CACHE_DURATION) {
    localStorage.removeItem(key);
    return null;
  }

  return data;
};

export const setCachedWeather = (
  location: userLocation,
  data: any,
  type: CacheType
) => {
  const today = getFormattedDate(0);
  const key = `weather_${type}_${today}_${location.x}_${location.y}`;
  const cacheData = {
    data,
    time: Date.now(),
  };
  localStorage.setItem(key, JSON.stringify(cacheData));
};
