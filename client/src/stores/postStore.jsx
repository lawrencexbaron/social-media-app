import create from "zustand";
import {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
  getTimelinePosts,
  getProfilePosts,
  commentPost,
  deleteComment,
  likeComment,
  unlikeComment,
} from "../utils/api";

export const usePostStore = create((set) => {
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
        const posts = await getPosts();
        set({ posts, isLoading: false });
      } catch (err) {
        set({ isError: true, isLoading: false });
      }
    },

    getPost: async (id) => {
      const post = await getPost(id);
      set({ post });
    },

    createPost: async (content) => {
      const post = await createPost(content);
      set((state) => ({ posts: [...state.posts, post] }));
    },

    updatePost: async (id, content) => {
      const post = await updatePost(id, content);
      set((state) => ({
        posts: state.posts.map((p) => (p._id === id ? post : p)),
      }));
    },

    deletePost: async (id) => {
      await deletePost(id);
      set((state) => ({ posts: state.posts.filter((p) => p._id !== id) }));
    },

    likePost: async (id) => {
      const post = await likePost(id);
      set((state) => ({
        posts: state.posts.map((p) => (p._id === id ? post : p)),
      }));
    },

    unlikePost: async (id) => {
      const post = await unlikePost(id);
      set((state) => ({
        posts: state.posts.map((p) => (p._id === id ? post : p)),
      }));
    },

    getTimelinePosts: async () => {
      const posts = await getTimelinePosts();
      set({ posts });
    },

    getProfilePosts: async (username) => {
      const posts = await getProfilePosts(username);
      set({ posts });
    },

    commentPost: async (id, content) => {
      const post = await commentPost(id, content);
      set((state) => ({
        posts: state.posts.map((p) => (p._id === id ? post : p)),
      }));
    },

    deleteComment: async (id, commentId) => {
      const post = await deleteComment(id, commentId);
      set((state) => ({
        posts: state.posts.map((p) => (p._id === id ? post : p)),
      }));
    },

    likeComment: async (id, commentId) => {
      const post = await likeComment(id, commentId);
      set((state) => ({
        posts: state.posts.map((p) => (p._id === id ? post : p)),
      }));
    },

    unlikeComment: async (id, commentId) => {
      const post = await unlikeComment(id, commentId);
      set((state) => ({
        posts: state.posts.map((p) => (p._id === id ? post : p)),
      }));
    },

    reset: () => set({ posts: [], post: null }),

    resetPost: () => set({ post: null }),

    resetPosts: () => set({ posts: [] }),

    resetPostAndPosts: () => set({ posts: [], post: null }),

    resetPostAndPostsAndUser: () => set({ posts: [], post: null, user: null }),

    resetPostAndPostsAndUserAndUsers: () =>
      set({ posts: [], post: null, user: null, users: [] }),

    resetPostAndPostsAndUserAndUsersAndNotifications: () =>
      set({
        posts: [],
        post: null,
        user: null,
        users: [],
        notifications: [],
      }),
  };
});
