import express from 'express';
import { Listing } from '../models/listing.model.js';

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
