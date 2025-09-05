/* eslint-disable react/prop-types */
const LookingForDriver = ({ setLookingForDriverPanelOpen, setConfirmedVehiclePanelOpen, selectedVehicle, pickup, destination }) => {
  return (
    <div className="flex flex-col gap-3">
      <h4
        onClick={() => {
          setLookingForDriverPanelOpen(false);
          setConfirmedVehiclePanelOpen(true);
        }}
        className="text-2xl text-center mt-2"
      >
        <i className="ri-arrow-down-wide-line"></i>
      </h4>

      <h2 className="text-[28px] text-center font-semibold">
        Looking for nearby drivers...
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
      </div>
    </div>
  );
};

export default LookingForDriver