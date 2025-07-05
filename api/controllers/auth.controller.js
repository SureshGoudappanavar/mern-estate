import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt  from "jsonwebtoken";





export const signup=async(req,res,next)=>{
 const {username,email,password}=req.body;
 const hashPassword=bcrypt.hashSync(password,10);
 const newUser=new User({username,email,password:hashPassword});

try {
    await newUser.save();
    
    res.status(201).json("User created successfully");
} catch (error) {
//    next(errorHandler(550,'error from the Function'));
next(error);

}
}

// export const signin=async(req,res,next)=>{
// const {email,password}=req.body;

// try {
//     const validUser=await User.findOne({email});
//     if(!validUser){
//         return next(errorHandler(404,'User not Found!'));
//     }
//       const validPassword=bcrypt.compareSync(password,validUser.password);
//         if(!validPassword){
//             return next(errorHandler(401,'Wrong Credential!'))
//         }
//         const token=jwt.sign({id:validUser._id},process.env.JWT_SECRET);

//     const {password:pass, ...rest}=validUser._doc;//avoid the password in the insomnia


//      res.cookie('access_token',token,{httpOnly:true})
//     .status(200)
//     .json(rest);
// } catch (error) {
//     next(error);
// }
// };
export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, 'User not Found!'));
    }

    const validPassword = bcrypt.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(401, 'Wrong Credential!'));
    }

    // ✅ Include user id in token
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    const { password: pass, ...rest } = validUser._doc;

    // ✅ Wrap response in success:true
    res.cookie('access_token', token, { httpOnly: true })
      .status(200)
      .json({
        success: true,
        message: 'User signed in successfully',
        ...rest, // contains _id, username, email, avatar
      });
  } catch (error) {
    next(error);
  }
};


export const google = async (req, res, next) => {
try {
const user = await User.findOne({ email: req.body.email })
if (user){
const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
const { password: pass, ...rest } = user._doc;
res
     .cookie('access_token', token, { httpOnly: true })
     .status(200)
     .json(rest);
   }   else {
       const generatePassword=Math.random().toString(36).slice(-8) +Math.random().toString(36).slice(-8);
        const hashedPassword=bcrypt.hashSync(generatePassword,10);
        const newUser = new User({ username: req.body.name.split(" ").join("").toLowerCase() + Math.random().
        toString(36).slice(-4), email: req.body.email, password: hashedPassword, avatar: req.body.photo });
       await newUser.save();
         const token = jwt.sign({ id: newUser._id}, process.env.JWT_SECRET);
         const { password: pass, ...rest} = newUser._doc;
         res.cookie('access_token', token, { httpOnly: true }).status (200).json(rest);


   } 
}catch (error) {
next (error)
}
}


export const signOut = (req, res) => {
  res.clearCookie('access_token'); // optional, if you're using cookies
  res.status(200).json({ success: true, message: 'User signed out successfully' });
};

