/* eslint-disable react/prop-types */

import axios from "axios";
import { useContext } from "react";
import { SocketContext } from "../context/SocketContext";

const ConfirmedVehicle = ({
  setConfirmedVehiclePanelOpen,
  setVehiclePanelOpen,
  setLookingForDriverPanelOpen,
  pickup,
  destination,
  selectedVehicle,
}) => {
  const { socket } = useContext(SocketContext);

  const handleClick = async () => {
    const newRide = {
      pickup,
      destination,
      vehicleType: selectedVehicle.type,
    };

    const res = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/rides/create`,
      newRide,
      { withCredentials: true }
    );

    const rideData = res.data

    socket.emit('newRide: ', rideData)

    setLookingForDriverPanelOpen(true);
    setConfirmedVehiclePanelOpen(false);
  };

  return (
    <div className="flex flex-col gap-3">
      <h4
        onClick={() => {
          setConfirmedVehiclePanelOpen(false);
          setVehiclePanelOpen(true);
        }}
        className="text-2xl text-center mt-2"
      >
        <i className="ri-arrow-down-wide-line"></i>
      </h4>

      <h2 className="text-[28px] text-center font-semibold">
        Confirm your Ride
      </h2>

      <div>
        <img
          src={selectedVehicle.img}
          alt={selectedVehicle.type}
          className="w-32 mx-auto"
        />
      </div>

      <hr className="border-2" />

      <div className="p-6">
        <h4 className="text-xl font-semibold mb-1">Pickup Location</h4>
        <p>{pickup}</p>

        <h4 className="text-xl font-semibold mb-1 mt-6">Destination</h4>
        <p>{destination}</p>

        <div className="flex justify-between items-center text-2xl font-semibold mb-1 mt-12">
          <h4>Total Amount</h4>
          <h4>{selectedVehicle.price}</h4>
        </div>

        <button
          onClick={() => {  
            handleClick();
          }}
          className="inline-block text-center bg-green-500 text-white w-full py-2 text-[22px] rounded-[6px] mt-6"
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default ConfirmedVehicle;