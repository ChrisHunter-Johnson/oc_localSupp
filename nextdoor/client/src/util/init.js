import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001",
  //withCredentials: true,
  headers: { "Content-Type": "application/json" }
});

export function csrf() {
  const csrfToken = document.querySelector("meta[name=csrf-token]").content;
  //axios.defaults.headers.common["X-CSRF-Token"] = Rails.csrfToken(); // getMetaContent()
  axios.defaults.headers.common["X-CSRF-Token"] = csrfToken;
}

export default api;
