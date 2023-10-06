import TextInput from "../common/TextInput";
import Button from "../common/Button";
import { BsCardImage, BsCameraVideo } from "react-icons/bs";
import { usePostStore } from "../../stores/postStore";
import { useAuthStore } from "../../stores/authStore";
import { useQueryClient } from "react-query";
import { Toast } from "../common/Alert";
import { useState, Suspense } from "react";

const PostEditor = () => {
  const [content, setContent] = useState("");
  const [focus, setFocus] = useState(false);
  const { createPost, getPosts } = usePostStore();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const handlePostCreate = async (e) => {
    e.preventDefault();
    try {
      if (content === "") {
        setFocus(true);
        Toast({
          text: "Post cannot be empty",
          icon: "error",
          position: "bottom-end",
        });
        return;
      }
      await createPost(content);
      await getPosts();
      setFocus(false);
      Toast({
        text: "Post created successfully",
        icon: "success",
        position: "bottom-end",
      });

      queryClient.invalidateQueries("posts", { exact: true });
      queryClient.invalidateQueries(["profile"]);
      setContent("");
    } catch (error) {
      console.log(error.message);
      Toast({
        text: "Something went wrong",
        icon: "error",
        position: "bottom-end",
      });
    }
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className='bg-white rounded-lg px-6 py-5 mb-2 border border-slate-200 flex flex-col space-x-2'>
        <div className='mx-1 mb-4'>
          <p className='font-semibold'>Create Post</p>
        </div>
        <TextInput
          type='text'
          placeholder="What's up dude?"
          className={`${
            focus ? "border-red-500" : "border-slate-200"
          } py-6 bg-gray-100 text-slate-600`}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onFocus={() => setFocus(false)}
        />
        <div className='mt-4 flex justify-between'>
          <div className='flex space-x-7 text-sm my-auto justify-between text-gray-700 font-semibold'>
            <div className='flex my-auto space-x-2'>
              <BsCardImage className='my-auto' />
              <p>Image</p>
            </div>
            <div className='flex my-auto space-x-2'>
              <BsCameraVideo className='my-auto' />
              <p>Video</p>
            </div>
          </div>
          <div>
            <Button
              type='button'
              className='bg-blue-800 py-2 px-4 hover:bg-blue-600 text-white font-semibold text-sm focus:outline-none focus:shadow-outline rounded-full'
              onClick={handlePostCreate}
            >
              Publish
            </Button>
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default PostEditor;
