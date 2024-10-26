import axios, { AxiosError } from "axios";

const BASE_URL = "http://localhost:4000";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
  },
});

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  username: string;
  firstname: string;
  lastname: string;
  confirmPassword: string;
  profilePicture: string | null;
}

interface User {
  _id: string;
  firstname: string;
  lastname: string;
  profilePicture: string;
  email: string;
  // Add other fields as necessary
}

interface Post {
  _id: string;
  content: string;
  // Add other fields as necessary
}

interface Comment {
  _id: string;
  content: string;
  // Add other fields as necessary
}

export const login = async ({ email, password }: LoginData): Promise<any> => {
  try {
    const res = await api.post("/api/auth/login", { email, password });
    return res.data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      return Promise.reject(error.response.data);
    }
    return Promise.reject(error);
  }
};

export const register = async (data: RegisterData): Promise<any> => {
  try {
    // const res = await api.post("/api/auth/register", data);
    const res = await axios.post(`${BASE_URL}/api/auth/register`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;

  } catch (error: any) {
    return Promise.reject(error.response.data);
  }
};

export const getUsers = async (): Promise<User[]> => {
  try {
    const { data } = await api.get("/api/users");
    return data.users;
  } catch (error: any) {
    return Promise.reject(error.response.data);
  }
};

export const getUser = async (id: string): Promise<User> => {
  try {
    const res = await api.get(`/api/users/${id}`);
    return res.data;
  } catch (error: any) {
    return Promise.reject(error.response.data);
  }
};

export const updateUser = async (data: Partial<User>): Promise<User> => {
  try {
    const res = await api.put(`/api/users/`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return res.data;
  } catch (error: any) {
    return Promise.reject(error.response.data);
  }
};

export const deleteUser = async (id: string): Promise<any> => {
  try {
    const res = await api.delete(`/api/users/${id}`);
    return res.data;
  } catch (error: any) {
    return Promise.reject(error.response.data);
  }
};

export const followUser = async (id: string): Promise<any> => {
  try {
    const res = await api.put(`/api/users/follow`, { id });
    return res.data;
  } catch (error: any) {
    return Promise.reject(error.response.data);
  }
};

export const unfollowUser = async (id: string): Promise<any> => {
  try {
    const res = await api.put(`/api/users/${id}/unfollow`);
    return res.data;
  } catch (error: any) {
    return Promise.reject(error.response.data);
  }
};

export const getPosts = async (): Promise<Post[]> => {
  try {
    const res = await api.get("/api/posts");
    return res.data.data;
  } catch (error: any) {
    return Promise.reject(error.response.data);
  }
};

export const getPost = async (id: string): Promise<Post> => {
  try {
    const res = await api.get(`/api/posts/${id}`);
    return res.data;
  } catch (error: any) {
    return Promise.reject(error.response.data);
  }
};

export const createPost = async (data: Partial<Post>): Promise<Post> => {
  try {
    const res = await api.post("/api/posts", data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return res.data;
  } catch (error: any) {
    return Promise.reject(error.response.data);
  }
};

export const updatePost = async (id: string, data: Partial<Post>): Promise<Post> => {
  try {
    const res = await api.put(`/api/posts/${id}`, data);
    return res.data;
  } catch (error: any) {
    return Promise.reject(error.response.data);
  }
};

export const deletePost = async (id: string): Promise<any> => {
  try {
    const res = await api.delete(`/api/posts/${id}`);
    return res.data;
  } catch (error: any) {
    return Promise.reject(error.response.data);
  }
};

export const likePost = async (id: string): Promise<any> => {
  try {
    const res = await api.put(`/api/posts/${id}/like`);
    return res.data;
  } catch (error: any) {
    return Promise.reject(error.response.data);
  }
};

export const unlikePost = async (id: string): Promise<any> => {
  try {
    const res = await api.put(`/api/posts/${id}/unlike`);
    return res.data;
  } catch (error: any) {
    return Promise.reject(error.response.data);
  }
};

export const getTimelinePosts = async (): Promise<Post[]> => {
  try {
    const res = await api.get("/api/posts/timeline/all");
    return res.data;
  } catch (error: any) {
    return Promise.reject(error.response.data);
  }
};

export const getProfilePosts = async (username: string): Promise<Post[]> => {
  try {
    const res = await api.get(`/api/posts/profile/${username}`);
    return res.data;
  } catch (error: any) {
    return Promise.reject(error.response.data);
  }
};

export const commentPost = async (id: string, data: Partial<Comment>): Promise<Comment> => {
  try {
    const res = await api.post(`/api/posts/${id}/comment`, data);
    return res.data;
  } catch (error: any) {
    return Promise.reject(error.response.data);
  }
};

export const deleteComment = async (id: string, commentId: string): Promise<any> => {
  try {
    const res = await api.delete(`/api/posts/${id}/comment/${commentId}`);
    return res.data;
  } catch (error: any) {
    return Promise.reject(error.response.data);
  }
};

export const likeComment = async (id: string, commentId: string): Promise<any> => {
  try {
    const res = await api.put(`/api/posts/${id}/comment/${commentId}/like`);
    return res.data;
  } catch (error: any) {
    return Promise.reject(error.response.data);
  }
};

export const unlikeComment = async (id: string, commentId: string): Promise<any> => {
  try {
    const res = await api.put(`/api/posts/${id}/comment/${commentId}/unlike`);
    return res.data;
  } catch (error: any) {
    return Promise.reject(error.response.data);
  }
};