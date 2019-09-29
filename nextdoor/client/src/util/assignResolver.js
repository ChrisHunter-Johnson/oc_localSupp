import api, { csrf } from "./init";
export function assignResolver(data) {
  csrf();
  return api
    .post("/api/task/assignResolver", data)
    .then(function (res) {
      console.log("in api then block ");
      return res.data;
    })
    .catch(function (err) {
      console.log("in api catch block ");
      console.log(err);
      return err;
    });
}
