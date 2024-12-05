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

// 어제 날씨
export type YesterdayItem = {
  tm: string;
  minTa: string;
  maxTa: string;
};

// 오늘, 내일 날씨
export type ShortTermItem = {
  category: string;
  fcstDate: string;
  fcstValue: string;
};

export type WeatherItem = YesterdayItem | ShortTermItem;

export type WeeklyItems = {
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
  weatherConditions: string[][];
  // 날씨 이모지
  weatherEmojis: string[];
}

export interface LocationCode {
  areaCode: string;
  branchCode: string;
}
