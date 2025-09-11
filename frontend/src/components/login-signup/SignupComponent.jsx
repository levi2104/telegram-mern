/* eslint-disable react/prop-types */
import { useState } from "react";
import { motion } from "framer-motion";

const SignupComponent = ({
  setCurrVariant,
  variant2,
  setLoginPage
}) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confPass, setConfPass] = useState('')
  const [passHidden, setPassHidden] = useState(true);
  const [confPassHidden, setConfPassHidden] = useState(true);

  const variants = {
    initialRight: { x: "100%", y: "-100%", opacity: 1 },
    animate: { x: 0, y: 0, opacity: 1 },
    exitRight: { x: "100%", y: "100%", opacity: 1 },
  };

  return (
    <motion.div
      variants={variants}
      initial="initialRight"
      animate="animate"
      exit="exitRight"
      transition={{ duration: 0.15, ease: "easeInOut" }}
      className="w-full"
    >
      <div className="flex flex-col gap-5 items-center min-h-screen text-black dark:text-white mx-4 font-[tg-font-2]">
        <div className="mt-12 w-[130px] 600:w-[170px]">
          <svg
            fill="currentColor"
            viewBox="0 0 32 32"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            className="dark:text-tg-purple text-tg-blue"
          >
            <title>telegram</title>
            <path d="M22.122 10.040c0.006-0 0.014-0 0.022-0 0.209 0 0.403 0.065 0.562 0.177l-0.003-0.002c0.116 0.101 0.194 0.243 0.213 0.403l0 0.003c0.020 0.122 0.031 0.262 0.031 0.405 0 0.065-0.002 0.129-0.007 0.193l0-0.009c-0.225 2.369-1.201 8.114-1.697 10.766-0.21 1.123-0.623 1.499-1.023 1.535-0.869 0.081-1.529-0.574-2.371-1.126-1.318-0.865-2.063-1.403-3.342-2.246-1.479-0.973-0.52-1.51 0.322-2.384 0.221-0.23 4.052-3.715 4.127-4.031 0.004-0.019 0.006-0.040 0.006-0.062 0-0.078-0.029-0.149-0.076-0.203l0 0c-0.052-0.034-0.117-0.053-0.185-0.053-0.045 0-0.088 0.009-0.128 0.024l0.002-0.001q-0.198 0.045-6.316 4.174c-0.445 0.351-1.007 0.573-1.619 0.599l-0.006 0c-0.867-0.105-1.654-0.298-2.401-0.573l0.074 0.024c-0.938-0.306-1.683-0.467-1.619-0.985q0.051-0.404 1.114-0.827 6.548-2.853 8.733-3.761c1.607-0.853 3.47-1.555 5.429-2.010l0.157-0.031zM15.93 1.025c-8.302 0.020-15.025 6.755-15.025 15.060 0 8.317 6.742 15.060 15.060 15.060s15.060-6.742 15.060-15.060c0-8.305-6.723-15.040-15.023-15.060h-0.002q-0.035-0-0.070 0z"></path>
          </svg>
        </div>

        <div className="flex flex-col gap-2 600:mt-6 items-center">
          <h1 className="font-[tg-font-1] text-xl 600:text-3xl">
            Sign up to Telegram
          </h1>
          <p className="font-[tg-font-2] text-sm 600:text-base min-w-3/4 text-center dark:text-tg-gray text-tg-gray-d">
            Please enter your name, email and password.
          </p>
        </div>

        <div className="mt-8 mb-16 200:w-full 600:w-[360px]">
          <div className="relative group">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="name"
              id="name"
              className="peer relative bg-transparent outline-none focus:ring-2 dark:focus:ring-tg-purple focus:ring-tg-blue border dark:border-tg-b-dark border-tg-light-gray dark:hover:border-tg-purple hover:border-tg-blue rounded-[10px] px-4 py-3 text-md w-full transition-[box-shadow] duration-500 ease-in-out"
            />

            <label
              htmlFor="name"
              className={`label-animate ${
                !name ? "top-1/2 text-base" : "text-xs"
              }`}
            >
              Name
            </label>
          </div>

          <div className="relative mt-6 group">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              id="email"
              className="peer relative bg-transparent outline-none focus:ring-2 dark:focus:ring-tg-purple focus:ring-tg-blue border dark:border-tg-b-dark border-tg-light-gray dark:hover:border-tg-purple hover:border-tg-blue rounded-[10px] px-4 py-3 text-md w-full transition-[box-shadow] duration-500 ease-in-out"
            />

            <label
              htmlFor="email"
              className={`label-animate ${
                !email ? "top-1/2 text-base" : "text-xs"
              }`}
            >
              Email
            </label>
          </div>

          <div className="relative mt-6 group">
            <div
              className={`absolute right-[6px] top-1/2 -translate-y-1/2 cursor-pointer z-20 ${
                passHidden ? "text-tg-gray" : "dark:text-tg-purple text-tg-blue"
              } transition-colors duration-0 ease-in-out dark:hover:bg-tg-icon-hover
              hover:bg-gray-100 rounded-full p-[7px]`}
              onClick={() => {
                setPassHidden((prev) => !prev);
                document.getElementById("password")?.focus();
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
            </div>

            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={passHidden ? "password" : "text"}
              id="password"
              className="peer relative bg-transparent outline-none focus:ring-2 dark:focus:ring-tg-purple focus:ring-tg-blue border dark:border-tg-b-dark border-tg-light-gray dark:group-hover:border-tg-purple group-hover:border-tg-blue rounded-[10px] px-4 py-3 text-md w-full transition-[box-shadow] duration-500 ease-in-out"
            />

            <label
              htmlFor="password"
              className={`label-animate ${
                !password ? "top-1/2 text-base" : "text-xs"
              }`}
            >
              Password
            </label>
          </div>

          <div className="relative mt-6 group">
            <div
              className={`absolute right-[6px] top-1/2 -translate-y-1/2 cursor-pointer z-20 ${
                confPassHidden ? "text-tg-gray" : "dark:text-tg-purple text-tg-blue"
              } transition-colors duration-0 ease-in-out dark:hover:bg-tg-icon-hover
              hover:bg-gray-100 rounded-full p-[7px]`}
              onClick={() => {
                setConfPassHidden((prev) => !prev);
                document.getElementById("confPass")?.focus();
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
            </div>

            <input
              value={confPass}
              onChange={(e) => setConfPass(e.target.value)}
              type={confPassHidden ? "password" : "text"}
              id="confPass"
              className="peer relative bg-transparent outline-none focus:ring-2 dark:focus:ring-tg-purple focus:ring-tg-blue border dark:border-tg-b-dark border-tg-light-gray dark:group-hover:border-tg-purple group-hover:border-tg-blue rounded-[10px] px-4 py-3 text-md w-full transition-[box-shadow] duration-500 ease-in-out"
            />

            <label
              htmlFor="confPass"
              className={`label-animate ${
                !confPass ? "top-1/2 text-base" : "text-xs"
              }`}
            >
              Confirm Password
            </label>
          </div>

          <button className="mt-6 cursor-pointer text-white dark:bg-tg-purple bg-tg-blue dark:hover:bg-tg-btn-hover-purple hover:bg-tg-btn-hover-blue w-full px-4 py-3 rounded-[10px] font-[tg-font-1]">
            SIGN UP
          </button>

          <button
            onClick={() => {
              setLoginPage((prev) => !prev);
              setCurrVariant(variant2);
            }}
            className="mt-2 cursor-pointer dark:text-tg-purple text-tg-blue dark:hover:bg-tg-btn-hover-light-purple hover:bg-tg-btn-hover-light-blue w-full px-4 py-3 rounded-[10px]"
          >
            GOT AN ACCOUNT? LOGIN
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default SignupComponent;
