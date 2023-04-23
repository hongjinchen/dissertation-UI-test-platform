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
      return {
        status: response.data.status,
        userId: response.data.user_id,
      };
    } else {
      return response.data.message;
    }
  } catch (error) {
    // 处理错误响应
    console.error(error);
  }
};


export const fetchUserData = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/user/${userId}`);
    const userData = response.data;

    return userData;
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
};

export const updateUserInfo = async (userId, username, personalIntroduction) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/infoEdit/${userId}`, {
      username: username,
      description: personalIntroduction,
    });

    if (response.data.status === 'success') {
      return response.data;
    } else {
      return response.data.message;
    }
  } catch (error) {
    console.error('Error updating user info:', error);
  }
};

export const updateUserPassword = async (userId, oldPassword, newPassword) => {

  try {
    const response = await axios.put(API_BASE_URL + `/changePassword/${userId}`, {
      old_password: oldPassword,
      new_password: newPassword,
    });

    if (response.data.status === 'success') {
      return response.data;
    } else {
      return response.data.message;
    }
  } catch (error) {
    console.error('Error updating user info:', error);
  }
}

export const updateEmail = async (userId, newEmail) => {
  try {
    const response = await axios.put(API_BASE_URL + `/update-email/${userId}`, {
      email: newEmail,
    });

    if (response.data.status === 'success') {
      return response.data;
    } else {
      return response.data.message;
    }
  } catch (error) {
    console.error('Error updating user email:', error);
  }
};


export const createTeam = async (teamName, teamDescription, teamMembers, visibility) => {
  try {
    const response = await axios.post(API_BASE_URL + '/create-team', {
      team_name: teamName,
      team_description: teamDescription,
      team_members: teamMembers.map((member) => member.id),
      visibility: visibility,
    });

    if (response.data.status === 'success') {
      return response.data;
    } else {
      return response.data.message;
    }
  } catch (error) {
    console.error('Error creating team:', error);
  }
};
