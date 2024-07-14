import React from "react";

const Welcome = () => {
  return (
    <div className="flex w-full flex-row flex-col justify-center items-center bg-gradient-to-r from-violet-700 to-pink-500 p-10">
      <div className="flex flex-row flex-col items-start justify-between md:p-20 px-4">
        <div className="flex flex-1 justify-start items-start flex-col mr-10">
          <h1 className="text-5xl sm:text-7xl text-white py-1 font-semibold">
            <span className="text-pink-200">Junkyard </span>
            <span className="text-pink-300">3.O</span>
          </h1>
          <p className="text-left mt-5 text-white font-light md:w-9/12 w-11/12 text-4xl">
            Waste Recycling & Sustainability
            <br />
            Help our Environment
            <br />
            and get rewarded
          </p>
          <p className="text-left mt-5 text-white font-light md:w-9/12 w-11/12 text-2xl">
            Connect your wallet, submit details of your
            <br />
            environmental waste, recyclers go to the
            <br />
            marketplace and recycle waste close to their location...
          </p>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
