import { AnimatePresence } from "framer-motion"
import LoginComponent from "../components/login-signup/LoginComponent"
import SignupComponent from "../components/login-signup/SignupComponent"
import { useEffect, useState } from "react"

const LoginSignupPage = () => {
  const variant1 = {
    initialLeft: { x: 0, y: 0, opacity: 0 },
    animate: { x: 0, y: 0, opacity: 1 },
    exitLeft: { x: "-100%", y: "100%", opacity: 1 },
  };

  const variant2 = {
    initialLeft: { x: "-100%", y: "-100%", opacity: 1 },
    animate: { x: 0, y: 0, opacity: 1 },
    exitLeft: { x: "-100%", y: "100%", opacity: 1 }
  };

  const [loginPage, setLoginPage] = useState(true)
  const [currVariant, setCurrVariant] = useState(variant1)

  const refreshBehavior = () => {
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "instant" });
    })

    return () => clearTimeout(timer)
  }

  useEffect(refreshBehavior, [loginPage])

  return (
    <div className="600:w-[400px] 600:mx-auto">
      <AnimatePresence mode="wait">
        {loginPage ? (
          <LoginComponent
            setLoginPage={setLoginPage}
            currVariant={currVariant}
            setCurrVariant={setCurrVariant}
            variant1={variant1}
            key="login"
          />
        ) : (
          <SignupComponent
            setLoginPage={setLoginPage}
            setCurrVariant={setCurrVariant}
            variant2={variant2}
            key="signup"
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default LoginSignupPage