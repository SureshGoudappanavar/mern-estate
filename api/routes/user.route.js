import express from 'express';
import { test ,updateUser,getUserListing} from '../controllers/user.controller.js';
import { getUser } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';
import { deleteUser } from '../controllers/user.controller.js';
const router=express.Router();

router.get('/test',test);

router.post('/update/:id',verifyToken,updateUser);

router.get('/listing/:id',verifyToken,getUserListing);
router.delete('/delete/:id',verifyToken,deleteUser);
router.get('/:id', verifyToken,getUser);
export default router;