import express from 'express';
import { Listing } from '../models/listing.model.js';
import { errorHandler } from '../utils/error.js';
export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create({ ...req.body });

    return res.status(201).json({
      success: true,
      message: 'Listing created successfully',
      _id: listing._id, // ✅ Add the _id at the top level for frontend to access easily
      listing,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  try {
const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return next(errorHandler(404, 'Listing not found!'));
    }

    if (req.user.id !== listing.userRef) {
      return next(errorHandler(401, 'You can only delete your own listings!'));
    }

    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Listing has been deleted' });
  } catch (error) {
    next(error);
  }
};


export const updateListing= async (req, res, next) => {

const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return next(errorHandler(404, 'Listing not found!'));
    }

    if (req.user.id !== listing.userRef) {
      return next(errorHandler(401, 'You can only delete your own listings!'));
    }
try {
    const updatedListing=  await Listing.findByIdAndUpdate(
      req.params.id,
    req.body,
      { new: true}
    );
    res.status(200).json(updatedListing);
} catch (error) {
    next(error);
  }
};

export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return next(errorHandler(404, 'Listing not found!'));
    }

    res.status(200).json({ success: true, listing });  
   
  } catch (error) {
    next(error);
  }

};
export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;

    let offer = req.query.offer;
    offer = offer === 'true' ? true : { $in: [false, true] };

    let furnished = req.query.furnished;
    furnished = furnished === 'true' ? true : { $in: [false, true] };

    let parking = req.query.parking;
    parking = parking === 'true' ? true : { $in: [false, true] };

    let type = req.query.type;
    type = type === 'sale' || type === 'rent' ? type : { $in: ['sale', 'rent'] };

    const searchTerm = typeof req.query.searchTerm === 'string' ? req.query.searchTerm : '';

    const sort = req.query.sort || 'createdAt';
    const order = req.query.order || 'desc';

    // Build query object dynamically
    const queryObj = {
      offer,
      furnished,
      parking,
      type,
    };

    if (searchTerm.trim()) {
      queryObj.$or = [
        { name: { $regex: searchTerm, $options: 'i' } },
        // You can also search other fields if needed
        // { description: { $regex: searchTerm, $options: 'i' } },
      ];
    }

    const listings = await Listing.find(queryObj)
      .sort({ [sort]: order === 'asc' ? 1 : -1 })
      .skip(startIndex)
      .limit(limit);

    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};







