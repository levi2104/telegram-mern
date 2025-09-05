import mongoose from 'mongoose'

const rideSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  captain: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "captain",
  },
  pickup: {
    type: String,
    required: true,
  },
  destination: {
    type: String,
    required: true,
  },
  otp: {
    type: Number
  },
  vehicleType: {
    type: String,
    required: true,
    enum: ["car", "motorcycle", "auto"],
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "ongoing", "completed", "cancelled"],
    default: "pending",
  },
  signature: {
    type: String,
  },
});

export default mongoose.model('ride', rideSchema)