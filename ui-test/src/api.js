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
    const response = await axios.put(API_BASE_URL + `/updateEmail/${userId}`, {
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


export const createTeam = async (teamName, teamDescription, teamMembers,user_id) => {
  try {
    const response = await axios.post(API_BASE_URL + '/createTeam', {
      team_name: teamName,
      team_description: teamDescription,
      team_members: teamMembers.map((member) => member.id),
      user_id: user_id,
    });

    return response.data;
  } catch (error) {
    console.error('Error creating team:', error);
    return { status: 'failed', error: 'Error creating team' };
  }
};

export const searchUsers = async (userName,user_id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/searchUsers`, {
      params: { userName: userName, user_id: user_id }, // Pass user_id as a request parameter
    });

    if (response.data.status === 'success') {
      return response.data.users.map((user) => ({
        id: user.user_id,
        name: user.username,
        avatar_link: user.avatar_link,
      }));
    } else {
      console.error("Error searching users:", response.data.message);
      return [];
    }
  } catch (error) {
    console.error("Error searching users:", error);
    return [];
  }
};

export const fetchUserTeams = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/getUserTeams/${userId}`);
    return response;
  } catch (error) {
    console.error("Error fetching user teams:", error);
  }
};


export const fetchMembers = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/getTeamMembers/${id}`);
    return response;
  } catch (error) {
    console.error("Error fetching team members:", error);
  }
};