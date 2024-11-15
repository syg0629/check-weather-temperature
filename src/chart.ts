import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend
);
import { Dataset } from "./types/type";

// 반응형으로 폰트 크기 계산
const calculateFontsSize = (baseSize: number = 20) => {
  return (context: { chart: Chart }) => {
    const width = context.chart.width;
    return Math.min(Math.round(width / 20), baseSize);
  };
};

export const createChart = (
  canvasSelector: string,
  labels: string[],
  datasets: Dataset[],
  options: ChartOptions = {}
) => {
  const canvas = document.querySelector<HTMLCanvasElement>(canvasSelector);
  const ctx = canvas.getContext("2d");

  // 기존 차트 제거
  const existingChart = Chart.getChart(canvas);
  if (existingChart) existingChart.destroy();

  // 날씨 이모지 표시(어제, 오늘 내일만)
  const weatherEmojisContainer = canvas
    .closest(".chart-container")
    ?.querySelector(".weather-emojis");

  if (weatherEmojisContainer) {
    weatherEmojisContainer.innerHTML = labels
      .map((label) => {
        const [date, emoji] = label.split("\n");
        return `<div class="weather-emoji-wrapper"><span>${date}</span><span>${
          emoji || ""
        }</span></div>`;
      })
      .join("");
  }

  // 차트 생성 및 반환
  return new Chart(ctx, {
    type: "line",
    data: { labels, datasets },
    options: {
      animation: false,
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          ticks: {
            callback: function (value: number) {
              // 날짜와 날씨 이모지 수동 줄바꿈 처리
              const label = this.getLabelForValue(value);
              return label ? label.split("\n") : label;
            },
            font: { size: calculateFontsSize() },
          },
        },
        y: {
          ticks: {
            font: { size: calculateFontsSize() },
          },
        },
      },
      plugins: {
        legend: {
          labels: {
            font: { size: calculateFontsSize(16) },
          },
        },
      },
    },
  });
};
