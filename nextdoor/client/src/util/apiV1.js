//import api, { csrf } from "./init";
import axios from "axios";
export async function taskCreate(data) {
  //csrf();
  return axios.post("/api/v1/task", data).then(res => res.status);
}

export async function messageTopicCreate(data) {
  //csrf();
  return axios.post("/api/v1/message_topic", data).then(res => res.status);
}

export async function messageCreate(data) {
  //csrf();
  return axios.post("/api/v1/message", data).then(res => res.data);
}

export async function convMessages(data) {
  //csrf();
  return axios.get("/api/v1/message/byConv", data).then(res => res.data);
}

export async function convCountByNeed(data) {
  // csrf();
  return axios
    .get("/api/v1/conversation/countByNeed", data)
    .then(res => res.data);
}

export async function openTasks() {
  // csrf();
  return axios.get("api/v1/task/open").then(res => res.data);
}

export async function myOpenNeeds(data) {
  //csrf();
  return axios.get("/api/v1/task/myOpen", data).then(res => res.data);
}

export async function myFullfilledNeeds(data) {
  //csrf();
  return axios
    .get("/api/v1/task/myFullfilledCount", data)
    .then(res => res.data);
}

export async function closeTask(data) {
  //csrf();
  return axios.get("/api/v1/task/complete", data).then(res => res.data);
}
export async function assignResolver(data) {
  //csrf();

  return axios.get("/api/v1/task/assignResolver", data).then(function(res) {
    console.log("in api then block");
    return res.data;
  });
  //.catch(function(err) {
  //  console.log("in api then block");
  //   console.log(err);
  //});
}

export async function userConversation(data) {
  //csrf();
  return axios.get("/api/v1/conversation/byUser", data).then(res => res.data);
}

export async function convUsers(data) {
  //csrf();
  return axios.get("/api/v1/conversation/userList", data).then(res => res.data);
}

export async function resolver(data) {
  //csrf();
  return axios
    .get("/api/v1/message_topic/resolver", data)
    .then(res => res.data);
}
export async function messageList(data) {
  //csrf();
  return axios
    .get("/api/v1/conversation/messageList", data)
    .then(res => res.data);
}
export async function boundsTasks(data) {
  //csrf();
  return axios
    .get("api/v1/task/bounds", data)
    .then(res => res.data)
    .catch(err => {
      console.log(err);
    });
}

export async function raisedOpen24Hr(data) {
  //csrf();
  return axios
    .get("/api/v1/task/unmetOver24Hr", data)
    .then(res => res.data)
    .catch(err => {
      console.log(err);
    });
}

export async function reRaise(data) {
  ///csrf();
  return axios.post("/api/v1/task/reRaiseNeed", data).then(res => res.data);
}

export function resolverCount(data) {
  //csrf();
  return axios.get("/api/v1/task/resolverCount", data).then(res => res.data);
}

export async function needResolver(data) {
  //csrf();
  return axios.get("/api/v1/task/needResolver", data).then(res => res.data);
}

export function myResolving(data) {
  // csrf();
  return axios
    .get("/api/v1/user_profile/resolvingTasks", data)
    .then(res => res.data)
    .catch(err => err.status);
}

export function raisedCount(data) {
  //csrf();
  return axios.get("/api/v1/profile/raisedCount", data).then(res => res.data);
}

//
export async function conversationCreate(data) {
  //csrf();
  return axios.post("/api/v1/conversation", data).then(res => res.data);
}
