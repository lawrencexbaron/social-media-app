import TextInput from "../common/TextInput";
import Button from "../common/Button";
import { BsCardImage, BsCameraVideo } from "react-icons/bs";
import { usePostStore } from "../../stores/postStore";
import { useAuthStore } from "../../stores/authStore";
import { useQueryClient } from "react-query";
import { Toast } from "../common/Alert";
import { useState, Suspense } from "react";
import { IoIosClose } from "react-icons/io";
import { BiImage } from "react-icons/bi";
import { LuVideo } from "react-icons/lu";
import { FaRegFileVideo } from "react-icons/fa";

const PostEditor = () => {
  const [content, setContent] = useState("");
  const [focus, setFocus] = useState(false);
  const { createPost, getPosts } = usePostStore();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const [images, setImages] = useState([]);

  const [videos, setVideos] = useState([]);

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

      const data = {
        content,
        images,
        videos,
      };

      Toast({
        text: "Creating post...",
        icon: "info",
        position: "bottom-end",
      });

      await createPost(data);
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
      setImages([]);
      setVideos([]);
    } catch (error) {
      console.log(error.message);
      Toast({
        text: "Something went wrong",
        icon: "error",
        position: "bottom-end",
      });
    }
  };

  const handleVideoPreview = (e) => {
    const files = Array.from(e.target.files);
    console.log(files);
    if (
      files.length > 2 ||
      images.length + files.length > 2 ||
      images.length === 2
    ) {
      Toast({
        text: "You can upload maximum 2 videos",
        icon: "error",
        position: "bottom-end",
      });
      return;
    }

    files.forEach((file) => {
      if (!videos.some((video) => video.name === file.name)) {
        setVideos((prev) => [...prev, file]);
      }
    });

    console.log(videos);
  };

  // handleImagePreview push images to images state array if the image is not already in the array
  const handleImagePreview = (e) => {
    const files = Array.from(e.target.files);
    console.log(files);
    if (
      files.length > 4 ||
      images.length + files.length > 4 ||
      images.length === 4
    ) {
      Toast({
        text: "You can upload maximum 4 images",
        icon: "error",
        position: "bottom-end",
      });
      return;
    }

    files.forEach((file) => {
      if (!images.some((image) => image.name === file.name)) {
        setImages((prev) => [...prev, file]);
      }
    });
    console.log(images);
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className='bg-white rounded-lg px-6 py-5 mb-2 border border-slate-300 flex flex-col space-x-2'>
        <div className='mx-1 mb-4'>
          <p className='font-semibold'>Create Post</p>
        </div>
        <TextInput
          type='text'
          placeholder="What's up dude?"
          className={`${
            focus ? "border-red-500" : "border-slate-200"
          } py-5 bg-gray-100 text-slate-600`}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onFocus={() => setFocus(false)}
        />
        {images.length > 0 ? (
          <div className='flex px-2 py-2 gap-4 mt-4'>
            <input
              type='file'
              id='file'
              multiple
              className='hidden'
              onChange={handleImagePreview}
            />
            {images.length > 0 &&
              images.map((image, index) => (
                <div key={index} className='relative'>
                  <img
                    src={URL.createObjectURL(image)}
                    alt='preview'
                    key={image.name}
                    className='h-32 w-32 object-cover'
                  />
                  <IoIosClose
                    className=' bg-white text-slate-700 border border-slate-700 hover:cursor-pointer rounded-full absolute top-1 right-1'
                    onClick={() =>
                      setImages(images.filter((img) => img.name !== image.name))
                    }
                  />
                </div>
              ))}
          </div>
        ) : (
          <input
            type='file'
            id='file'
            name='images'
            accept='image/*'
            multiple
            className='hidden'
            onChange={handleImagePreview}
          />
        )}
        {videos.length > 0 ? (
          <div className='flex px-2 py-2 gap-4 mt-4'>
            <input
              type='file'
              id='video'
              multiple
              className='hidden'
              onChange={handleVideoPreview}
            />
            {videos.length > 0 &&
              videos.map((video, index) => (
                <div key={index} className='relative'>
                  <video
                    src={URL.createObjectURL(video)}
                    alt='preview'
                    key={video.name}
                    className='h-32 w-32 object-cover'
                  />
                  <IoIosClose
                    className=' bg-white text-slate-700 border border-slate-700 hover:cursor-pointer rounded-full absolute top-1 right-1'
                    onClick={() =>
                      setVideos(videos.filter((vid) => vid.name !== video.name))
                    }
                  />
                </div>
              ))}
          </div>
        ) : (
          <input
            type='file'
            id='video'
            name='videos'
            accept='video/*'
            multiple
            className='hidden'
            onChange={handleVideoPreview}
          />
        )}

        <div className='mt-4 flex justify-between'>
          <div className='flex space-x-7 my-auto justify-between text-gray-700 font-semibold'>
            <div
              className='flex my-auto space-x-2 hover:cursor-pointer hover:text-slate-500'
              onClick={() => document.getElementById("file").click()}
            >
              <BiImage className='my-auto text-lg' />
              <p className='text-sm'>Image</p>
            </div>
            <div
              className='flex my-auto space-x-2 hover:cursor-pointer hover:text-slate-500'
              onClick={() => document.getElementById("video").click()}
            >
              <LuVideo className='my-auto text-lg' />
              <p className='text-sm'>Video</p>
            </div>
          </div>
          <div>
            <Button
              type='button'
              className='bg-blue-800 py-1.5 px-4 hover:bg-blue-600 text-white font-semibold text-sm focus:outline-none focus:shadow-outline rounded-full'
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
