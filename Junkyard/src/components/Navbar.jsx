import React, { useState } from "react";
import { HiMenuAlt4 } from "react-icons/hi";
import { AiOutlineClose } from "react-icons/ai";
import { Link } from "react-router-dom";
import walletConnectModule from "@web3-onboard/walletconnect";
import injectedModule from "@web3-onboard/injected-wallets";
import Onboard from "@web3-onboard/core";
import logo from "../assets/logo.png";

const walletConnect = walletConnectModule();
const injected = injectedModule();

const modules = [walletConnect, injected];

const RPC_URL = "https://rpc.ankr.com/scroll_sepolia_testnet";

const onboard = Onboard({
  wallets: modules,
  chains: [
    {
      id: "0x8274f",
      token: "ETH",
      namespace: "evm",
      label: "Scroll Testnet",
      rpcUrl: RPC_URL,
    },
  ],
  appMetadata: {
    name: "RECYCLE",
    icon: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg",
    description: "Recycle waste and save our environment",
    recommendedInjectedWallets: [
      { name: "Coinbase", url: "https://wallet.coinbase.com/" },
      { name: "MetaMask", url: "https://metamask.io" },
    ],
  },
});

const NavBarItem = ({ title, classprops }) => (
  <li className={`mx-4 cursor-pointer ${classprops}`}>{title}</li>
);

const Navbar = () => {
  const [toggleMenu, setToggleMenu] = React.useState(false);
  const [account, setAccount] = useState();

  const connectWallet = async () => {
    try {
      const wallets = await onboard.connectWallet();
      const { accounts } = wallets[0];
      setAccount(accounts[0].address);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <nav className="w-full flex md:justify-center justify-between items-center p-4 navbar-bg">
      <div className="md:flex-[0.5] flex-initial justify-center items-center">
        <img src={logo} alt="logo" className="sm:w-10 lg:w-24 cursor-pointer" />
      </div>
      <ul className="text-white lg:text-3xl md:flex hidden items-center flex-grow justify-around">
        <Link to="/" className="navbar-item">Home</Link>
        <Link to="/create" className="navbar-item">Create-waste</Link>
        <Link to="/explore" className="navbar-item">Marketplace</Link>
        <button
          type="button"
          onClick={connectWallet}
          className="flex flex-row justify-center items-center button-primary p-3 rounded-full cursor-pointer"
        >
          <p className="text-2xl font-semibold py-2 px-6">
            {account ? `Connected: ${account.slice(0, 6)}...${account.slice(-4)}` : "Connect Wallet"}
          </p>
        </button>
      </ul>
      <div className="flex relative">
        {!toggleMenu && (
          <HiMenuAlt4 fontSize={28} className="text-white md:hidden cursor-pointer" onClick={() => setToggleMenu(true)} />
        )}
        {toggleMenu && (
          <AiOutlineClose fontSize={28} className="text-white md:hidden cursor-pointer" onClick={() => setToggleMenu(false)} />
        )}
        {toggleMenu && (
          <ul
            className="z-10 fixed -top-0 -right-2 p-3 w-[70vw] h-screen shadow-2xl md:hidden list-none
            flex flex-col justify-start items-end rounded-md navbar-bg text-white animate-slide-in"
          >
            <li className="text-xl w-full my-2"><AiOutlineClose onClick={() => setToggleMenu(false)} /></li>
            {["Home", "Create Waste", "Explore", "About"].map(
              (item, index) => <NavBarItem key={item + index} title={item} classprops="my-2 text-lg" />,
            )}
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
