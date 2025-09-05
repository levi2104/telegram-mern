import express from 'express'
const router = express.Router()
import { body } from 'express-validator'
import { createRide } from '../controllers/rideController.js'
import { authUser } from '../middlewares/authMiddleware.js'


router.post('/create', authUser, [
  body('pickup').isString().isLength({ min: 3 }).withMessage('Invalid pickup address'),
  body('destination').isString().isLength({ min: 3 }).withMessage('Invalid destination address'),
  body('vehicleType').isString().isIn(['auto', 'car', 'motorcycle']).withMessage('Invalid vehicle type')
], createRide)

export default router