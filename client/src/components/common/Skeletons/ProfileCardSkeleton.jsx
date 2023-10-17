const ProfileCardSkeleton = () => {
  return (
    <div className='w-full sm:sticky sm:top-16 top-auto flex flex-col bg-white rounded-lg border border-slate-300'>
      <div className='w-full h-32 bg-cover bg-center'>
        <div className='w-full h-full hover:cursor-pointer object-cover rounded-lg bg-gray-300'></div>
      </div>
      <div className='relative'>
        <div className='absolute -top-10 left-1/2 transform -translate-x-1/2 w-24 h-24 rounded-full overflow-hidden border-4 border-white'>
          <div className='w-full hover:cursor-pointer h-full object-cover bg-gray-300'></div>
        </div>
      </div>
      <div className='text-center my-4 mx-14'>
        <h1 className='text-lg font-semibold mt-10'>Loading...</h1>
        <div className='flex justify-center mt-2 text-sm'>
          <div className='flex justify-around w-full mt-3 sm:mt-2'>
            <div className='flex flex-col'>
              <p className='font-bold text-base'>0</p>
              <p className='text-sm text-gray-600 font-semibold'>Posts</p>
            </div>
            <div className='flex flex-col hover:cursor-pointer'>
              <p className='font-bold text-base'>0</p>
              <p className='text-sm text-gray-600 font-semibold'>Followers</p>
            </div>
            <div className='flex flex-col hover:cursor-pointer'>
              <p className='font-bold text-base'>0</p>
              <p className='text-sm text-gray-600 font-semibold'>Following</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCardSkeleton;
