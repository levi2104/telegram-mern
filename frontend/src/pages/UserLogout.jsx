import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UserLogout = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const logoutUser = async () => {
      try {
        await axios.post(
          `${import.meta.env.VITE_BASE_URL}/users/logout`,
          {}, // empty body
          { withCredentials: true } // config
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
        navigate("/user-login"); // ✅ navigate here, after logout finishes
      }
    };

    logoutUser();
  }, []);

  if (loading) {
    return <div>Logging out...</div>;
  }

  return null;
};

export default UserLogout;
