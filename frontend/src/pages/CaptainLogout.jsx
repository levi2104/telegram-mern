import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CaptainLogout = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const logoutCaptain = async () => {
      try {
        await axios.post(
          `${import.meta.env.VITE_BASE_URL}/captains/logout`,
          {}, // empty body
          { withCredentials: true } // config
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
        navigate("/captain-login"); // ✅ navigate here, after logout finishes
      }
    };

    logoutCaptain();
  }, []);

  if (loading) {
    return <div>Logging out...</div>;
  }

  return null;
};

export default CaptainLogout;
