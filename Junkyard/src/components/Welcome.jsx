import React from "react";

const Welcome = () => {
  return (
    <div className="flex w-full flex-row flex-col justify-center items-center bg-gradient-to-r from-violet-700 to-pink-500 p-10">
      <div className="flex flex-row flex-col items-center justify-between md:p-20 px-4 text-center">
        <div className="flex flex-1 justify-center items-center flex-col mb-10">
          <h1 className="text-6xl sm:text-8xl text-white py-1 font-semibold">
            <span className="text-pink-200">Junkyard </span>
            <span className="text-pink-300">3.O</span>
          </h1>
          <div className="text-center mt-5 text-white font-light max-w-4xl">
            <p className="text-4xl leading-tight">
              Waste Recycling & Sustainability,
              <br />
              Help our Environment,
            </p>
            <p className="text-4xl leading-tight">
              and get rewarded
            </p>
            <p className="text-2xl mt-5 leading-tight">
              Connect your wallet, submit details of your environmental waste,
              recyclers go to the marketplace and recycle waste close to their location...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
