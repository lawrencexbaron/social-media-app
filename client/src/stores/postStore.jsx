import create from "zustand";
import axios from "axios";
import produce from "immer";

const base_api = "http://localhost:4000";

export const usePostStore = create((set) => {
  const authHeader = () => {
    const token = localStorage.getItem("token");
    if (token) {
      return { Authorization: `Bearer ${token}` };
    }
    return {};
  };

  return {
    posts: [],
    post: null,
    isLoading: false,
    isError: false,
    setPosts: (posts) => set({ posts }),
    setPost: (post) => set({ post }),

    getPosts: async () => {
      set({ isLoading: true });
      try {
        const res = await axios.get(`${base_api}/api/posts`, {
          headers: authHeader(),
        });
        set(
          produce((state) => {
            state.posts = res.data.data;
            state.isLoading = false;
          })
        );
      } catch (err) {
        set(
          produce((state) => {
            state.isError = true;
            state.isLoading = false;
          })
        );
      }
    },

    getPost: async (id) => {
      set({ isLoading: true });
      try {
        const res = await axios.get(`${base_api}/api/posts/${id}`);
        set({ post: res.data.data, isLoading: false });
      } catch (err) {
        set({ isError: true, isLoading: false });
      }
    },

    createPost: async (content) => {
      set({ isLoading: true });
      try {
        // include token in header
        const res = await axios.post(
          `${base_api}/api/posts`,
          {
            content: content,
          },
          {
            headers: authHeader(),
          }
        );
        set({
          posts: [res.data.data, ...posts],
          isLoading: false,
          isError: false,
        });
      } catch (err) {
        set({ isError: true, isLoading: false });
      }
    },
    updatePost: async (id, content) => {
      set({ isLoading: true });
      try {
        const res = await axios.put(`${base_api}/api/posts/${id}`, { content });
        set({
          posts: posts.map((p) => (p._id === id ? res.data.data : p)),
          isLoading: false,
        });
      } catch (err) {
        set({ isError: true, isLoading: false });
      }
    },

    deletePost: async (id) => {
      set({ isLoading: true });
      try {
        await axios.delete(`${base_api}/api/posts/${id}`, {
          headers: authHeader(),
        });
        set({
          posts: posts.filter((p) => p._id !== id),
          isLoading: false,
        });
      } catch (err) {
        set({ isError: true, isLoading: false });
      }
    },

    likePost: async (id) => {
      set({ isLoading: true });
      try {
        const res = await axios.put(
          `${base_api}/api/posts/${id}/like`,
          {},
          {
            headers: authHeader(),
          }
        );
      } catch (err) {
        set({ isError: true, isLoading: false });
      }
    },

    unlikePost: async (id) => {
      set({ isLoading: true });
      try {
        const res = await axios.put(
          `${base_api}/api/posts/${id}/unlike`,
          {},
          {
            headers: authHeader(),
          }
        );
      } catch (err) {
        set({ isError: true, isLoading: false });
      }
    },

    getTimelinePosts: async () => {
      set({ isLoading: true });
      try {
        const res = await axios.get(`${base_api}/api/posts/timeline/all`);
        set({ posts: res.data.data, isLoading: false });
      } catch (err) {
        set({ isError: true, isLoading: false });
      }
    },

    getProfilePosts: async (username) => {
      set({ isLoading: true });
      try {
        const res = await axios.get(
          `${base_api}/api/posts/profile/${username}`
        );
        set({ posts: res.data, isLoading: false });
      } catch (err) {
        set({ isError: true, isLoading: false });
      }
    },

    commentPost: async (id, content) => {
      set({ isLoading: true });
      try {
        const res = await axios.post(`${base_api}/api/posts/${id}/comment`, {
          content,
        });
        set({
          posts: posts.map((p) => (p._id === id ? res.data.data : p)),
          isLoading: false,
        });
      } catch (err) {
        set({ isError: true, isLoading: false });
      }
    },

    deleteComment: async (id, commentId) => {
      set({ isLoading: true });
      try {
        const res = await axios.delete(
          `${base_api}/api/posts/${id}/comment/${commentId}`
        );
        set({
          posts: posts.map((p) => (p._id === id ? res.data.data : p)),
          isLoading: false,
        });
      } catch (err) {
        set({ isError: true, isLoading: false });
      }
    },

    likeComment: async (id, commentId) => {
      set({ isLoading: true });
      try {
        const res = await axios.put(
          `${base_api}/api/posts/${id}/comment/${commentId}/like`
        );
        set({
          posts: posts.map((p) => (p._id === id ? res.data.data : p)),
          isLoading: false,
        });
      } catch (err) {
        set({ isError: true, isLoading: false });
      }
    },

    unlikeComment: async (id, commentId) => {
      set({ isLoading: true });
      try {
        const res = await axios.put(
          `${base_api}/api/posts/${id}/comment/${commentId}/unlike`
        );
        set({
          posts: posts.map((p) => (p._id === id ? res.data.data : p)),
          isLoading: false,
        });
      } catch (err) {
        set({ isError: true, isLoading: false });
      }
    },
  };
});
