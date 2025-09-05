/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
// pages/UserHome.jsx
import { useContext, useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import VehiclePanel from "../components/VehiclePanel";
import ConfirmedVehicle from "../components/ConfirmedVehicle";
import LookingForDriver from "../components/LookingForDriver";
import WaitingForDriver from "../components/WaitingForDriver";
import LeafletMap from "../components/LeafletMap";
import { MdNavigation } from "react-icons/md";
import { FaCar } from "react-icons/fa";
import { Link } from "react-router-dom";
import { SocketContext } from "../context/SocketContext";
import { UserDataContext } from "../context/UserContext";

const UserHome = () => {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState({})

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // panels + refs
  const [panel30Open, setPanel30Open] = useState(false);
  const [panel70Open, setPanel70Open] = useState(false);
  const panel30Ref = useRef(null);
  const panel70Ref = useRef(null);

  const [vehiclePanelOpen, setVehiclePanelOpen] = useState(false);
  const vehiclePanelRef = useRef(null);
  const [confirmedVehiclePanelOpen, setConfirmedVehiclePanelOpen] = useState(false);
  const confirmedVehiclePanelRef = useRef(null);
  const [lookingForDriverPanelOpen, setLookingForDriverPanelOpen] = useState(false);
  const lookingForDriverPanelRef = useRef(null);
  const [waitingForDriverPanelOpen, setWaitingForDriverPanelOpen] = useState(false);
  const waitingForDriverPanelRef = useRef(null);

  const { socket } = useContext(SocketContext)
  const { user } = useContext(UserDataContext)

  useEffect(() => {
    console.log(user);
    // console.log(socket);
    socket.emit('join', { userType: 'user', userId: user._id })
  }, [user])


  // --- GSAP animations ---
  useGSAP(() => {
    if (panel30Open) gsap.to(panel30Ref.current, { top: "0%" });
    else gsap.to(panel30Ref.current, { top: "70%" });
  }, [panel30Open]);

  useGSAP(() => {
    if (panel70Open) gsap.to(panel70Ref.current, { height: "70%" });
    else gsap.to(panel70Ref.current, { height: "0%" });
  }, [panel70Open]);

  useGSAP(() => {
    if (vehiclePanelOpen) gsap.to(vehiclePanelRef.current, { y: "0%" });
    else gsap.to(vehiclePanelRef.current, { y: "100%" });
  }, [vehiclePanelOpen]);

  useGSAP(() => {
    if (confirmedVehiclePanelOpen)
      gsap.to(confirmedVehiclePanelRef.current, { y: "0%" });
    else gsap.to(confirmedVehiclePanelRef.current, { y: "100%" });
  }, [confirmedVehiclePanelOpen]);

  useGSAP(() => {
    if (lookingForDriverPanelOpen)
      gsap.to(lookingForDriverPanelRef.current, { y: "0%" });
    else gsap.to(lookingForDriverPanelRef.current, { y: "100%" });
  }, [lookingForDriverPanelOpen]);

  useGSAP(() => {
    if (waitingForDriverPanelOpen)
      gsap.to(waitingForDriverPanelRef.current, { y: "0%" });
    else gsap.to(waitingForDriverPanelRef.current, { y: "100%" });
  }, [waitingForDriverPanelOpen]);

  // --- Validation helpers ---
  const trim = (s) => (typeof s === "string" ? s.trim() : "");
  const pickupFilled = trim(pickup).length > 0;
  const destinationFilled = trim(destination).length > 0;
  const samePlace =
    pickupFilled &&
    destinationFilled &&
    trim(pickup).toLowerCase() === trim(destination).toLowerCase();
  const canSubmit =
    pickupFilled && destinationFilled && !samePlace && !submitting;

  // --- Submit to backend ---
  // const handleFindDrivers = async () => {
  //   if (!canSubmit) return;
  //   setSubmitting(true);
  //   setErrorMsg("");

  //   // Replace this with your real auth/user state
  //   const user = {
  //     id: "123", // e.g., from JWT/Context
  //     name: "Aryan Tanna",
  //     email: "aryantanna2104@gmail.com",
  //   };

  //   try {
  //     const res = await axios.post(`${API_BASE}/api/find-drivers`, {
  //       pickup: trim(pickup),
  //       destination: trim(destination),
  //       user,
  //     });

  //     console.log("Backend response:", res.data);

  //     // Example UX: open the vehicle panel next
  //     setVehiclePanelOpen(true);
  //     setPanel30Open(false);
  //     setPanel70Open(false);
  //   } catch (err) {
  //     console.error(err);
  //     setErrorMsg(
  //       err?.response?.data?.message ||
  //         err?.message ||
  //         "Something went wrong while requesting drivers."
  //     );
  //   } finally {
  //     setSubmitting(false);
  //   }
  // };

  // --- Open Google Maps with prefilled origin/destination ---
  const handleOpenMaps = () => {
    if (!pickupFilled || !destinationFilled || samePlace) return;

    const origin = trim(pickup);
    const dest = trim(destination);
    const base = "https://www.google.com/maps/dir/?api=1";
    const url = `${base}&origin=${encodeURIComponent(
      origin
    )}&destination=${encodeURIComponent(dest)}&travelmode=driving`;

    // open in a new tab safely
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div>
      <div className="h-screen relative w-full overflow-hidden">
        <div className="w-full">
          <img className="fixed left-4 top-4 w-16 z-10" src="/uber-logo.png" />
          <Link
            to="/user-logout"
            className="fixed right-2 top-2 h-12 w-12 bg-white flex justify-center items-center rounded-full z-10"
          >
            <i className="text-2xl font-semibold ri-logout-box-r-line"></i>
          </Link>
        </div>

        <div className="h-screen w-screen relative">
          {/* Real map (kept for UI; no extra logic attached) */}
          <LeafletMap />
        </div>

        {/* Panel 30% */}
        <div
          ref={panel30Ref}
          className="absolute bottom-0 h-[30%] bg-white p-5 w-full z-20"
        >
          <h2
            className="absolute top-6 right-6 text-2xl cursor-pointer"
            onClick={() => {
              setPanel30Open((prev) => !prev);
              setPanel70Open((prev) => !prev);
            }}
          >
            {panel70Open ? (
              <i className="ri-arrow-down-wide-line"></i>
            ) : (
              <i className="ri-arrow-up-wide-line"></i>
            )}
          </h2>
          <h2 className="absolute top-6 left-6 text-3xl font-bold">
            Find a trip
          </h2>

          <form onSubmit={(e) => e.preventDefault()} className="mt-10 relative">
            <div className="z-10 line absolute w-2 rounded-full h-2 bottom-[75px] bg-black left-[20px]"></div>
            <div className="z-10 line absolute w-1 h-[44px] bg-black bottom-[29px] left-[22px] rounded-full"></div>
            <div className="z-10 line absolute w-2 rounded-sm h-2 bottom-[18px] bg-black left-[20px]"></div>

            {/* Pickup - replaced AutocompleteInput with plain input (same classes) */}
            <input
              value={pickup}
              onChange={(e) => {
                setPickup(e.target.value);
                setErrorMsg("");
              }}
              placeholder="Add a pickup location"
              onFocus={() => {
                setPanel30Open(true);
                setPanel70Open(true);
              }}
              className="bg-[#eee] px-10 py-2 text-lg rounded-lg w-full mt-5 outline-none"
            />

            {/* Destination - replaced AutocompleteInput with plain input (same classes) */}
            <input
              value={destination}
              onChange={(e) => {
                setDestination(e.target.value);
                setErrorMsg("");
              }}
              placeholder="Enter destination"
              onFocus={() => {
                setPanel30Open(true);
                setPanel70Open(true);
              }}
              className="bg-[#eee] px-10 py-2 text-lg rounded-lg w-full mt-3 outline-none"
            />

            {/* Simple validation message */}
            {samePlace && (
              <div className="absolute text-sm text-red-600">
                Pickup and destination cannot be the same.
              </div>
            )}
          </form>
        </div>

        {/* Panel 70% */}
        <div
          ref={panel70Ref}
          className="absolute bottom-0 h-[70%] bg-white w-full flex justify-center items-center"
        >
          {/* Error bubble */}
          {errorMsg && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm shadow">
              {errorMsg}
            </div>
          )}

          {panel70Open && (
            <div className="fixed bottom-5 flex gap-3">
              {/* Open Maps button - opens Google Maps with origin/destination */}
              <button
                className={`text-[18px] border flex justify-center items-center px-4 py-2 rounded-full gap-3 ${
                  canSubmit
                    ? "bg-cyan-300"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
                onClick={handleOpenMaps}
                disabled={!canSubmit}
                type="button"
                title={
                  !pickupFilled || !destinationFilled
                    ? "Enter both pickup & destination"
                    : samePlace
                    ? "Pickup and destination must be different"
                    : "Open Maps"
                }
              >
                <MdNavigation size={20} />
                Open Maps
              </button>

              {/* Find Drivers button - calls handleFindDrivers, green when active */}
              <button
                className={`text-[18px] border flex justify-center items-center px-4 py-2 rounded-full gap-3 ${
                  canSubmit
                    ? "bg-green-500"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
                onClick={() => setVehiclePanelOpen(true)}
                disabled={!canSubmit}
                type="button"
                title={
                  !pickupFilled || !destinationFilled
                    ? "Enter both pickup & destination"
                    : samePlace
                    ? "Pickup and destination must be different"
                    : "Select Vehicle"
                }
              >
                <FaCar size={20} />
                {submitting ? "Sending..." : "Select Vehicle"}
              </button>
            </div>
          )}
        </div>

        {/* Other Panels (kept; no changes) */}
        <div
          ref={vehiclePanelRef}
          className="absolute bottom-0 bg-white p-3 translate-y-full"
        >
          <VehiclePanel
            setVehiclePanelOpen={setVehiclePanelOpen}
            setPanel30Open={setPanel30Open}
            setPanel70Open={setPanel70Open}
            setConfirmedVehiclePanelOpen={setConfirmedVehiclePanelOpen}
            setSelectedVehicle={setSelectedVehicle}
          />
        </div>

        <div
          ref={confirmedVehiclePanelRef}
          className="absolute z-30 bottom-0 bg-white translate-y-full w-full"
        >
          <ConfirmedVehicle
            setConfirmedVehiclePanelOpen={setConfirmedVehiclePanelOpen}
            setVehiclePanelOpen={setVehiclePanelOpen}
            setLookingForDriverPanelOpen={setLookingForDriverPanelOpen}
            pickup={pickup}
            destination={destination}
            selectedVehicle={selectedVehicle}
          />
        </div>

        <div
          ref={lookingForDriverPanelRef}
          className="absolute z-10 bottom-0 bg-white translate-y-full w-full"
        >
          <LookingForDriver
            setLookingForDriverPanelOpen={setLookingForDriverPanelOpen}
            setConfirmedVehiclePanelOpen={setConfirmedVehiclePanelOpen}
            pickup={pickup}
            destination={destination}
            selectedVehicle={selectedVehicle}
          />
        </div>

        <div
          ref={waitingForDriverPanelRef}
          className="absolute z-10 bottom-0 bg-white w-full translate-y-full"
        >
          <WaitingForDriver
            setWaitingForDriverPanelOpen={setWaitingForDriverPanelOpen}
          />
        </div>
      </div>
    </div>
  );
};

export default UserHome;