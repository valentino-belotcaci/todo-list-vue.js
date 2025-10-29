import axios from "axios"; //making HTTP requests from the frontend

export default () => {
  return axios.create({
    baseURL: "http://localhost:3000/", //backend url
  });
};
