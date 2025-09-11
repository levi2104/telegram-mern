/* eslint-disable react/prop-types */
import { motion } from "framer-motion";
import { useState } from "react";
import { TbSearch } from "react-icons/tb";
import { IoClose } from "react-icons/io5";

const ChatList = () => {
  const [search, setSearch] = useState('')

  return (
    <motion.div
      initial="initialLeft"
      animate="animate"
      exit="exitLeft"
      transition={{ duration: 0.15, ease: "easeInOut" }}
      className=""
    >
      <div className="flex flex-col min-h-screen text-black dark:text-white font-[tg-font-2]">
        <div className="fixed top-0 bg-tg-bg inset-x-4">
          <div className="flex w-full gap-3 justify-between items-center mt-2 text-tg-gray">
            <div>
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
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </div>

            <div className="relative w-[72vw] group rounded-full border border-tg-b-dark bg-black focus-within:ring-2 focus-within:ring-tg-purple transition-shadow duration-300 ease-in-out">
              {/* Search icon */}
              <label
                htmlFor="search"
                className="absolute left-3 top-1/2 -translate-y-1/2"
              >
                <TbSearch className="size-5 text-tg-gray transition-colors   duration-300 ease-in-out group-focus-within:text-tg-purple" />
              </label>

              {/* Input */}
              <input
                type="search"
                id="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="text-white bg-transparent outline-none placeholder:text-tg-gray w-full py-2 px-10 rounded-full"
                placeholder="Search"
              />

              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setSearch("")}
                className={`absolute top-1/2 -translate-y-1/2 right-2 text-tg-purple ${
                  search ? "opacity-1" : "opacity-0"
                } transition-opacity duration-300 ease-in-out`}
              >
                <IoClose className="size-7" />
              </button>
            </div>
          </div>

          <h1 className="mt-4 text-tg-purple font-[tg-font-1] text-base">
            All Chats
          </h1>

          <hr className="w-full border-t-2 border-t-tg-purple rounded-full" />
        </div>

        <div className="flex flex-col mt-[110px] mb-4 mx-2">
          <div className="flex items-center gap-[10px] p-2 active:bg-tg-b-dark transition-colors duration-200 ease-in-out">
            <div className="flex justify-center items-center rounded-full bg-tg-avatar-pink shrink-0 size-[54px] font-[tg-font-1] text-xl">
              SN
            </div>

            <div className="flex justify-between items-center w-full">
              <div className="flex flex-col">
                <span>Shalini New</span>
                <span className="text-tg-gray">Shalini New joined</span>
              </div>

              <div className="flex flex-col items-end gap-2">
                <span className="text-xs text-tg-gray">Aug 30</span>
                <span className="bg-tg-purple w-[22px] h-[22px] rounded-full flex justify-center items-center text-sm font-[tg-font-1]">
                  1
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-[10px] p-2 active:bg-tg-b-dark transition-colors duration-200 ease-in-out">
            <div className="flex justify-center items-center rounded-full bg-tg-avatar-pink shrink-0 size-[54px] font-[tg-font-1] text-xl">
              SN
            </div>

            <div className="flex justify-between items-center w-full">
              <div className="flex flex-col">
                <span>Shalini New</span>
                <span className="text-tg-gray">Shalini New joined</span>
              </div>

              <div className="flex flex-col items-end gap-2">
                <span className="text-xs text-tg-gray">Aug 30</span>
                <span className="bg-tg-purple w-[22px] h-[22px] rounded-full flex justify-center items-center text-sm font-[tg-font-1]">
                  1
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-[10px] p-2 active:bg-tg-b-dark transition-colors duration-200 ease-in-out">
            <div className="flex justify-center items-center rounded-full bg-tg-avatar-pink shrink-0 size-[54px] font-[tg-font-1] text-xl">
              SN
            </div>

            <div className="flex justify-between items-center w-full">
              <div className="flex flex-col">
                <span>Shalini New</span>
                <span className="text-tg-gray">Shalini New joined</span>
              </div>

              <div className="flex flex-col items-end gap-2">
                <span className="text-xs text-tg-gray">Aug 30</span>
                <span className="bg-tg-purple w-[22px] h-[22px] rounded-full flex justify-center items-center text-sm font-[tg-font-1]">
                  1
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-[10px] p-2 active:bg-tg-b-dark transition-colors duration-200 ease-in-out">
            <div className="flex justify-center items-center rounded-full bg-tg-avatar-pink shrink-0 size-[54px] font-[tg-font-1] text-xl">
              SN
            </div>

            <div className="flex justify-between items-center w-full">
              <div className="flex flex-col">
                <span>Shalini New</span>
                <span className="text-tg-gray">Shalini New joined</span>
              </div>

              <div className="flex flex-col items-end gap-2">
                <span className="text-xs text-tg-gray">Aug 30</span>
                <span className="bg-tg-purple w-[22px] h-[22px] rounded-full flex justify-center items-center text-sm font-[tg-font-1]">
                  1
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-[10px] p-2 active:bg-tg-b-dark transition-colors duration-200 ease-in-out">
            <div className="flex justify-center items-center rounded-full bg-tg-avatar-pink shrink-0 size-[54px] font-[tg-font-1] text-xl">
              SN
            </div>

            <div className="flex justify-between items-center w-full">
              <div className="flex flex-col">
                <span>Shalini New</span>
                <span className="text-tg-gray">Shalini New joined</span>
              </div>

              <div className="flex flex-col items-end gap-2">
                <span className="text-xs text-tg-gray">Aug 30</span>
                <span className="bg-tg-purple w-[22px] h-[22px] rounded-full flex justify-center items-center text-sm font-[tg-font-1]">
                  1
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-[10px] p-2 active:bg-tg-b-dark transition-colors duration-200 ease-in-out">
            <div className="flex justify-center items-center rounded-full bg-tg-avatar-pink shrink-0 size-[54px] font-[tg-font-1] text-xl">
              SN
            </div>

            <div className="flex justify-between items-center w-full">
              <div className="flex flex-col">
                <span>Shalini New</span>
                <span className="text-tg-gray">Shalini New joined</span>
              </div>

              <div className="flex flex-col items-end gap-2">
                <span className="text-xs text-tg-gray">Aug 30</span>
                <span className="bg-tg-purple w-[22px] h-[22px] rounded-full flex justify-center items-center text-sm font-[tg-font-1]">
                  1
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-[10px] p-2 active:bg-tg-b-dark transition-colors duration-200 ease-in-out">
            <div className="flex justify-center items-center rounded-full bg-tg-avatar-pink shrink-0 size-[54px] font-[tg-font-1] text-xl">
              SN
            </div>

            <div className="flex justify-between items-center w-full">
              <div className="flex flex-col">
                <span>Shalini New</span>
                <span className="text-tg-gray">Shalini New joined</span>
              </div>

              <div className="flex flex-col items-end gap-2">
                <span className="text-xs text-tg-gray">Aug 30</span>
                <span className="bg-tg-purple w-[22px] h-[22px] rounded-full flex justify-center items-center text-sm font-[tg-font-1]">
                  1
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-[10px] p-2 active:bg-tg-b-dark transition-colors duration-200 ease-in-out">
            <div className="flex justify-center items-center rounded-full bg-tg-avatar-pink shrink-0 size-[54px] font-[tg-font-1] text-xl">
              SN
            </div>

            <div className="flex justify-between items-center w-full">
              <div className="flex flex-col">
                <span>Shalini New</span>
                <span className="text-tg-gray">Shalini New joined</span>
              </div>

              <div className="flex flex-col items-end gap-2">
                <span className="text-xs text-tg-gray">Aug 30</span>
                <span className="bg-tg-purple w-[22px] h-[22px] rounded-full flex justify-center items-center text-sm font-[tg-font-1]">
                  1
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-[10px] p-2 active:bg-tg-b-dark transition-colors duration-200 ease-in-out">
            <div className="flex justify-center items-center rounded-full bg-tg-avatar-pink shrink-0 size-[54px] font-[tg-font-1] text-xl">
              SN
            </div>

            <div className="flex justify-between items-center w-full">
              <div className="flex flex-col">
                <span>Shalini New</span>
                <span className="text-tg-gray">Shalini New joined</span>
              </div>

              <div className="flex flex-col items-end gap-2">
                <span className="text-xs text-tg-gray">Aug 30</span>
                <span className="bg-tg-purple w-[22px] h-[22px] rounded-full flex justify-center items-center text-sm font-[tg-font-1]">
                  1
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-[10px] p-2 active:bg-tg-b-dark transition-colors duration-200 ease-in-out">
            <div className="flex justify-center items-center rounded-full bg-tg-avatar-pink shrink-0 size-[54px] font-[tg-font-1] text-xl">
              SN
            </div>

            <div className="flex justify-between items-center w-full">
              <div className="flex flex-col">
                <span>Shalini New</span>
                <span className="text-tg-gray">Shalini New joined</span>
              </div>

              <div className="flex flex-col items-end gap-2">
                <span className="text-xs text-tg-gray">Aug 30</span>
                <span className="bg-tg-purple w-[22px] h-[22px] rounded-full flex justify-center items-center text-sm font-[tg-font-1]">
                  1
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatList;
