import { API_BASE_URL, axiosInstance } from "./config";
import axios from 'axios';
import Cookies from 'js-cookie';
export const registerUser = async (username, email, password) => {
  try {
    const response = await axiosInstance.post(API_BASE_URL + '/register', {
      username: username,
      email: email,
      password: password,
    }, { withCredentials: true });

    if (response.data.status === 'success') {
      // 保存 token 到 Cookies
      return response.data.status; // 返回响应状态
    } else {
      return response.data.message;
    }
  } catch (error) {
    // 处理错误响应
    console.error(error);
  }
};

export const loginUser = async (email, password) => {
  try {
    const response = await axiosInstance.post(API_BASE_URL + '/login', {
      email: email,
      password: password,
    }, { withCredentials: true });

    if (response.data.status === 'success') {
      return response.data.status; // 返回响应状态
    } else {
      return response.data.message;
    }
  } catch (error) {
    // 处理错误响应
    console.error(error);
  }
};


export const fetchUserInfo = async () => {
    try {
      const response = await axios.get("/api/userInfo");
      
    } catch (error) {
      console.error(error);
    }
  };