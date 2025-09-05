import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      //decodes token id
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
};

<<<<<<< HEAD
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded._id);
    console.log(user)

    req.user = user

    return next()
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized' })
  }
}

export const authCaptain = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1]
  
  if(!token){
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const isBlacklisted = await blacklistTokenModel.findOne({ token })

  if(isBlacklisted){
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const captain = await captainModel.findById(decoded._id);
    console.log(captain)
    req.captain = captain

    return next()
  } catch (err) {
    return res.status(401).json({ message: err })
  }
}
=======
export default protect;
>>>>>>> d3808cfd740e15b8894f577daed30ffa259a270c
