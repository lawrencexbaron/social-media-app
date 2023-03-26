import React from "react";
import axios from "axios";

const BASE_URL = "http://127.0.0.1:4000/api/auth";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
  },
});

export const register = async (payload) => {
  try {
    const res = await api.post("/register", payload);
    console.log(res.data);
    return res.data;
  } catch (err) {
    console.log(err.response.data.message);
    return err.response.data.message;
  }
};

export const login = async (payload) => {
  try {
    const res = await api.post("/login", payload);
    console.log(res.data);
    return res.data;
  } catch (err) {
    console.log(err.response.data.message);
    return err.response.data.message;
  }
};
