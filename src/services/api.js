import axios from "axios";

const api = axios.create({
  baseURL: "https://farmacia-backend-5msr.onrender.com/api",
});

export default api;