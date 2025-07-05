import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import userAuth from './routes/auth.router.js';
import uploadRoutes from './routes/upload.js';
import listingRouter from './routes/listing.route.js';
import cookieParser from 'cookie-parser';
import userRoute from './routes/user.route.js';
dotenv.config();
mongoose.connect(process.env.MONGO)
.then(()=>{
    console.log("Connected to DB");
}).catch((err)=>{
    console.log("ERROR")
})
const app=express();
app.use(express.json());
app.use(cookieParser());

app.listen(3000,()=>{
    console.log('Server is Running on 3000')
});


app.use('/api/user',userRouter);

app.use('/api/auth',userAuth);
app.use('/api/upload', uploadRoutes);
app.use('/api/listing', listingRouter );

app.use('/api/user', userRoute); // 👈 mounts /api/user/:id

app.use((err,req,res,next)=>{
    const statusCode=err.statusCode||500;
    const message=err.message||"Internal Server Error";

    return res.status(statusCode).json({
        success:false
,
        statusCode,
        message,    })
})