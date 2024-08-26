export type userLocation = {
  lat: number;
  lng: number;
  x: number;
  y: number;
};

export type Dataset = {
  label: string;
  fill: boolean;
  data: string[];
  backgroundColor: string[];
  borderColor: string[];
  borderWidth: number;
};

export type WeatherItem = {
  category: string;
  fcstDate: string;
  fcstValue: string;
};

export type WeeklyItems = {
  taMin3: string;
  taMax3: string;
  taMin4: string;
  taMax4: string;
  taMin5: string;
  taMax5: string;
  taMin6: string;
  taMax6: string;
  taMin7: string;
  taMax7: string;
};

export interface WeatherData {
  // TMN 일 최저기온
  TMNs: string[];
  // TMX 일 최고기온
  TMXs: string[];
  // 날씨
  weather: string[][];
  // 날씨 이모지
  weatherEmojis: string[];
}
