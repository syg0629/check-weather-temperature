import { userLocation } from "../../types/type";
import { areaCodeMap } from "../../utils/areaCodeMap";
import { fetchData } from "../fetchData";

const KAKAO_REST_API_KEY = process.env.KAKAO_REST_API_KEY;
// 예보구역코드 오류 시 서울이 기본 값
const DEFAULT_AREA_CODE = "11B10101";

export const fetchReverseGeo = async (
  userLocation: userLocation
): Promise<string> => {
  try {
    const url = `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${userLocation.lng}&y=${userLocation.lat}`;
    const data = await fetchData(url, {
      headers: {
        Authorization: `KakaoAK ${KAKAO_REST_API_KEY}`,
      },
    });
    const { region_1depth_name, region_2depth_name, region_3depth_name } =
      data.documents[0].address;
    updateLocationDisplay(
      region_1depth_name,
      region_2depth_name,
      region_3depth_name
    );
    return getAreaCode(region_1depth_name);
  } catch (error) {
    alert(
      "카카오 맵을 통해 예보구역코드를 가져오는 중 오류가 발생하였습니다. 기본 위치(서울)로 날씨 정보를 가져옵니다."
    );
    return DEFAULT_AREA_CODE;
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
const getAreaCode = (locationName: string) => {
  const code = areaCodeMap.get(locationName);
  if (code) return code;

  alert(
    `"${locationName}"의 예보구역코드를 찾을 수 없어 기본 위치(서울)로 날씨 정보를 가져옵니다.`
  );
  return DEFAULT_AREA_CODE;
};
