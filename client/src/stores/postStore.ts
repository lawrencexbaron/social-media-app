import { create } from "zustand";
import axios from "axios";
import produce from "immer";
import { ENV_CONST } from "../components/utils/api/constants";

const base_api = ENV_CONST.BASE_URL;

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
    post: [],
    isLoading: false,
    isError: false,
    setPosts: (posts: any) => set({ posts }),
    setPost: (post: any) => set({ post }),
    clearPosts: () => set({ posts: [] }),
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

    getProfilePosts: async (username: any) => {
      set({ isLoading: true });
      try {
        const res = await axios.get(
          `${base_api}/api/posts/profile/${username}`
        );

        set({ posts: res.data, isLoading: false });
      } catch (err) {
        set({ isError: true });
      }
    },

    getPost: async (id: string) => {
      set({ isLoading: true });
      try {
        const res = await axios.get(`${base_api}/api/posts/${id}`);

        set({ post: res.data, isLoading: false });
      } catch (err) {
        set({ isError: true, isLoading: false });
      }
    },
    sharePost: async (id: string) => {
      set({ isLoading: true });
      try {
        const res = await axios.post(
          `${base_api}/api/posts/${id}/share`,
          {},
          {
            headers: authHeader(),
          }
        );
        set({
          posts: [res.data.data, ...posts],
          isError: false,
        });
      } catch (err) {
        set({ isError: true });
      }
    },
    createPost: async (data: { content: any; images: any; videos: any; }) => {
      const { content, images, videos } = data;

      const formData = new FormData();
      formData.append("content", content);

      images.forEach((image: string | Blob) => {
        formData.append("images", image);
      });

      videos.forEach((video: string | Blob) => {
        formData.append("videos", video);
      });

      try {
        // include token in header

        const res = await axios.post(`${base_api}/api/posts`, formData, {
          headers: authHeader(),
        });
        set({
          posts: [res.data.data, ...posts],
          isError: false,
        });
      } catch (err) {
        set({ isError: true });
      }
    },
    updatePost: async (id: any, content: any) => {
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

    deletePost: async (id: any) => {
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

    likePost: async (id: any) => {
      set({ isLoading: true });
      try {
        await axios.put(
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

    unlikePost: async (id: any) => {
      set({ isLoading: true });
      try {
        await axios.put(
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

    deleteComment: async (id: any, commentId: any) => {
      set({ isLoading: true });
      try {
        const res = await axios.delete(
          `${base_api}/api/posts/${id}/comment/${commentId}`,
          { headers: authHeader() }
        );
        set({
          posts: posts.map((p) => (p._id === id ? res.data.data : p)),
          isLoading: false,
        });
      } catch (err) {
        set({ isError: true, isLoading: false });
      }
    },

    commentPost: async (id: any, content: any) => {
      // set({ isLoading: true });
      try {
        const res = await axios.post(
          `${base_api}/api/posts/${id}/comment`,
          { text: content },
          { headers: authHeader() }
        );
        set({
          posts: posts.map((p) => (p._id === id ? res.data.data : p)),
          // isLoading: false,
        });
      } catch (err) {
        set({ isError: true, isLoading: false });
      }
    },

    likeComment: async (id: any, commentId: any) => {
      set({ isLoading: true });
      try {
        const res = await axios.put(
          `${base_api}/api/posts/${id}/comment/${commentId}/like`,
          {},
          { headers: authHeader() }
        );
        set({
          posts: posts.map((p) => (p._id === id ? res.data.data : p)),
          isLoading: false,
        });
      } catch (err) {
        set({ isError: true, isLoading: false });
      }
    },

    unlikeComment: async (id: any, commentId: any) => {
      set({ isLoading: true });
      try {
        const res = await axios.put(
          `${base_api}/api/posts/${id}/comment/${commentId}/unlike`,
          {},
          { headers: authHeader() }
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
