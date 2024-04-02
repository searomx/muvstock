import axios from "axios";

export const api = axios.create({
  baseURL: "https://muvstock.vercel.app/",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});
