export const CHART_TMN = (data: string[]) => {
  return {
    label: "최저온도",
    fill: false,
    data,
    backgroundColor: ["rgba(77,201,246, 0.2)"],
    borderColor: ["rgba(77,201,246, 1)"],
    borderWidth: 3,
  };
};

export const CHART_TMX = (data: string[]) => {
  return {
    label: "최고온도",
    fill: false,
    data,
    backgroundColor: ["rgba(255, 99, 132, 0.2)"],
    borderColor: ["rgba(255, 99, 132, 1)"],
    borderWidth: 3,
  };
};
