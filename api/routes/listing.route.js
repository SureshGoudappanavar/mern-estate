import express from 'express';
import { createListing,deleteListing,updateListing ,getListing,getListings} from '../controllers/listing.controller.js';
import { getUser } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';
 const router=express.Router();
 
router.post('/create', verifyToken,createListing);
router.delete('/delete/:id', verifyToken,deleteListing);
router.post('/update/:id', verifyToken,updateListing);
router.get('/get/:id',getListing);
router.get('/get', getListings); // Assuming you want to fetch all listings
export default router;