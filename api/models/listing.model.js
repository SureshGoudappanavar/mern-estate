import mongoose from "mongoose";

const listingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  
  description: {
    type: String,
    required: true,
  },

  address: {
    type: String,
    required: true,
  },

  regularPrice: {
    type: Number,
    required: true,
  },

discountPrice: {
  type: Number,
  default: 0,
},



  bathrooms: {
    type: Number,
    required: true,
  },

  bedrooms: {
    type: Number,
    required: true,
  },

  furnished: {
    type: Boolean,
    default: false,
  },

  parking: {
    type: Boolean,
    default: false,
  },

  type: {
    type: String,
    required: true,
  },

  offer: {
    type: Boolean,
    required: true,
    default: false,
  },

  imageUrls: {
    type: Array,
    required: true,
  },

  userRef: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

const Listing = mongoose.model('Listing', listingSchema);

export { Listing };
