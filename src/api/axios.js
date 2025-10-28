import axios from "axios";

const api = axios.create({
  baseURL: "https://dev.usderp.uz/baza", // backend API manzilingiz
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
