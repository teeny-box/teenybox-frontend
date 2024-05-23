export function decodeHTML(str) {
  let decode = "";
  decode = str.replace(/(<([^>]+)>)/gi, ""); // 태그 제거
  decode = decode.replace(/\s\s+/g, " "); // 연달아 있는 줄바꿈, 공백, 탭을 공백 1개로 줄임
  return decode;
}
