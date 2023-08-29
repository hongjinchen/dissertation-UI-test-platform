import axios from "axios";

// export const API_BASE_URL = "http://localhost:5000";
export const API_BASE_URL = "https://perksummit.club:5000";
export const axiosInstance = axios.create({
    withCredentials: true,
  });
  