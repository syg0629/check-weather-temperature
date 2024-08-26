// 기상청 API 단기 예보에 명시되어 있는 날씨 코드를 이용하여 날씨 이모지로 시각화
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
