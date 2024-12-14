// 기상청 단기 예보 API에 명시되어 있는 날씨 코드를 이용하여 날씨 이모지로 시각화
export const pytCode = {
  0: "강수 없음",
  1: "비",
  2: "비/눈",
  3: "눈",
  5: "빗방울",
  6: "진눈깨비",
  7: "눈날림",
};
export const skyCode = { 1: "맑음", 3: "구름많음", 4: "흐림" };

export const pytEmojis: Record<string, string> = {
  "1": "🌧️",
  "3": "❄️",
};
export const skyEmojis: Record<string, string> = {
  "1": "☀️",
  "3": "⛅️",
  "4": "☁️",
};

// 기상청 중기 예보 API는 단기 예보와 달리 한글로 데이터가 주어짐
// 해당 단어들이 포함되어 있는 경우 이모지로 표시
export const weeklyWeather = {
  sun: ["맑음"],
  cloud: ["구름많음", "흐림"],
  rain: ["구름많고 비", "구름많고 소나기", "흐리고 비", "흐리고 소나기"],
  snow: ["구름많고 눈", "구름많고 비/눈", "흐리고 비/눈", "흐리고 눈"],
};

export const weeklyWeatherEmojis: Record<string, string> = {
  sun: "☀️",
  cloud: "☁️",
  rain: "🌧️",
  snow: "❄️",
};
