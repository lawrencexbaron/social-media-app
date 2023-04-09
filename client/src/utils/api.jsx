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

// create getUsers
export const getUsers = async () => {
  try {
    const res = await api.get("/api/users");
    return res.data;
  } catch (error) {
    return Promise.reject(error.response.data);
  }
};

// create getUser by id
export const getUser = async (id) => {
  try {
    const res = await api.get(`/api/users/${id}`);
    return res.data;
  } catch (error) {
    return Promise.reject(error.response.data);
  }
};

// create updateUser
export const updateUser = async (id, data) => {
  try {
    const res = await api.put(`/api/users/${id}`, data);
    return res.data;
  } catch (error) {
    return Promise.reject(error.response.data);
  }
};

// create deleteUser
export const deleteUser = async (id) => {
  try {
    const res = await api.delete(`/api/users/${id}`);
    return res.data;
  } catch (error) {
    return Promise.reject(error.response.data);
  }
};

// create followUser
export const followUser = async (id) => {
  try {
    const res = await api.put(`/api/users/${id}/follow`);
    return res.data;
  } catch (error) {
    return Promise.reject(error.response.data);
  }
};

// create unfollowUser
export const unfollowUser = async (id) => {
  try {
    const res = await api.put(`/api/users/${id}/unfollow`);
    return res.data;
  } catch (error) {
    return Promise.reject(error.response.data);
  }
};

// create getPosts
export const getPosts = async () => {
  try {
    const res = await api.get("/api/posts");
    return res.data.data;
  } catch (error) {
    return Promise.reject(error.response.data);
  }
};

// create getPost by id
export const getPost = async (id) => {
  try {
    const res = await api.get(`/api/posts/${id}`);
    return res.data;
  } catch (error) {
    return Promise.reject(error.response.data);
  }
};

// create createPost validate token with header Authorization
export const createPost = async (data) => {
  try {
    const res = await api.post("/api/posts", data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return res.data;
  } catch (error) {
    console.log(error);
    return Promise.reject(error.response.data);
  }
};

// create updatePost
export const updatePost = async (id, data) => {
  try {
    const res = await api.put(`/api/posts/${id}`, data);
    return res.data;
  } catch (error) {
    return Promise.reject(error.response.data);
  }
};

// create deletePost
export const deletePost = async (id) => {
  try {
    const res = await api.delete(`/api/posts/${id}`);
    return res.data;
  } catch (error) {
    return Promise.reject(error.response.data);
  }
};

// create likePost
export const likePost = async (id) => {
  try {
    const res = await api.put(`/api/posts/${id}/like`);
    return res.data;
  } catch (error) {
    return Promise.reject(error.response.data);
  }
};

// create unlikePost
export const unlikePost = async (id) => {
  try {
    const res = await api.put(`/api/posts/${id}/unlike`);
    return res.data;
  } catch (error) {
    return Promise.reject(error.response.data);
  }
};

// create getTimelinePosts
export const getTimelinePosts = async () => {
  try {
    const res = await api.get("/api/posts/timeline/all");
    return res.data;
  } catch (error) {
    return Promise.reject(error.response.data);
  }
};

// create getProfilePosts
export const getProfilePosts = async (username) => {
  try {
    const res = await api.get(`/api/posts/profile/${username}`);
    return res.data;
  } catch (error) {
    return Promise.reject(error.response.data);
  }
};

// create commentPost
export const commentPost = async (id, data) => {
  try {
    const res = await api.post(`/api/posts/${id}/comment`, data);
    return res.data;
  } catch (error) {
    return Promise.reject(error.response.data);
  }
};

// create deleteComment
export const deleteComment = async (id, commentId) => {
  try {
    const res = await api.delete(`/api/posts/${id}/comment/${commentId}`);
    return res.data;
  } catch (error) {
    return Promise.reject(error.response.data);
  }
};

// create likeComment
export const likeComment = async (id, commentId) => {
  try {
    const res = await api.put(`/api/posts/${id}/comment/${commentId}/like`);
    return res.data;
  } catch (error) {
    return Promise.reject(error.response.data);
  }
};

// create unlikeComment
export const unlikeComment = async (id, commentId) => {
  try {
    const res = await api.put(`/api/posts/${id}/comment/${commentId}/unlike`);
    return res.data;
  } catch (error) {
    return Promise.reject(error.response.data);
  }
};
