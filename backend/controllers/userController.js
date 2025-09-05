import userModel from "../models/userModel.js";
import { validationResult } from 'express-validator'
import { createUser } from "../services/userService.js";
import blacklistTokenModel from "../models/blacklistTokenModel.js";

export const registerUser = async (req, res) => {
  const errors = validationResult(req)
  if(!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

  const { fullname, email, password } = req.body

  const isUserExist = await userModel.findOne({ email })
  if(isUserExist) return res.status(400).json({ message: 'User already exists' })

  const hashedPassword = await userModel.hashPassword(password)

  const user = await createUser({
    firstname: fullname.firstname, 
    lastname: fullname.lastname, 
    email,
    password: hashedPassword,
  })

  const token = user.generateAuthToken()

  res
    .status(201)
    .cookie("token", token, { sameSite: "none", secure: 'true' })
    .json({ token, user });
}

export const loginUser = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()){
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body

  const user = await userModel.findOne({ email }).select('+password')

  if(!user){
    return res.status(401).json({ error: 'Invalid Email or Password' })
  }

  const isMatch = await user.comparePassword(password)

  if(!isMatch){
    return res.status(401).json({ error: 'Invalid Email or Password' })
  }

  const token = user.generateAuthToken()

  res
    .status(200)
    .cookie("token", token)
    .json({ token, user });
}

export const getUserProfile = async (req, res) => {
  res.status(200).json(req.user)
}

export const logoutUser = async (req, res) => {
  const token = req.cookies.token || req.headers.authorization.split(' ')[1]
  
  await blacklistTokenModel.create({ token })
  
  res.clearCookie('token')

  res.status(200).json({ message: 'Logged Out' })
}