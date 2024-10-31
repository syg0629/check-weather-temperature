# check-weather-temperature(날씨 온도 비교)

- **사용 기술 :** TypeScript, Webpack
- **작업 기간 :** 2023.05.25 ~ 2023.06.16
- **배포 링크 :** https://check-weather-temperature.netlify.app/
<br/>

## 프로젝트 소개.

대부분의 날씨 정보 서비스들은 현재와 미래의 날씨 정보만을 직관적으로 제공합니다.<br/>
과거의 날씨 정보는 '지나간 정보'라는 이유로 제공하지 않거나, 추가 클릭을 통해서 확인할 수 있습니다.<br/>
하지만 우리는 **어제 경험한 날씨를 통해 오늘의 체감 온도를 더 정확하게 예측**할 수 있습니다. "어제보다 더 춥다" 또는 "어제보다 덜 덥다"와 같은 비교는 일상생활에서 매우 유용하게 활용됩니다.<br/>
<br/>
이러한 사용자 경험을 바탕으로, 어제-오늘-내일의 날씨를 최고/최저 온도로 한눈에 비교할 수 있는 서비스를 개발하게 되었습니다.

<br/>

## 프로젝트 주요 메뉴 및 기능

<img width="600" alt="image" src="https://github.com/user-attachments/assets/96d7f5d1-0090-451b-9ca8-d049396f6066">
<br/>

### 1. 어제, 오늘, 내일 온도
- 사용자의 현재 위치를 세부 주소까지 파악하여 날씨 정보를 가져옴
    - HTML5 Geolocation API와 Kakao Maps API 연동
    - 위치 정보 실패 시 서울 좌표 기본값 제공
- 어제, 오늘, 내일의 최고/최저 온도를 차트로 시각화
    - Chart.js 커스텀 차트 구현
    - 기상청 단기예보 API, 중기예보 API 데이터 가공
- 기상청 API의 하늘 상태와 강수 형태 코드를 이모지로 변환하여 날씨 표현
- 어제, 오늘의 온도 차이를 자동 계산하여 텍스트로 표시

<br/>

<img width="600" alt="image" src="https://github.com/user-attachments/assets/d6fb40f2-2484-4223-acab-58c308e3adc8">
<br/>

### 2. 주간 온도
- 사용자의 현재 위치를 지역 단위로 파악하여 날씨 정보를 가져옴
    - 지역별 예보구역 코드 매핑
- 최대 7일간의 온도 변화 추이를 차트로 시각화
