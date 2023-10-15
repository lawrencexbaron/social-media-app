import Base from "../Layout/Base";
import TextInput from "../common/TextInput";
import Button from "../common/Button";
import Label from "../common/Label";
import { useState } from "react";
import { useAuthStore } from "../../stores/authStore";
import { useUpdateUser } from "../../hooks/useUpdateUser";
import { useProfile } from "../Profile/hooks/useProfile";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const Settings = () => {
  const { mutate, isLoading, error, isSuccess } = useUpdateUser();
  const { user } = useAuthStore();
  const { data: profile } = useProfile(user._id);

  const [formData, setFormData] = useState({
    firstname: profile.data.firstname ? profile.data.firstname : "",
    lastname: profile.data.lastname ? profile.data.lastname : "",
    username: profile.data.username ? profile.data.username : "",
    email: profile.data.email ? profile.data.email : "",
    password: "",
    confirmPassword: "",
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      setIsSaving(true);

      setTimeout(() => {
        mutate(formData);
        setIsSaving(false);
      }, 1500);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Base>
      <div className='flex flex-col justify-center sm:flex-row sm:space-x-5 space-y-1 sm:space-y-0 mt-8'>
        <div className='bg-white h-auto border border-slate-300 flex-col px-4 py-5 rounded-lg w-1/2'>
          <p className='font-semibold text-lg'>General Settings</p>
          {error && (
            <div
              className='bg-red-100 border flex flex-col border-red-400 text-red-700 px-4 py-3 rounded relative mt-4'
              role='alert'
            >
              <p className='font-bold'>Error!</p>
              {Array.isArray(error.messages) ? (
                error.messages.map((err) => <p key={err}>{err}</p>)
              ) : (
                <p>{error.messages}</p>
              )}
            </div>
          )}
          {isSuccess && (
            <div
              className='bg-green-100 border flex flex-col border-green-400 text-green-700 px-4 py-3 rounded relative mt-4'
              role='alert'
            >
              <p className='font-bold'>Success!</p>
              <p>Profile updated successfully</p>
            </div>
          )}
          <form action='' className='my-4'>
            <div className='flex justify-around gap-2'>
              <div className='w-full'>
                <Label htmlFor='firstname'>First Name</Label>
                <TextInput
                  id='firstname'
                  type='text'
                  name='firstname'
                  placeholder='First Name'
                  value={formData.firstname}
                  onChange={handleChange}
                  className='mb-2'
                />
                <Label htmlFor='lastname'>Last Name</Label>
                <TextInput
                  id='lastname'
                  type='text'
                  name='lastname'
                  placeholder='Last Name'
                  value={formData.lastname}
                  onChange={handleChange}
                  className='mb-2'
                />
                <Label htmlFor='username'>Username</Label>
                <TextInput
                  id='username'
                  type='text'
                  name='username'
                  placeholder='Username'
                  value={formData.username}
                  onChange={handleChange}
                  className='mb-2'
                />
              </div>
              <div className='w-full'>
                <Label htmlFor='email'>Email</Label>
                <TextInput
                  id='email'
                  type='email'
                  name='email'
                  placeholder='Email'
                  value={formData.email}
                  onChange={handleChange}
                  className='mb-2'
                />
                <Label htmlFor='password'>Password</Label>
                <TextInput
                  id='password'
                  type='password'
                  name='password'
                  placeholder='Password'
                  value={formData.password}
                  onChange={handleChange}
                  className='mb-2'
                />
                <Label htmlFor='confirmPassword'>Confirm Password</Label>
                <TextInput
                  id='confirmPassword'
                  type='password'
                  name='confirmPassword'
                  placeholder='Confirm Password'
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className='mb-2'
                />
              </div>
            </div>
            {isSaving ? (
              <Button
                className='bg-slate-800 hover:bg-slate-700 py-2 font-semibold text-sm text-white w-full my-2'
                disabled
              >
                <AiOutlineLoading3Quarters className='animate-spin mx-auto text-xl' />
              </Button>
            ) : (
              <Button
                type='submit'
                onClick={handleSubmit}
                className={`bg-slate-800 hover:bg-slate-700 py-2 font-semibold text-sm text-white w-full my-2`}
              >
                Save
              </Button>
            )}
          </form>
        </div>
      </div>
    </Base>
  );
};

export default Settings;
