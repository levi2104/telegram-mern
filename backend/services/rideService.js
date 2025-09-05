import rideModel from "../models/rideModel.js";
import crypto from 'crypto'

function getOtp(num){
  const otp = crypto.randomInt(Math.pow(10, num - 1), Math.pow(10, num)).toString()
  return otp
}

export const createRideService = async ({ userId, pickup, destination, vehicleType }) => {
  if(!userId || !pickup || !destination || !vehicleType){
    throw new Error('All fields are required')
  }

  const ride = rideModel.create({
    userId, 
    pickup,
    destination,
    otp: getOtp(4),
    vehicleType
  })

  return ride
}