import axios from "axios";

const api = axios.create({
  baseURL: "http://45.92.173.175:3000", // backend API manzilingiz
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
