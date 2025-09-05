import { useContext, useEffect, useState } from "react";
import { CaptainDataContext } from "../context/CaptainContext";
import axios from "axios";

const CaptainHomeDetails = () => {
  const { captain, setCaptain } = useContext(CaptainDataContext);
  const [loading, setLoading] = useState(true); // ✅ new loading state

  useEffect(() => {
    const fetchCaptain = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/captains/profile`,
          { withCredentials: true }
        );
        setCaptain(res.data.captain); // ✅ update context
      } catch (err) {
        console.error(err);
        // maybe redirect to login if token expired
      } finally {
        setLoading(false); // ✅ stop loading regardless of success/fail
      }
    };

    fetchCaptain();
  }, []);

  // ✅ Guard UI when loading or no captain
  if (loading) {
    return <p className="text-center mt-10">Loading profile...</p>;
  }

  if (!captain) {
    return (
      <p className="text-center mt-10 text-red-500">
        Failed to load captain profile.
      </p>
    );
  }

  return (
    <>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <img
            className="w-12"
            src="data:image/png;base64,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"
            alt="driver-avatar"
          />
          <h4 className="text-2xl font-semibold capitalize">{captain.fullname.firstname} {captain.fullname.lastname}</h4>
        </div>

        <div className="flex flex-col items-center">
          <h4 className="text-2xl bold-fonts">₹ 295.20</h4>
          <p className="text-gray-600">Total Earnings</p>
        </div>
      </div>

      <div className="bg-black flex justify-evenly items-center h-[60%] mt-8 rounded-xl">
        <div className=" text-white flex flex-col items-center justify-evenly">
          <h2 className="text-2xl">10.2</h2>
          <i className="ri-time-line text-5xl"></i>
          <h3>Hours Online</h3>
        </div>
        <div className=" text-white flex flex-col items-center justify-evenly">
          <h2 className="text-2xl">108.7</h2>
          <i className="ri-speed-up-fill text-5xl"></i>
          <h3>KM Covered</h3>
        </div>
        <div className=" text-white flex flex-col items-center justify-evenly">
          <h2 className="text-2xl">101.39</h2>
          <i className="ri-money-rupee-circle-line text-5xl"></i>
          <h3>Rupees Earned</h3>
        </div>
      </div>
    </>
  );
}

export default CaptainHomeDetails