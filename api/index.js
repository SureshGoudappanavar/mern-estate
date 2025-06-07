import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import userAuth from './routes/auth.router.js';
dotenv.config();
mongoose.connect(process.env.MONGO)
.then(()=>{
    console.log("Connected to DB");
}).catch((err)=>{
    console.log("ERROR")
})
const app=express();
app.use(express.json());

app.listen(3000,()=>{
    console.log('Server is Running on 3000')
});


app.use('/api/user',userRouter);

app.use('/api/auth',userAuth);

app.use((err,req,res,next)=>{
    const statusCode=err.statusCode||500;
    const message=err.message||"Internal Server Error";

    return res.status(statusCode).json({
        success:false
,
statusCode,
message,    })
})