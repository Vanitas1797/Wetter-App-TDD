export function getCookie(cName) {
  const name = cName + '=';
  const cDecoded = decodeURIComponent(document.cookie); //to be careful
  const cArr = cDecoded.split('; ');
  let res;
  cArr.forEach((val) => {
    if (val.indexOf(name) === 0) res = val.substring(name.length);
  });
  return res;
}
export function deleteCookie(cName) {
  document.cookie = `${cName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}
export function setCookie(cName, cValue, exMinutes) {
  const d = new Date();
  d.setTime(d.getTime() + exMinutes * 60 * 1000);
  let expires = 'expires=' + d.toUTCString();
  document.cookie = cName + '=' + cValue + ';' + expires + ';path=/';
}
