import { API_BASE_URL,axiosInstance  } from "./config";
import axios from 'axios';

export const registerUser = async (username, email, password) => {
    try {
      const response = await axiosInstance.post(API_BASE_URL+'/register', {
        username: username,
        email: email,
        password: password,
      });
  
      if (response.data.status === 'success') {
        return response.data.status; // 返回响应状态
      }else{
        return response.data.message;
      }
    } catch (error) {
      // 处理错误响应
      console.error(error);
    }
  };

  export const loginUser = async (username, password) => {
    try {
      const response = await axiosInstance.post(API_BASE_URL+'/login', {
        username: username,
        password: password,
      });
  
      if (response.data.status === 'success') {
        return response.data.status; // 返回响应状态
      }else{
        return response.data.message;
      }
    } catch (error) {
      // 处理错误响应
      console.error(error);
    }
  };