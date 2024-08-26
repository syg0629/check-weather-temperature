// 기상청 주간 예보 API 예보구역코드
// 예보구역코드가 있어야 그 지역의 주간 날씨 조회 가능
export const areaCodeMap: Map<string, string> = new Map([
  ["백령도", "11A00101"],
  ["서울", "11B10101"],
  ["과천", "11B10102"],
  ["광명", "11B10103"],
  ["강화", "11B20101"],
  ["김포", "11B20102"],
  ["인천", "11B20201"],
  ["시흥", "11B20202"],
  ["안산", "11B20203"],
  ["부천", "11B20204"],
  ["의정부", "11B20301"],
  ["고양", "11B20302"],
  ["양주", "11B20304"],
  ["파주", "11B20305"],
  ["동두천", "11B20401"],
  ["연천", "11B20402"],
  ["포천", "11B20403"],
  ["가평", "11B20404"],
  ["구리", "11B20501"],
  ["남양주", "11B20502"],
  ["양평", "11B20503"],
  ["하남", "11B20504"],
  ["수원", "11B20601"],
  ["안양", "11B20602"],
  ["오산", "11B20603"],
  ["화성", "11B20604"],
  ["성남", "11B20605"],
  ["평택", "11B20606"],
  ["의왕", "11B20609"],
  ["군포", "11B20610"],
  ["안성", "11B20611"],
  ["용인", "11B20612"],
  ["이천", "11B20701"],
  ["광주", "11B20702"],
  ["여주", "11B20703"],
  ["충주", "11C10101"],
  ["진천", "11C10102"],
  ["음성", "11C10103"],
  ["제천", "11C10201"],
  ["단양", "11C10202"],
  ["청주", "11C10301"],
  ["보은", "11C10302"],
  ["괴산", "11C10303"],
  ["증평", "11C10304"],
  ["추풍령", "11C10401"],
  ["영동", "11C10402"],
  ["옥천", "11C10403"],
  ["서산", "11C20101"],
  ["태안", "11C20102"],
  ["당진", "11C20103"],
  ["홍성", "11C20104"],
  ["보령", "11C20201"],
  ["서천", "11C20202"],
  ["천안", "11C20301"],
  ["아산", "11C20302"],
  ["예산", "11C20303"],
  ["대전", "11C20401"],
  ["공주", "11C20402"],
  ["계룡", "11C20403"],
  ["세종", "11C20404"],
  ["부여", "11C20501"],
  ["청양", "11C20502"],
  ["금산", "11C20601"],
  ["논산", "11C20602"],
  ["철원", "11D10101"],
  ["화천", "11D10102"],
  ["인제", "11D10201"],
  ["양구", "11D10202"],
  ["춘천", "11D10301"],
  ["홍천", "11D10302"],
  ["원주", "11D10401"],
  ["횡성", "11D10402"],
  ["영월", "11D10501"],
  ["정선", "11D10502"],
  ["평창", "11D10503"],
  ["대관령", "11D20201"],
  ["태백", "11D20301"],
  ["속초", "11D20401"],
  ["고성", "11D20402"],
  ["양양", "11D20403"],
  ["강릉", "11D20501"],
  ["동해", "11D20601"],
  ["삼척", "11D20602"],
  ["울릉도", "11E00101"],
  ["독도", "11E00102"],
  ["전주", "11F10201"],
  ["익산", "11F10202"],
  ["정읍", "11F10203"],
  ["완주", "11F10204"],
  ["장수", "11F10301"],
  ["무주", "11F10302"],
  ["진안", "11F10303"],
  ["남원", "11F10401"],
  ["임실", "11F10402"],
  ["순창", "11F10403"],
  ["군산", "21F10501"],
  ["김제", "21F10502"],
  ["고창", "21F10601"],
  ["부안", "21F10602"],
  ["함평", "21F20101"],
  ["영광", "21F20102"],
  ["진도", "21F20201"],
  ["완도", "11F20301"],
  ["해남", "11F20302"],
  ["강진", "11F20303"],
  ["장흥", "11F20304"],
  ["여수", "11F20401"],
  ["광양", "11F20402"],
  ["고흥", "11F20403"],
  ["보성", "11F20404"],
  ["순천시", "11F20405"],
  ["장성", "11F20502"],
  ["나주", "11F20503"],
  ["담양", "11F20504"],
  ["화순", "11F20505"],
  ["구례", "11F20601"],
  ["곡성", "11F20602"],
  ["순천", "11F20603"],
  ["흑산도", "11F20701"],
  ["목포", "21F20801"],
  ["영암", "21F20802"],
  ["신안", "21F20803"],
  ["무안", "21F20804"],
  ["성산", "11G00101"],
  ["제주", "11G00201"],
  ["성판악", "11G00302"],
  ["서귀포", "11G00401"],
  ["고산", "11G00501"],
  ["이어도", "11G00601"],
  ["추자도", "11G00800"],
  ["울진", "11H10101"],
  ["영덕", "11H10102"],
  ["포항", "11H10201"],
  ["경주", "11H10202"],
  ["문경", "11H10301"],
  ["상주", "11H10302"],
  ["예천", "11H10303"],
  ["영주", "11H10401"],
  ["봉화", "11H10402"],
  ["영양", "11H10403"],
  ["안동", "11H10501"],
  ["의성", "11H10502"],
  ["청송", "11H10503"],
  ["김천", "11H10601"],
  ["구미", "11H10602"],
  ["군위", "11H10707"],
  ["고령", "11H10604"],
  ["성주", "11H10605"],
  ["대구", "11H10701"],
  ["영천", "11H10702"],
  ["경산", "11H10703"],
  ["청도", "11H10704"],
  ["칠곡", "11H10705"],
  ["울산", "11H20101"],
  ["양산", "11H20102"],
  ["부산", "11H20201"],
  ["창원", "11H20301"],
  ["김해", "11H20304"],
  ["통영", "11H20401"],
  ["사천", "11H20402"],
  ["거제", "11H20403"],
  ["남해", "11H20405"],
  ["함양", "11H20501"],
  ["거창", "11H20502"],
  ["합천", "11H20503"],
  ["밀양", "11H20601"],
  ["의령", "11H20602"],
  ["함안", "11H20603"],
  ["창녕", "11H20604"],
  ["진주", "11H20701"],
  ["산청", "11H20703"],
  ["하동", "11H20704"],
  ["사리원", "11I10001"],
  ["신계", "11I10002"],
  ["해주", "11I20001"],
  ["개성", "11I20002"],
  ["장연", "11I20003"],
  ["용연", "11I20003"],
  ["신의주", "11J10001"],
  ["삭주", "11J10002"],
  ["수풍", "11J10002"],
  ["구성", "11J10003"],
  ["자성", "11J10004"],
  ["중강", "11J10004"],
  ["강계", "11J10005"],
  ["희천", "11J10006"],
  ["평양", "11J20001"],
  ["진남포", "11J20002"],
  ["남포", "11J20002"],
  ["안주", "11J20004"],
  ["양덕", "11J20005"],
  ["청진", "11K10001"],
  ["웅기", "11K10002"],
  ["선봉", "11K10002"],
  ["성진", "11K10003"],
  ["김책", "11K10003"],
  ["무산", "11K10004"],
  ["삼지연", "11K10004"],
  ["함흥", "11K20001"],
  ["장진", "11K20002"],
  ["북청", "11K20003"],
  ["신포", "11K20003"],
  ["혜산", "11K20004"],
  ["풍산", "11K20005"],
  ["원산", "11L10001"],
  ["고성", "11L10002"],
  ["장전", "11L10002"],
  ["평강", "11L10003"],
]);
