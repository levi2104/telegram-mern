import { Route, Routes } from "react-router-dom";
import LoginSignupPage from "./pages/LoginSignupPage";
import { useEffect, useState } from "react";
import ToggleTheme from "./components/login-signup/ToggleTheme";
import ChatPage from "./pages/ChatPage";

const App = () => {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    setIsDark(mediaQuery.matches ? true : false)
    document.documentElement.classList.toggle('dark', mediaQuery.matches)

    const handler = (e) => {
      setIsDark(e.matches ? true : false)
      document.documentElement.classList.toggle('dark', e.matches)
    }

    mediaQuery.addEventListener('change', handler)

    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
  })

  return (
    <div className="dark:bg-tg-bg min-h-screen w-full overflow-hidden">
      {/* <ToggleTheme isDark={isDark} setIsDark={setIsDark} /> */}
      <Routes>
        <Route path="/" element={<LoginSignupPage />} />
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </div>
  );
};

export default App;
