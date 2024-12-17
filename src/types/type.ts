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
  taMin4: string;
  taMax4: string;
  taMin5: string;
  taMax5: string;
  taMin6: string;
  taMax6: string;
};

export type WeeklyWeatherItems = {
  wf4Am: string;
  wf4Pm: string;
  wf5Am: string;
  wf5Pm: string;
  wf6Am: string;
  wf6Pm: string;
};

export interface WeatherData {
  // TMN 일 최저기온
  TMNs: string[];
  // TMX 일 최고기온
  TMXs: string[];
  // 단기예보 데이터의 하늘상태, 강수형태 / 중기예보에는 해당 데이터 존재하지 않음
  weatherConditions?: string[][];
  // 날씨 이모지
  weatherEmojis: string[];
}

export interface LocationCode {
  areaCode: string;
  branchCode: string;
  landForecastAreaCode: string;
}

export interface WeatherResponse<T> {
  response: {
    body: {
      items: {
        item: T[];
      };
    };
  };
}
