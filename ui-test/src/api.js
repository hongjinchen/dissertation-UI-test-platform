import { API_BASE_URL, axiosInstance } from "./config";
import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: API_BASE_URL, // 设置您的 API 基本 URL
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');

    // 如果存在 token，则在请求头中添加 Authorization 信息
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// user 部分 接口

// 注册
export const registerUser = async (username, email, password) => {
  try {
    const response = await axiosInstance.post(API_BASE_URL + '/register', {
      username: username,
      email: email,
      password: password,
    }, { withCredentials: true });

    if (response.data.status === 'success') {
      return response.data.status;
    } else {
      return response.data.message;
    }
  } catch (error) {
    // 处理错误响应
    console.error(error);
  }
};

// 登录
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

// 获取用户信息
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

// team 部分 接口
export const createTeam = async (teamName, teamDescription, teamMembers, user_id) => {
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

export const searchUsers = async (userName, user_id) => {
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
    const response = await api.get(`/getUserTeams/${userId}`);
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

export const saveDroppedItems = async (droppedItems) => {
  try {
    const response = await axios.post('/api/saveDroppedItems', droppedItems);
    console.log('保存成功:', response.data);
  } catch (error) {
    console.error('保存失败:', error);
  }
};

export const saveTestCase = async (data) => {
  try {
    const response = await axiosInstance.post(API_BASE_URL + '/saveTestEvents', data, { withCredentials: true });

    if (response.data.status === 'success') {
      return response.data.status;
    } else {
      return response.data.message;
    }
  } catch (error) {
    // 处理错误响应
    console.error(error);
  }
};
export const fetchName = async (testCaseId) => {
  const response = await fetch(API_BASE_URL + `/testEventName?testeventID=${testCaseId}`);

  if (response.ok) {
    const data = await response.json();
    return data.name;
  } else {
    const errorData = await response.json();
    console.error(`Error fetching name: ${errorData.error}`);
    return null;
  }
}

export const fetchTestCaseData = async (testCaseId) => {
  const response = await fetch(API_BASE_URL + `/getTestCases?testeventID=${testCaseId}`);
  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    const errorData = await response.json();
    console.error(`Error fetching data: ${errorData.error}`);
    return null;
  }
}

export const searchTestCase = async (data) => {
  try {
    const response = await axiosInstance.post(API_BASE_URL + '/searchTestCase', data, { withCredentials: true });
    return response.data;

  } catch (error) {
    // 处理错误响应
    console.error(error);
  }
};

export const searchTestReport = async (data) => {
  try {
    const response = await axiosInstance.post(API_BASE_URL + '/searchTestReport', data, { withCredentials: true });
    return response.data;

  } catch (error) {
    // 处理错误响应
    console.error(error);
  }
};