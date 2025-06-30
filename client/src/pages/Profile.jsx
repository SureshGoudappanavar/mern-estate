import React, { useRef, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

function Profile() {
  const fileRef = useRef(null);
  const { currentUser } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [imageUrl, setImageUrl] = useState(currentUser.avatar);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (file) {
      const uploadImage = () => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'mern-estate');
        formData.append('cloud_name', 'mern-estate');

        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://api.cloudinary.com/v1_1/mern-estate/image/upload');

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentComplete = Math.round((event.loaded / event.total) * 100);
            setProgress(percentComplete);
          }
        };

        xhr.onload = () => {
          if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            setImageUrl(response.secure_url);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
          } else {
            console.error('Upload failed', xhr.responseText);
          }
          setUploading(false);
        };

        xhr.onerror = () => {
          console.error('Upload error');
          setUploading(false);
        };

        setUploading(true);
        setSuccess(false);
        xhr.send(formData);
      };

      uploadImage();
    }
  }, [file]);

  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
      <h1 className='text-3xl font-bold text-center my-7'>Profile</h1>
      <form className='flex flex-col gap-4 w-full'>
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type='file'
          ref={fileRef}
          accept='image/*'
          hidden
        />

        <div className='flex justify-center'>
          <img
            src={imageUrl}
            onClick={() => fileRef.current.click()}
            alt='profile'
            className='rounded-full h-24 w-24 object-cover cursor-pointer mt-2'
          />
        </div>

        {uploading && (
          <div className='w-full'>
            <div className='text-sm mb-1 text-gray-700'>Uploading: {progress}%</div>
            <div className='w-full bg-gray-300 rounded-full h-2.5 mb-2'>
              <div
                className='bg-blue-600 h-2.5 rounded-full transition-all duration-200'
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {success && (
          <div className='w-full text-green-600 text-sm text-center border border-green-500 rounded p-2'>
            ✅ Uploaded successfully!
          </div>
        )}

        <input
          type='text'
          placeholder='Username'
          id='username'
          className='border border-gray-300 rounded-lg p-3 w-full'
        />
        <input
          type='email'
          placeholder='Email'
          id='email'
          className='border border-gray-300 rounded-lg p-3 w-full'
        />
        <input
          type='password'
          placeholder='Password'
          id='password'
          className='border border-gray-300 rounded-lg p-3 w-full'
        />

        <button className='w-full bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'>
          Update
        </button>
      </form>

      <div className='flex justify-between mt-5'>
        <span className='text-red-700 cursor-pointer'>Delete Account</span>
        <span className='text-red-700 cursor-pointer'>Sign Out</span>
      </div>
    </div>
  );
}

export default Profile;
