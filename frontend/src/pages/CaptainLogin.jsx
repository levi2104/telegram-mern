import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CaptainDataContext } from "../context/CaptainContext";
import axios from "axios";

const CaptainLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const { setCaptain } = useContext(CaptainDataContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newCaptain = { email, password };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/captains/login`,
        newCaptain,
        { withCredentials: true }
      );

      setCaptain(response.data.captain);
      navigate("/captain-home");
    } catch (err) {
      console.error({ message: err });
    }

    setEmail("");
    setPassword("");
  };

  return (
    <div className="flex flex-col justify-between h-screen p-7">
      <div>
        <img
          className="w-16 mb-8"
          src="https://www.svgrepo.com/show/505031/uber-driver.svg"
          alt="uber-logo.png"
        />

        <form onSubmit={handleSubmit} className="">
          <h3 className="text-xl mb-2 font-semibold">
            What&apos;s our Captain&apos;s email?
          </h3>

          <input
            className="bg-[#eeeeee] rounded px-4 py-2 border w-full text-lg placeholder:text-base outline-none mb-7"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="email@example.com"
          />

          <h3 className="text-xl mb-2 font-semibold">Enter Password</h3>

          <input
            className="bg-[#eeeeee] rounded px-4 py-2 border w-full text-lg placeholder:text-base outline-none mb-7"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="12345678"
          />

          <button className="bg-black text-white rounded px-4 py-2 w-full text-lg placeholder:text-base outline-none mb-2">
            Login
          </button>
        </form>

        <p className="text-center">
          Join a fleet?{" "}
          <Link to="/captain-signup" className="text-blue-600 hover:underline">
            Register as a Captain
          </Link>
        </p>
      </div>

      <div className="">
        <Link
          to="/user-login"
          className="bg-orange-500 flex items-center justify-center text-white rounded px-4 py-2 w-full text-lg placeholder:text-base outline-none"
        >
          Sign in as User
        </Link>
      </div>
    </div>
  );
};

export default CaptainLogin;

// continue at 2 33 54