//import api, { csrf } from "./init";
import axios from "axios";

export async function isSignedIn() {
  //return api.get("/api/is_signed_in").then(res => res.data);
  return axios.get("/api/v1/is_signed_in").then(res => res.data);
}

export async function signIn(data) {
  //csrf();
  return axios.post("/users/sign_in", data).then(res => {
    console.log("in auth signin - response is ");
    console.log(res.data);
    return res.data;
  });
  //return axios.post("/users/sign_in", data).then(res => res.data);
}

export async function signOut() {
  //csrf();
  return axios.delete("/users/sign_out").then(res => res.data);
}

export async function signUp(data) {
  //csrf();
  return axios.post("/users", data).then(res => res.data);
}

export async function reloadUser(data) {
  //csrf();
  return axios.get("/api/v1/auth/reloadUser", data).then(res => res.data);
}
