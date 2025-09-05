import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CaptainDataContext } from "../context/CaptainContext";
import axios from "axios";

const CaptainSignup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [color, setColor] = useState('')
  const [plate, setPlate] = useState('')
  const [capacity, setCapacity] = useState('')
  const [vehicleType, setVehicleType] = useState('')

  const navigate = useNavigate();

  const { setCaptain } = useContext(CaptainDataContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newCaptain = {
      fullname: {
        firstname,
        lastname,
      },
      email,
      password,
      vehicle: {
        color,
        plate,
        capacity,
        vehicleType
      }
    };

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/captains/register`,
        newCaptain,
        { withCredentials: true }
      );

      console.log(res.data);
      setCaptain(res.data.captain);
      navigate("/captain-home");
    } catch (err) {
      console.error({ message: err });
    }

    setEmail("");
    setPassword("");  
    setFirstName("");
    setLastName("");
  };

  return (
    <div className="flex flex-col justify-between min-h-screen p-7">
      <div>
        <img
          className="w-16 mb-8"
          src="https://www.svgrepo.com/show/505031/uber-driver.svg"
          alt="uber-logo.png"
        />

        <form onSubmit={handleSubmit} className="">
          <h3 className="text-xl mb-2 font-semibold">
            What&apos;s our Captain&apos;s name?
          </h3>

          <div className="flex gap-4 mb-7">
            <input
              className="bg-[#eeeeee] rounded px-4 py-2 border w-1/2 text-lg placeholder:text-base outline-none"
              type="text"
              value={firstname}
              onChange={(e) => setFirstName(e.target.value)}
              required
              placeholder="First name"
            />

            <input
              className="bg-[#eeeeee] rounded px-4 py-2 border w-1/2 text-lg placeholder:text-base outline-none"
              type="text"
              value={lastname}
              onChange={(e) => setLastName(e.target.value)}
              required
              placeholder="Last name"
            />
          </div>

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

          <h3 className="text-xl mb-2 font-semibold">
            What&apos;s your Vehicle Color?
          </h3>

          <input
            className="bg-[#eeeeee] rounded px-4 py-2 border w-full text-lg placeholder:text-base outline-none mb-7"
            type="text"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            required
            placeholder="Vehicle color"
          />

          <h3 className="text-xl mb-2 font-semibold">
            What&apos;s your Vehicle Number Plate?
          </h3>

          <input
            className="bg-[#eeeeee] rounded px-4 py-2 border w-full text-lg placeholder:text-base outline-none mb-7"
            type="text"
            value={plate}
            onChange={(e) => setPlate(e.target.value)}
            required
            placeholder="Vehicle plate"
          />

          <h3 className="text-xl mb-2 font-semibold">
            What&apos;s your Vehicle Capacity?
          </h3>

          <input
            className="bg-[#eeeeee] rounded px-4 py-2 border w-full text-lg placeholder:text-base outline-none mb-7"
            type="number"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            required
            placeholder="Vehicle capacity"
          />

          <h3 className="text-xl mb-2 font-semibold">
            What&apos;s your Vehicle Type?
          </h3>

          <select
            className="bg-[#eeeeee] rounded px-4 py-2 border w-full text-base outline-none mb-7 appearance-none"
            value={vehicleType}
            onChange={(e) => setVehicleType(e.target.value)}
            required
          >
            <option value="" disabled hidden>
              Select Vehicle Type
            </option>
            <option value="car">Car</option>
            <option value="auto">Auto</option>
            <option value="motorcycle">Motorcycle</option>
          </select>

          <button
            onClick={handleSubmit}  
            className="bg-black text-white rounded px-4 py-2 w-full text-lg placeholder:text-base outline-none mb-2"
          >
            Create account
          </button>
        </form>

        <p className="text-center mb-10">
          Already have an account?{" "}
          <Link to="/captain-login" className="text-blue-600 hover:underline">
            Login here
          </Link>
        </p>
      </div>

      <div className="text-[10px] leading-tight text-center">
        <p>
          By proceeding, you consent to get calls, WhatsApp or SMS messages,
          including by automated means, from Uber and its affiliates to the
          number provided.
        </p>
      </div>
    </div>
  );
};

export default CaptainSignup;
