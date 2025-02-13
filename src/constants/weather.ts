export const SHORT_TERM_WEATHER_CATEGORY = {
  TMN: "TMN",
  TMX: "TMX",
  SKY: "SKY",
  PTY: "PTY",
} as const;

export type ShortTermWeatherCategory =
  (typeof SHORT_TERM_WEATHER_CATEGORY)[keyof typeof SHORT_TERM_WEATHER_CATEGORY];

export const YESTERDAY_WEATHER_CATEGORY = {
  minTa: "minTa",
  maxTa: "maxTa",
} as const;

export type YesterdayWeatherCategory =
  (typeof YESTERDAY_WEATHER_CATEGORY)[keyof typeof YESTERDAY_WEATHER_CATEGORY];
