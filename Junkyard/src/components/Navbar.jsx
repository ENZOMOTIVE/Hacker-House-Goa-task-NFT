import React, { useState } from "react";
import { HiMenuAlt4 } from "react-icons/hi";
import { AiOutlineClose } from "react-icons/ai";
import { Link } from "react-router-dom";
import walletConnectModule from "@web3-onboard/walletconnect";
import injectedModule from "@web3-onboard/injected-wallets";
import Onboard from "@web3-onboard/core";

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
  const [toggleMenu, setToggleMenu] = useState(false);
  const [account, setAccount] = useState();
  const [sdkInfo, setSdkInfo] = useState(null); // State to hold SDK information

  const connectWallet = async () => {
    try {
      const wallets = await onboard.connectWallet();
      const { accounts, name } = wallets[0];
      setAccount(accounts[0].address);
      setSdkInfo(name); // Set SDK info to the connected wallet name
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <nav className="w-full flex md:justify-center justify-between items-center p-4 navbar-bg">
      
      <ul className="text-white lg:text-3xl md:flex hidden items-center flex-grow justify-around">
        <Link to="/" className="navbar-item">Home</Link>
        <Link to="/create" className="navbar-item">Upload-waste</Link>
        <Link to="/explore" className="navbar-item">Marketplace</Link>
        {account && (
          <li className="flex items-center">
            <p className="text-2xl font-semibold py-2 px-6">{`${account.slice(0, 6)}...${account.slice(-4)}`}</p>
            <span className="text-xs text-gray-400 ml-2">{sdkInfo}</span>
          </li>
        )}
        {!account && (
          <button
            type="button"
            onClick={connectWallet}
            className="flex flex-row justify-center items-center button-primary p-3 rounded-full cursor-pointer"
          >
            <p className="text-2xl font-semibold py-2 px-6">Connect Wallet</p>
          </button>
        )}
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
            {account && (
              <li className="text-lg my-2">Connected with {sdkInfo}</li>
            )}
            {!account && (
              <li className="text-lg my-2">
                <button onClick={connectWallet} className="text-white">
                  Connect Wallet
                </button>
              </li>
            )}
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
