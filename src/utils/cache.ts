import { userLocation } from "../types/type";

const CACHE_DURATION = 1000 * 60 * 60 * 24;

export const getCachedWeather = (location: userLocation) => {
  const key = `weather_${location.x}_${location.y}`;
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


export const setCachedWeather = (location: userLocation, data: any) => {
  const key = `weather_${location.x}_${location.y}`;
  const cacheData = {
    data,
    time: Date.now(),
  };
  localStorage.setItem(key, JSON.stringify(cacheData));
};
