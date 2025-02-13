import dayjs from "dayjs";

export const getCutrrentHour = () => {
  const date = new Date();
  return date.getHours();
};

// 기상청 API 호출용 날짜 포맷
export const getFormattedDate = (daysFromToday: number) =>
  dayjs().add(daysFromToday, "day").format("YYYYMMDD");
