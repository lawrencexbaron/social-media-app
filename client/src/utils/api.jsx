import axios from "axios";

const BASE_URL = "http://localhost:4000";

const api = axios.create({
  baseURL: BASE_URL,
  // cors
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
  },
});

export const login = async ({ email, password }) => {
  try {
    const res = await api.post("/api/auth/login", { email, password });
    return res.data;
  } catch (error) {
    return Promise.reject(error.response.data);
  }
};

export const register = async (data) => {
  try {
    const res = await api.post("/api/auth/register", data);
    return res.data;
  } catch (error) {
    return Promise.reject(error.response.data);
  }
};
