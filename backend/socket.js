import { Server } from 'socket.io'
import userModel from './models/userModel.js';
import captainModel from './models/captainModel.js';

let io

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173", // frontend URL
      credentials: true, // allow cookies
    },
  });

  io.on('connection', (socket) => {
    console.log('Client connected', socket.id);

    socket.on('join', async (data) => {
      const { userId, userType } = data

      if(userType === 'user'){
        await userModel.findByIdAndUpdate(userId, { socketId: socket.id })
      }
      else if(userType === 'captain'){
        await captainModel.findByIdAndUpdate(userId, { socketId: socket.id })
      }
    })

    socket.on("newRide", (rideData) => {
      console.log("New Ride Request:", rideData);

      // Broadcast ride details to all captains
      io.emit("rideRequest", rideData);
    });

    socket.on('disconnect', () => {
      console.log("Client disconnected", socket.id);
    })
  })
}

export const sendMessageToSocketId = (socketId, messageObject) => {
  if(io){
    io.to(socketId).emit(messageObject.event, messageObject.data)
  }
  else{
    console.log('Socket IO not initialized');
  }
}