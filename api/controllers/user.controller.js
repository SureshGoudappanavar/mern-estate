// import express from 'express';
// import bcrypt from 'bcryptjs';
// import User from '../models/user.model.js';
// import { errorHandler } from '../utils/error.js';
// import { Listing } from '../models/listing.model.js';
// export const test = (req, res) => {
//   res.json({
//     message: 'Hello World!',
//   });
// };

// export const updateUser = async (req, res, next) => {
//   if (req.user._id !== req.params._id) {
//     return next(errorHandler(401, 'You can only update your own account'));
//   }

//   try {
//     if (req.body.password) {
//       req.body.password = bcrypt.hashSync(req.body.password, 10);
//     }

//     const updatedUser = await User.findByIdAndUpdate(
//       req.params.id,
//       {
//         $set: {
//           username: req.body.username,
//           email: req.body.email,
//           password: req.body.password,
//           avatar: req.body.avatar,
//         },
//       },
//       { new: true }
//     );

//     const { password, ...rest } = updatedUser._doc;
//     res.status(200).json(rest);
//   } catch (err) {
//     next(err); // ✅ properly defined and passed now
//   }
// };
// export const deleteUser = async (req, res, next) => {
//   if (req.user._id !== req.params._id) {
//     return next(errorHandler(401, 'You can only delete your own account'));
//   }

//   try {
//     await User.findByIdAndDelete(req.params.id);

//     // Optionally, you can also delete the user's posts or other related data here
//     // await Post.deleteMany({ userId: req.params.id });  
//     // If you have a Post model and want to delete posts by this user, uncomment the above line 
//     res.clearCookie('access_token');
//     res.status(200).json('User has been deleted');
//   } catch (err) {
//     next(err); // ✅ properly defined and passed now
//   }
// };

// export const getUserListing = async (req, res, next) => {
//  if(req.user._id !== req.params.id) {
//      try {
//       const listings = await Listing.find({ userRef: req.params.id });
//      res.status(200).json({
//         success: true,  
//         message: 'User listings fetched successfully',
//         listings,
//       });
//      } catch (error) {
//       next(errorHandler(500, 'Internal Server Error'));
//      }
//   } 
//  else{
//      return next(errorHandler(401, 'You can only access your own listings'));
//   }
//  };

import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';
import { Listing } from '../models/listing.model.js';

// Test API
export const test = (req, res) => {
  res.json({ message: 'Hello World!' });
};

// Update User
export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, 'You can only update your own account'));
  }

  try {
    if (req.body.password) {
      req.body.password = bcrypt.hashSync(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );

    const { password, ...rest } = updatedUser._doc;
    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      ...rest,
    });
  } catch (err) {
    next(err);
  }
};

// Delete User
export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, 'You can only delete your own account'));
  }

  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie('access_token');
    res.status(200).json({
      success: true,
      message: 'User has been deleted',
    });
  } catch (err) {
    next(err);
  }
};

// Get User Listings
export const getUserListing = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, 'You can only access your own listings'));
  }

  try {
    const listings = await Listing.find({ userRef: req.params.id });
    res.status(200).json({
      success: true,
      message: 'User listings fetched successfully',
      listings,
    });
  } catch (error) {
    next(errorHandler(500, 'Internal Server Error'));
  }
};


export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

