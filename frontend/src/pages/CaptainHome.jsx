/* eslint-disable react-hooks/exhaustive-deps */
import { Link } from "react-router-dom";
import CaptainHomeDetails from "./CaptainHomeDetails";
import RidePopup from "../components/RidePopup";
import { useContext, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ConfirmRidePopup from "../components/ConfirmRidePopup";
import LeafletMap from "../components/LeafletMap";
import { CaptainDataContext } from "../context/CaptainContext";
import { SocketContext } from "../context/SocketContext";

const CaptainHome = () => {
  const [ridePopupPanelOpen, setRidePopupPanelOpen] = useState(true)
  const ridePopupPanelRef = useRef(null)
  const [confirmRidePopupPanelOpen, setConfirmRidePopupPanelOpen] = useState(false)
  const confirmRidePopupPanelRef = useRef(null)
  const [rideRequest, setRideRequest] = useState(null)

  const { socket } = useContext(SocketContext)
  const { captain } = useContext(CaptainDataContext)

  useEffect(() => {
    console.log(socket);
    console.log(captain);
    socket.emit("join", { userId: captain._id, userType: "captain" });

    // Listen for ride requests
    socket.on("rideRequest", (rideDetails) => {
      setRideRequest(rideDetails);
    });

    return () => {
      socket.off("rideRequest");
    };
  }, [ captain ])

  useGSAP(() => {
    if (ridePopupPanelOpen) {
      gsap.to(ridePopupPanelRef.current, {
        y: "0%",
      });
    } else {
      gsap.to(ridePopupPanelRef.current, {
        y: "100%",
      });
    }
  }, [ridePopupPanelOpen]);

  useGSAP(() => {
    if (confirmRidePopupPanelOpen) {
      gsap.to(confirmRidePopupPanelRef.current, {
        y: "0%",
      });
    } else {
      gsap.to(confirmRidePopupPanelRef.current, {
        y: "100%",
      });
    }
  }, [confirmRidePopupPanelOpen]);

  return (
    <div className="h-screen overflow-hidden">
      <div className="h-1/2">
        <div className="w-full">
          <img className="fixed left-4 top-4 w-16 z-10" src="/uber-logo.png" />
          <Link
            to="/captain-logout"
            className="fixed right-2 top-2 h-12 w-12 bg-white flex justify-center items-center rounded-full z-10"
          >
            <i className="text-2xl font-semibold ri-logout-box-r-line"></i>
          </Link>
        </div>
        <div className="h-full relative">
          {/* Real map (kept for UI; no extra logic attached) */}
          <LeafletMap />
        </div>
      </div>

      <div className="h-1/2 p-4">
        <CaptainHomeDetails />
      </div>
      
      <div
        ref={ridePopupPanelRef}
        className="fixed z-20 bottom-0 bg-white p-3 overflow-hidden max-h-screen"
      >
        <RidePopup
          setRidePopupPanelOpen={setRidePopupPanelOpen}
          setConfirmRidePopupPanelOpen={setConfirmRidePopupPanelOpen}
          rideRequest={rideRequest}
        />
      </div>

      <div
        ref={confirmRidePopupPanelRef}
        className="fixed w-full z-10 bottom-0 bg-white p-3 overflow-hidden"
      >
        <ConfirmRidePopup
          setConfirmRidePopupPanelOpen={setConfirmRidePopupPanelOpen}
        />
      </div>
    </div>
  );
};

export default CaptainHome;