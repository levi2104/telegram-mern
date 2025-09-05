import { createRideService } from "../services/rideService.js";
import { validationResult } from 'express-validator'

export const createRide = async (req, res) => {
  const errors = validationResult(req)
  if(!errors.isEmpty()){ 
    return res.status(400).json({ errors: errors.array() })
  }

  const { pickup, destination, vehicleType } = req.body
  
  try {
    const ride = await createRideService({ userId: req.user._id, pickup, destination, vehicleType })
    console.log(ride)
    return res.status(201).json(ride)
  } catch (err) {
    return res.status(500).json({ message: err })
  }
}