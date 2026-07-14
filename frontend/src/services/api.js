import axios from "axios";

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem("skillsphere_token", token);
  } else {
    localStorage.removeItem("skillsphere_token");
  }
};

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("skillsphere_token");

  // console.log("Request Token:", token);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
