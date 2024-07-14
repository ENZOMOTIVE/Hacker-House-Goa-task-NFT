import React from "react";
import logo1 from "../assets/banner.png";

const Welcome = () => {
  return (
    <div className="flex w-full mf:flex-row flex-col justify-center items-center bg-gradient-to-r from-violet-700 to-pink-500 p-10">
      <div className="flex mf:flex-row flex-col items-start justify-between md:p-20 px-4">
        <div className="flex flex-1 justify-start items-start flex-col mf:mr-10">
          <h1 className="text-5xl sm:text-7xl text-white py-1 font-semibold">
            Junkyard 3.O<br />
          </h1>
          <br />
          <p className="text-left mt-5 text-white font-light md:w-9/12 w-11/12 text-4xl">
            Waste Recycling & Sustainability <br /> Help our Environment <br />{" "}
            and get rewarded
          </p>
          <br />
          <p className="text-left mt-5 text-white font-light md:w-9/12 w-11/12 text-2xl">
            Connect your wallet, submit details of your <br /> environmental
            waste, recyclers go to the <br /> marketplace and recycle waste
            close to their location...
          </p>
        </div>
      </div>
      <div className="sm:flex-[0.9] lg:flex-[0.9] flex-initial justify-left items-center">
        <img src={logo1} alt="welcome" className="w-100 cursor-pointer" />
      </div>
    </div>
  );
};

export default Welcome;
