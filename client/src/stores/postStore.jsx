import create from "zustand";
import { useQuery, useMutation } from "react-query";
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
import { queryClient } from "../utils/queryClient";

export const postStore = create((set) => {
  return {
    posts: [],
    post: null,
    setPosts: (posts) => set({ posts }),
    setPost: (post) => set({ post }),
    fetchPosts: () => {
      return useQuery("posts", () => getPosts(), {
        onSuccess: (data) => set({ posts: data }),
      });
    },
    fetchPost: (id) => {
      return useQuery(["post", id], () => getPost(id), {
        onSuccess: (data) => set({ post: data }),
      });
    },
    createPost: () => {
      return useMutation(createPost, {
        onSuccess: (data) => {
          set((state) => ({ posts: [...state.posts, data] }));
          queryClient.invalidateQueries("posts");
          console.log("post created");
        },
      });
    },
    updatePost: () => {
      return useMutation(updatePost, {
        onSuccess: (data) => {
          set((state) => ({
            posts: state.posts.map((post) =>
              post._id === data._id ? { ...post, ...data } : post
            ),
          }));
          queryClient.invalidateQueries("posts");
        },
      });
    },
    deletePost: () => {
      return useMutation(deletePost, {
        onSuccess: (data) => {
          set((state) => ({
            posts: state.posts.filter((post) => post._id !== data._id),
          }));
          queryClient.invalidateQueries("posts");
        },
      });
    },
    likePost: () => {
      return useMutation(likePost, {
        onSuccess: (data) => {
          set((state) => ({
            posts: state.posts.map((post) =>
              post._id === data._id ? { ...post, ...data } : post
            ),
          }));
          queryClient.invalidateQueries("posts");

          if (state.post) {
            set((state) => ({
              post: { ...state.post, ...data },
            }));
          }
          queryClient.invalidateQueries(["post", data._id]);
        },
      });
    },
    unlikePost: () => {
      return useMutation(unlikePost, {
        onSuccess: (data) => {
          set((state) => ({
            posts: state.posts.map((post) =>
              post._id === data._id ? { ...post, ...data } : post
            ),
          }));
          queryClient.invalidateQueries("posts");

          if (state.post) {
            set((state) => ({
              post: { ...state.post, ...data },
            }));
          }
          queryClient.invalidateQueries(["post", data._id]);
        },
      });
    },
  };
});
