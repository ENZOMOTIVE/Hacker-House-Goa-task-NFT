/* eslint-disable consistent-return */
/* eslint-disable no-use-before-define */
/* eslint-disable no-shadow */
import React, { useState } from "react";
import { NFTStorage } from "nft.storage";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import Waste from "../utils/Waste.json";
import { wastemarketplaceAddress } from "../../config";

// eslint-disable-next-line max-len
const APIKEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDllMUUyY0YxODI2NTMwZDkyZThBM0I2MzFmMTRlQkUwQjUzMDYzMkIiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY2MzQzNzQ0NTg3MCwibmFtZSI6IlJFQ1lDTEUgIn0.LCcph8Eym4RgSDE1zVuKXNWYn-WrwBNRqUFxl6bk-6o";

/** rewrite ipfs:// uri to dweb.link gateway URLs
function makeGatewayURL(ipfsURI) {
  return ipfsURI.replace(/^ipfs:\/\//, "https://dweb.link/ipfs/");
}
 */

const MintWaste = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState(null);
  const [uploadedFile, setUploadedFile] = useState();
  const [imageView, setImageView] = useState();
  const [metaDataURL, setMetaDataURl] = useState();
  const [txURL, setTxURL] = useState();
  const [txStatus, setTxStatus] = useState();
  const [formInput, updateFormInput] = useState({ name: "plastic", description: "", country: "", weight: "", collectionPoint: "", price: "" });

  const handleFileUpload = (event) => {
    console.log("file for upload selected...");
    setUploadedFile(event.target.files[0]);
    setTxStatus("");
    setImageView("");
    setMetaDataURl("");
    setTxURL("");
  };

  const uploadNFTContent = async (inputFile) => {
    const { name, description, country, weight, collectionPoint, price } = formInput;
    if (!name || !description || !country || !weight || !collectionPoint || !inputFile) return;
    const nftStorage = new NFTStorage({ token: APIKEY, });
    try {
      console.log("Trying to upload asset to ipfs");
      setTxStatus("Uploading Item to IPFS & Filecoin via NFT.storage.");
      const metaData = await nftStorage.store({
        name,
        description,
        image: inputFile,
        properties: {
          country,
          collectionPoint,
          weight,
          price
        },
      });
      setMetaDataURl(metaData.url);
      console.log("metadata is: ", { metaData });
      return metaData;
    } catch (error) {
      setErrorMessage("Could not save Waste to NFT.Storage - Aborted minting Waste.");
      console.log("Error Uploading Content", error);
    }
  };

  const sendTxToBlockchain = async (metadata) => {
    try {
      setTxStatus("Adding transaction to KEVM Polygon Testnet Blockchain.");
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);

      const price = ethers.utils.parseUnits(formInput.price, "ether");
      const connectedContract = new ethers.Contract(wastemarketplaceAddress, Waste.abi, provider.getSigner());
      console.log("Connected to contract", wastemarketplaceAddress);
      console.log("IPFS blockchain uri is ", metadata.url);

      const mintNFTTx = await connectedContract.createToken(metadata.url, price);
      console.log("Waste successfully created and sent to Blockchain");
      // await mintNFTTx.wait();
      return mintNFTTx;
    } catch (error) {
      setErrorMessage("Failed to send tx to  ZKEVM Polygon Testnet.");
      console.log(error);
    }
  };

  const previewNFT = (metaData, mintNFTTx) => {
    console.log("getIPFSGatewayURL2 two is ...");
    const imgViewString = getIPFSGatewayURL(metaData.data.image.pathname);
    console.log("image ipfs path is", imgViewString);
    setImageView(imgViewString);
    setMetaDataURl(getIPFSGatewayURL(metaData.url));
    setTxURL(`https://testnet-zkevm.polygonscan.com/tx/${mintNFTTx.hash}`);
    setTxStatus("Waste registration was successfully!");
    console.log("Preview details completed");
  };

  const mintNFTToken = async (e, uploadedFile) => {
    e.preventDefault();
    // 1. upload NFT content via NFT.storage
    const metaData = await uploadNFTContent(uploadedFile);

    // 2. Mint a NFT token on Polygon
    const mintNFTTx = await sendTxToBlockchain(metaData);

    // 3. preview the minted nft
    previewNFT(metaData, mintNFTTx);

    navigate("/explore");
  };

  const getIPFSGatewayURL = (ipfsURL) => {
    const urlArray = ipfsURL.split("/");
    // console.log("urlArray = ", urlArray);
    const ipfsGateWayURL = `https://${urlArray[2]}.ipfs.nftstorage.link/${urlArray[3]}`;
    // console.log("ipfsGateWayURL = ", ipfsGateWayURL)
    return ipfsGateWayURL;
  };
  return (
    <div
      style={{
        background: "#1d1f35", // Same background color as .navbar-bg
        color: "white",
        minHeight: "100vh",
        padding: "20px",
        fontFamily: "'Open Sans', sans-serif"
      }}
    >
      <div style={{ textAlign: "center", fontSize: "2rem", fontWeight: "bold", marginTop: "10px" }}>
        <h1>Register a waste</h1>
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div
          style={{
            background: "#2c2c54", // Dark background for the form
            color: "black",
            padding: "20px",
            borderRadius: "16px",
            boxShadow: "0 4px 30px rgba(224, 86, 253, 0.6)", // Pink shadow-like outline
            backdropFilter: "blur(5px)",
            WebkitBackdropFilter: "blur(5px)",
            border: "1px solid rgba(224, 86, 253, 0.3)",
            width: "50%",
            display: "flex",
            flexDirection: "column",
            paddingBottom: "12px"
          }}
        >
          <select
            style={{
              marginTop: "15px",
              padding: "10px",
              borderRadius: "8px",
              border: "none",
              width: "100%",
              fontSize: "1rem"
            }}
            onChange={(e) => updateFormInput({ ...formInput, name: e.target.value })}
          >
            <option value="select">Click to select type of waste</option>
            <option value="plastic">Plastic</option>
            <option value="paper">Paper</option>
            <option value="glass">Glass</option>
            <option value="electronics">Electronics</option>
            <option value="metals">Metals</option>
            <option value="batteries">Batteries</option>
            <option value="tyres">Tyres</option>
            <option value="clothing">Clothing</option>
            <option value="organic">Organic Materials</option>
            <option value="medical">Medical Waste</option>
          </select>
          <textarea
            placeholder="Description of waste"
            style={{
              color:"white",
              background: "#1d1f35",
              marginTop: "15px",
              padding: "10px",
              borderRadius: "8px",
              border: "none",
              width: "100%",
              fontSize: "1rem"
            }}
            onChange={(e) => updateFormInput({ ...formInput, description: e.target.value })}
            rows={2}
          />
          <input
            placeholder="Enter your Country / Region"
            style={{
              color:"white",
              background: "#1d1f35",
              marginTop: "15px",
              padding: "10px",
              borderRadius: "8px",
              border: "none",
              width: "100%",
              fontSize: "1rem"
            }}
            onChange={(e) => updateFormInput({ ...formInput, country: e.target.value })}
          />
          <input
            placeholder="Enter Address of Collection Point"
            style={{
              color:"white",
              background: "#1d1f35",
              marginTop: "15px",
              padding: "10px",
              borderRadius: "8px",
              border: "none",
              width: "100%",
              fontSize: "1rem"
            }}
            onChange={(e) => updateFormInput({ ...formInput, collectionPoint: e.target.value })}
          />
          <input
            placeholder="Weight in Kg"
            style={{
              color:"white",
              background: "#1d1f35",
              marginTop: "15px",
              padding: "10px",
              borderRadius: "8px",
              border: "none",
              width: "100%",
              fontSize: "1rem"
            }}
            onChange={(e) => updateFormInput({ ...formInput, weight: e.target.value })}
          />
          <input
            placeholder="Price in ETH, if free put 0"
            style={{
              color:"white",
              background: "#1d1f35",
              marginTop: "15px",
              padding: "10px",
              borderRadius: "8px",
              border: "none",
              width: "100%",
              fontSize: "1rem"
            }}
            onChange={(e) => updateFormInput({ ...formInput, price: e.target.value })}
          />
          <div className="MintNFT" style={{ marginTop: "15px" }}>
            <form>
              <h3 style={{ color: "white" }}>Select a picture of the waste</h3>
              <input
                type="file"
                onChange={handleFileUpload}
                style={{
                  background: "#1d1f35",
                  color: "white",
                  marginTop: "15px",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "none",
                  width: "100%",
                  fontSize: "1rem"
                }}
              />
            </form>
            {txStatus && <p>{txStatus}</p>}
            {metaDataURL && <p><a href={metaDataURL} style={{ color: "blue" }}>Metadata on IPFS</a></p>}
            {txURL && <p><a href={txURL} style={{ color: "blue" }}>See the mint transaction</a></p>}
            {errorMessage}
            {imageView && (
              <iframe
                className="mb-10"
                title="Ebook"
                src={imageView}
                alt="NFT preview"
                frameBorder="0"
                scrolling="auto"
                height="50%"
                width="100%"
                style={{ marginTop: "15px" }}
              />
            )}
          </div>
          <button
            onClick={(e) => mintNFTToken(e, uploadedFile)}
            style={{
              
              marginTop: "15px",
              padding: "10px",
              borderRadius: "8px",
              border: "none",
              width: "100%",
              fontSize: "1rem",
              background: "#1d1f35",
              color: "white",
              cursor: "pointer"
            }}
          >
            Register Waste
          </button>
        </div>
      </div>
    </div>
  );
};

export default MintWaste;
