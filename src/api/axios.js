import axios from "axios";

const api = axios.create({
  baseURL: "https://api.usderp.uz/crm", // backend API manzilingiz
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
