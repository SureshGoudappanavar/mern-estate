import React from 'react'
import { useSelector } from 'react-redux'
function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <div className='max-w-lg mx-auto p-3'>
      <h1 className='text-3xl font-bold text-center my-7'>
   Profile
      </h1>
    <form className='flex flex-col items-center gap-4'>
      <img src={currentUser.avatar} alt='profile'
      className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'/>
        <input type='text' placeholder='username' id='username'
        className='border border-gray-300 rounded-lg p-3 w-64'/>
        <input type='email' placeholder='email' id='email'
        className='border border-gray-300 rounded-lg p-3 w-64'/>
        <input type='password' placeholder='password' id='password'
        className='border border-gray-300 rounded-lg p-3 w-64'/>

        <button className='bg-slate-700 text-white rounded-lg
       p-3 uppercase hover:opacity-95 disabled:opacity-80 '>update</button>


    </form>
    <div className='flex justify-between mt-5'>
      <span className='text-red-700 cursor-pointer'>Delete Account</span>
      <span className='text-red-700 cursor-pointer'>Sign Out</span>
    </div>
    </div>
  )
}

export default Profile