// URL로 데이터를 가져오고 요청 실패 시 오류 처리
export const fetchData = async (url: string, option: RequestInit = {}) => {
  const response = await fetch(url, option);

  if (!response.ok) {
    throw new Error(`데이터를 받아오는 중 오류 발생: ${response.status}`);
  }
  return response.json();
};
