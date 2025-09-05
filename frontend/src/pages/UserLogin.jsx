import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserDataContext } from "../context/UserContext";
import axios from "axios";

const UserLogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate()

  const { setUser } = useContext(UserDataContext)

  const handleSubmit = async (e) => {
    e.preventDefault()

    const newUser = { email, password }

    try{
      const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/users/login`,
      newUser,
      { withCredentials: true }
      );

      console.log(response.data.user)
      setUser(response.data.user)
      navigate('/user-home')
    } catch (err){
      console.error({ message: err })
    }

    setEmail('')
    setPassword('')
  }

  return (
    <div className="flex flex-col justify-between h-screen p-7">
      <div>
        <img
          className="w-16 mb-8"
          src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
          alt="uber-logo.png"
        />

        <form onSubmit={handleSubmit}>
          <h3 className="text-xl mb-2 font-semibold">
            What&apos;s your email?
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
          New here?{" "}
          <Link to="/user-signup" className="text-blue-600 hover:underline">
            Create new Account
          </Link>
        </p>
      </div>

      <div className="">
        <Link to='/captain-login' className="bg-[#10b461] flex items-center justify-center text-white rounded px-4 py-2 w-full text-lg placeholder:text-base outline-none">
          Sign in as Captain
        </Link>
      </div>
    </div>
  );
};

export default UserLogin;
