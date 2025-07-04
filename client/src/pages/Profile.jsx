// src/pages/Profile.js

import React, { useRef, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure,
} from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
function Profile() {
  const fileRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser, loading, error } = useSelector((state) => state.user);

  const [file, setFile] = useState(undefined);
  const [imageUrl, setImageUrl] = useState(currentUser.avatar);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [formData, setFormData] = useState({
    username: currentUser.username,
    email: currentUser.email,
    password: '',
    avatar: currentUser.avatar,
  });

  // 🔁 Redirect to sign-in page if user logs out
  useEffect(() => {
    if (!currentUser) {
      navigate('/sign-in');
    }
  }, [currentUser, navigate]);

  // ⬆️ Upload image to Cloudinary when file is selected
  useEffect(() => {
    if (file) {
      const uploadImage = () => {
        const uploadData = new FormData();
        uploadData.append('file', file);
        uploadData.append('upload_preset', 'mern-estate');
        uploadData.append('cloud_name', 'mern-estate');

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
            setFormData((prev) => ({ ...prev, avatar: response.secure_url }));
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
        xhr.send(uploadData);
      };

      uploadImage();
    }
  }, [file]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    if (window.confirm('Are you sure you want to delete your account?')) {
      try {
        dispatch(deleteUserStart());
        const res = await fetch(`/api/user/delete/${currentUser._id}`, {
          method: 'DELETE',
        });
        const data = await res.json();
        if (data.success === false) {
          dispatch(deleteUserFailure(data.message));
          return;
        }
        dispatch(deleteUserSuccess());
      } catch (error) {
        dispatch(deleteUserFailure(error.message));
      }
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signout', {
        method: 'POST',
        credentials: 'include', // 🧠 Important if using cookies
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess());
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };

  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
      <h1 className='text-3xl font-bold text-center my-7'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4 w-full'>
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
        {updateSuccess && (
          <div className='text-green-600 text-sm text-center mt-4'>
            Profile updated successfully
          </div>
        )}

        <input
          type='text'
          placeholder='Username'
          id='username'
          value={formData.username}
          onChange={handleChange}
          className='border border-gray-300 rounded-lg p-3 w-full'
        />
        <input
          type='email'
          placeholder='Email'
          id='email'
          value={formData.email}
          onChange={handleChange}
          className='border border-gray-300 rounded-lg p-3 w-full'
        />
        <input
          type='password'
          placeholder='Password'
          id='password'
          value={formData.password}
          onChange={handleChange}
          className='border border-gray-300 rounded-lg p-3 w-full'
        />

        <button
          disabled={loading}
          className='w-full bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'
        >
          {loading ? 'Updating...' : 'Update'}
        </button>
        <Link to="/create-listing" className='bg-green-700 text-white rounded-lg p-3 text-center uppercase hover:opacity-95'>
  create listing
        </Link>
      </form>

      <div className='flex justify-between mt-5'>
        <span onClick={handleDeleteUser} className='text-red-700 cursor-pointer'>
          Delete Account
        </span>
        <span onClick={handleSignOut} className='text-red-700 cursor-pointer'>
          Sign Out
        </span>
      </div>

      {error && (
        <div className='mt-3 text-red-600 text-sm'>
          {error}
        </div>
      )}
    </div>
  );
}

export default Profile;
