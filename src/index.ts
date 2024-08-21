import Swiper, { Navigation } from "swiper";
import Chart from "chart.js/auto";
import dayjs from "dayjs";
import "./style.css";

type Dataset = {
  label: string;
  fill: boolean;
  data: string[];
  backgroundColor: string[];
  borderColor: string[];
  borderWidth: number;
};

const APP_SERVICE_KEY = process.env.APP_SERVICE_KEY;

const loadingSpinner = document.querySelector<HTMLElement>(".loading-spinner");

const showLoadingSpinner = () => {
  loadingSpinner.style.display = "block";
};

const hideLoadingSpinner = () => {
  loadingSpinner.style.display = "none";
};

Chart.defaults.font.size = 16;

new Swiper(".swiper", {
  modules: [Navigation],
  direction: "horizontal",
  loop: true,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  observer: true,
  observeParents: true,
  parallax: true,
});

//기상청 API 호출용 날짜 포맷
const yesterday = dayjs().subtract(1, "day");
const yesterdayFormat = yesterday.format("YYYYMMDD");
const currentDayFormat = dayjs().format("YYYYMMDD");

//API 조회 및 chart로 그릴 날짜
const week: string[] = Array(8)
  .fill(0)
  .map((_, i) => yesterday.add(i, "d").format("M/D"));

//TMN 일 최저기온
let TMNs: string[] = [];
//TMX 일 최고기온
let TMXs: string[] = [];

const fetchWeatherData = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`데이터를 받아오는 중 오류 발생: ${response.status}`);
  }
  return response.json();
};

const createChart = (
  canvasSelector: string,
  labels: string[],
  datasets: Dataset[]
) => {
  const canvas = document.querySelector<HTMLCanvasElement>(canvasSelector);
  const ctx = canvas.getContext("2d");
  return new Chart(ctx, {
    type: "line",
    data: { labels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: true,
    },
  });
};

//어제 & 오늘 & 내일 온도 그래프
const fetchShortTermForecast = async (): Promise<void> => {
  showLoadingSpinner();
  try {
    const [yesterdayTemperatureData, shortTermTemperatureData] =
      await Promise.all([
        await fetchWeatherData(
          `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=${APP_SERVICE_KEY}&pageNo=1&numOfRows=1000&dataType=JSON&base_date=${yesterdayFormat}&base_time=0200&nx=55&ny=127`
        ),
        await fetchWeatherData(
          `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=${APP_SERVICE_KEY}&pageNo=1&numOfRows=1000&dataType=JSON&base_date=${currentDayFormat}&base_time=0200&nx=55&ny=127`
        ),
      ]);

    const yesterdayItems = await yesterdayTemperatureData.response.body.items
      .item;
    const shortTermItems = await shortTermTemperatureData.response.body.items
      .item;

    const data = {
      yesterdayTMN: yesterdayItems[48].fcstValue,
      yesterdayTMX: yesterdayItems[157].fcstValue,

      nowTMN: shortTermItems[48].fcstValue,
      nowTMX: shortTermItems[157].fcstValue,

      tomorrowTMN: shortTermItems[338].fcstValue,
      tomorrowTMX: shortTermItems[447].fcstValue,

      //어제, 오늘, 내일 온도에서는 필요 없지만 주간예보를 위해 미리 넣어둠
      after2daysTMN: shortTermItems[628].fcstValue,
      after2daysTMX: shortTermItems[737].fcstValue,
    };

    TMNs = [
      data.yesterdayTMN,
      data.nowTMN,
      data.tomorrowTMN,
      data.after2daysTMN,
    ];
    TMXs = [data.nowTMX, data.nowTMX, data.tomorrowTMX, data.after2daysTMX];

    createChart(".today-chart", week.slice(0, 3), [
      {
        label: "최저온도",
        fill: false,
        data: TMNs,
        backgroundColor: ["rgba(77,201,246, 0.2)"],
        borderColor: ["rgba(77,201,246, 1)"],
        borderWidth: 3,
      },
      {
        label: "최고온도",
        fill: false,
        data: TMXs,
        backgroundColor: ["rgba(255, 99, 132, 0.2)"],
        borderColor: ["rgba(255, 99, 132, 1)"],
        borderWidth: 3,
      },
    ]);

    document.querySelector(
      ".temperature-comparison"
    ).innerHTML = `어제보다 오늘은 최고온도 ${
      Number(TMXs[1]) - Number(TMXs[0])
    }도 / 최저온도 ${Number(TMNs[1]) - Number(TMNs[0])}도 차이가 있습니다!`;
  } catch (error) {
    console.error("Error:", error);
    alert("단기 예보 데이터를 가져오는 중 오류가 발생했습니다.");
  } finally {
    hideLoadingSpinner();
  }
};

//주간 온도 그래프
const fetchWeeklyForecast = async (): Promise<void> => {
  showLoadingSpinner();
  try {
    const temperatureData = await fetchWeatherData(
      `https://apis.data.go.kr/1360000/MidFcstInfoService/getMidTa?serviceKey=${APP_SERVICE_KEY}&pageNo=1&numOfRows=10&dataType=JSON&regId=11B10101&tmFc=${currentDayFormat}
      0600`
    );

    const items = temperatureData.response.body.items.item[0];
    const data = {
      after3daysTMN: items.taMin3,
      after3daysTMX: items.taMax3,

      after4daysTMN: items.taMin4,
      after4daysTMX: items.taMax4,

      after5daysTMN: items.taMin5,
      after5daysTMX: items.taMax5,

      after6daysTMN: items.taMin6,
      after6daysTMX: items.taMax6,

      after7daysTMN: items.taMin7,
      after7daysTMX: items.taMax7,
    };

    TMNs = [
      ...TMNs,
      data.after3daysTMN,
      data.after4daysTMN,
      data.after5daysTMN,
      data.after6daysTMN,
      data.after7daysTMN,
    ];

    TMXs = [
      ...TMXs,
      data.after3daysTMX,
      data.after4daysTMX,
      data.after5daysTMX,
      data.after6daysTMX,
      data.after7daysTMX,
    ];

    createChart(".weekly-chart", week, [
      {
        label: "최저온도",
        fill: false,
        data: TMNs,
        backgroundColor: ["rgba(77,201,246, 0.2)"],
        borderColor: ["rgba(77,201,246, 1)"],
        borderWidth: 3,
      },
      {
        label: "최고온도",
        fill: false,
        data: TMXs,
        backgroundColor: ["rgba(255, 99, 132, 0.2)"],
        borderColor: ["rgba(255, 99, 132, 1)"],
        borderWidth: 3,
      },
    ]);
  } catch (error) {
    console.error("Error:", error);
    alert("주간 데이터를 가져오는 중 오류가 발생했습니다.");
  } finally {
    hideLoadingSpinner();
  }
};

const fetchAllWeatherData = async () => {
  await fetchShortTermForecast();
  await fetchWeeklyForecast();
};
fetchAllWeatherData();
