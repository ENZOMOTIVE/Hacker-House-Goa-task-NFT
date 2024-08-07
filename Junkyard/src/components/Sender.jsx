/* eslint-disable no-use-before-define */
/* pages/index.js */
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
// import { useNavigate } from "react-router-dom";
import Web3Modal from "web3modal";

import Waste from "../utils/Waste.json";
import { wastemarketplaceAddress } from "../../config";

export default function Sender() {
  //  const navigate = useNavigate();
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");
  useEffect(() => {
    // eslint-disable-next-line no-use-before-define
    loadWaste();
  }, []);
  const getIPFSGatewayURL = (ipfsURL) => {
    const urlArray = ipfsURL.split("/");
    const ipfsGateWayURL = `https://${urlArray[2]}.ipfs.nftstorage.link/${urlArray[3]}`;
    return ipfsGateWayURL;
  };

  // const rpcUrl = "https://matic-mumbai.chainstacklabs.com";
  // const rpcUrl = "http://localhost:8545";

  // lets define the rpc url for the network we want to connect to by chain id
  const zkrpcurl = "https://rpc.public.zkevm-test.net";
  const lineaurl = "https://rpc.goerli.linea.build/";

  const coreurl = "https://rpc.test.btcs.network";

  async function loadWaste() {
    /* create a generic provider and query for Wastes */
    const provider = new ethers.providers.JsonRpcProvider(
      "https://rpc.test.btcs.network"
    );
    const contract = new ethers.Contract(
      wastemarketplaceAddress,
      Waste.abi,
      provider
    );
    const data = await contract.fetchMarketItems();
    console.log("Waste data fetched from contract", data);
    /*
     *  map over items returned from smart contract and format
     *  them as well as fetch their token metadata
     */
    // eslint-disable-next-line arrow-parens
    const items = await Promise.all(
      data.map(async (i) => {
        const tokenUri = await contract.tokenURI(i.tokenId);
        console.log("token Uri is ", tokenUri);
        const httpUri = getIPFSGatewayURL(tokenUri);
        console.log("Http Uri is ", httpUri);
        const meta = await axios.get(httpUri);
        const price = ethers.utils.formatUnits(i.price.toString(), "ether");

        const item = {
          price,
          tokenId: i.tokenId.toNumber(),
          image: getIPFSGatewayURL(meta.data.image),
          name: meta.data.name,
          description: meta.data.description,
          country: meta.data.properties.country,
          collectionPoint: meta.data.properties.collectionPoint,
          weight: meta.data.properties.weight,
        };
        console.log("item returned is ", item);
        return item;
      })
    );
    setNfts(items);
    setLoadingState("loaded");
  }
  async function recycle(nft) {
    /* needs the user to sign the transaction, so will use Web3Provider and sign it */
    console.log("item id clicked is", nft.tokenId);
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      wastemarketplaceAddress,
      Waste.abi,
      signer
    );

    /* user will be prompted to pay the asking proces to complete the transaction */
    const price = ethers.utils.parseUnits(nft.price.toString(), "ether");
    const transaction = await contract.createMarketSale(nft.tokenId, {
      value: price,
    });
    await transaction.wait();
    console.log("waste transaction completed, waste should show in UI ");
    const token = nft.tokenId;
    console.log("token id is ", token);
    loadWaste();
    // navigate("/view", { state: token });
  }
  if (loadingState === "loaded" && !nfts.length) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <h1 className="text-3xl text-white">No Entries Yet</h1>
      </div>
    );
  }
  return (
    <div className="bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {nfts.map((nft, i) => (
            <div
              key={i}
              className="border border-white-500 shadow rounded-xl overflow-hidden bg-gray-800"
            >
              <iframe
                title="Waste"
                frameBorder="0"
                scrolling="no"
                height="400px"
                width="100%"
                src={`${nft.image}#toolbar=0`}
                className="py-3 object-fill h-500"
              />
              <div className="p-4">
                <p className="text-xl text-green-400 font-semibold">
                  Category: {nft.name}
                </p>
                <div className="h-20 overflow-hidden">
                  <p className="text-white">Description: {nft.description}</p>
                </div>
                <p className="text-xl text-white font-semibold">
                  Country: {nft.country}
                </p>
                <div className="h-20 overflow-hidden">
                  <p className="text-white">
                    Collection Point: {nft.collectionPoint}
                  </p>
                </div>
                <p className="text-xl font-bold text-white">
                  Weight (Kg): {nft.weight}
                </p>
                <p className="text-xl font-bold text-white">
                  Price: {nft.price} ETH
                </p>
              </div>

              <div className="p-4 bg-black">
                <button
                  type="button"
                  className="w-full bg-green-500 text-white font-bold py-2 px-6 rounded"
                  onClick={() => recycle(nft)}
                >
                  Recycle
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
