import { API_KEY } from "../../constants/api";
import { LocationCode, userLocation } from "../../types/type";
import { areaCodeMap } from "../../constants/maps/areaCodeMap";
import { branchCodeMap } from "../../constants/maps/branchCodeMap";
import { landForecastAreaCodeMap } from "../../constants/maps/landForecastAreaCodeMap";
import { fetchData } from "../fetchData";

// 예보구역코드, 지점코드 오류 시 서울이 기본 값
const DEFAULT_LOCATION = {
  areaCode: "11B10101",
  branchCode: "108",
  landForecastAreaCode: "11B00000",
};

export const fetchReverseGeo = async (
  userLocation: userLocation
): Promise<LocationCode> => {
  try {
    const url = `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${userLocation.lng}&y=${userLocation.lat}`;
    const data = await fetchData(url, {
      headers: {
        Authorization: `KakaoAK ${API_KEY.KAKAO_REST_API_KEY}`,
      },
    });
    const { region_1depth_name, region_2depth_name, region_3depth_name } =
      data.documents[0].address;
    updateLocationDisplay(
      region_1depth_name,
      region_2depth_name,
      region_3depth_name
    );

    if (region_1depth_name === "서울") {
      return getAreaBranchCode(region_1depth_name);
    }
    return getAreaBranchCode(region_2depth_name.split("시")[0]);
  } catch (error) {
    alert(
      "카카오 맵을 통해 예보구역코드를 가져오는 중 오류가 발생하였습니다. 기본 위치(서울)로 날씨 정보를 가져옵니다."
    );
    return DEFAULT_LOCATION;
  }
};

const updateLocationDisplay = (
  region1: string,
  region2: string,
  region3: string
) => {
  document.querySelector(
    ".header-shortTerm-userLocation"
  ).innerHTML = `${region1} ${region2} ${region3}`;
  document.querySelector(
    ".header-weekly-userLocation"
  ).innerHTML = `${region1}`;
};

// 기상청 주간 예보 API 사용 시 필요한 예보구역코드 가져오기
const getAreaBranchCode = (locationName: string) => {
  const areaCode = areaCodeMap.get(locationName);
  const branchCode = branchCodeMap.get(locationName);
  let landForecastAreaCode = "";

  for (const [code, region] of landForecastAreaCodeMap) {
    if (
      region.split(", ").some((regionName) => regionName.includes(locationName))
    ) {
      landForecastAreaCode = code;
      break;
    }
  }

  if (areaCode && branchCode && landForecastAreaCode)
    return { areaCode, branchCode, landForecastAreaCode };
  alert(
    `"${locationName}"의 예보구역코드를 찾을 수 없어 기본 위치(서울)로 날씨 정보를 가져옵니다.`
  );
  return DEFAULT_LOCATION;
};
