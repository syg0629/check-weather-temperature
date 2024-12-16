import dayjs from "dayjs";

export const getCutrrentHour = () => {
  const date = new Date();
  return date.getHours();
};

// 기상청 API 호출용 날짜 포맷
export const getFormattedDate = (daysFromToday: number) =>
  dayjs().add(daysFromToday, "day").format("YYYYMMDD");

// 총 8일의 주간 예보를 저장하기 위한 배열(어제 포함)
export const week: string[] = Array(8)
  .fill(0)
  .map((_, i) => dayjs().subtract(1, "day").add(i, "d").format("M/D"));

// 기상청 API 호출용 날짜 포맷
export const DATES = {
  yesterday: getFormattedDate(-1),
  today: getFormattedDate(0),
  tomorrow: getFormattedDate(1),
  dayAfterTomorrow: getFormattedDate(2),
  twoDaysAfterTomorrow: getFormattedDate(3),
};
