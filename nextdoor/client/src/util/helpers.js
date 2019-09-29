function csrfToken(document) {
  return document.querySelector('[name="csrf-token"]').content;
}

export function passCsrfToken(document, axios) {
  axios.defaults.headers.common["X-CSRF-TOKEN"] = csrfToken(document);
}

export function sqlDateFormat(sDate) {
  let retDate = "";

  let aDate = sDate.split("-");

  retDate = aDate[2] + "/" + aDate[1] + "/" + aDate[0];

  return retDate;
}
