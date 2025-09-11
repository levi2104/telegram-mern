/* eslint-disable react/prop-types */
import { FiMoon } from "react-icons/fi"
import { HiOutlineSun } from "react-icons/hi";

const ToggleTheme = ({ isDark, setIsDark }) => {
  return (
    <div>
      <div
        onClick={() => setIsDark((prev) => !prev)}
        className={`w-fit flex gap-3 text-white ${
          !isDark ? "border border-tg-gray bg-white" : "border border-tg-dark-gray bg-tg-bg"
        } fixed rounded-full px-[11px] py-[10px] top-1 right-1 scale-75 600:top-4 600:right-4 600:scale-100 cursor-pointer`}
      >
        <div
          className={`absolute w-7 h-7 left-1 top-1 ${
            !isDark
              ? "translate-x-[1px] bg-tg-blue"
              : "translate-x-[29px] bg-tg-purple"
          } rounded-full transition-transform duration-150 ease-in-out`}
        ></div>

        <HiOutlineSun className="size-4 z-10"/>

        <FiMoon
          className={`size-4 z-10 ${!isDark ? "text-black" : "text-white"}`}
        />
      </div>
    </div>
  );
}

export default ToggleTheme