import axios from "axios";

const api = axios.create({
  baseURL: "https://createinfo.onrender.com", // backend API manzilingiz
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
