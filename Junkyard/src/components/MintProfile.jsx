import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import Waste from "../utils/Waste.json";
import { wastemarketplaceAddress } from "../../config";
import axios from "axios";

const PINATA_API_KEY = "49f451eafcababfc0228";
const PINATA_SECRET_API_KEY = "828d747017097d55e54b66ef67c65e07194b38514fa3eb53342882d3e31a2c6c";

const MintProfile = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState(null);
  const [uploadedFile, setUploadedFile] = useState();
  const [imageView, setImageView] = useState();
  const [metaDataURL, setMetaDataURl] = useState();
  const [txURL, setTxURL] = useState();
  const [txStatus, setTxStatus] = useState();
  const [formInput, updateFormInput] = useState({
    name: "",
    description: "",
    country: "",
    weight: "",
    collectionPoint: "",
    price: "",
  });

  const handleFileUpload = (event) => {
    setUploadedFile(event.target.files[0]);
    setTxStatus("");
    setImageView("");
    setMetaDataURl("");
    setTxURL("");
  };

  const uploadNFTContent = async (inputFile) => {
    const { name, description, country, weight, collectionPoint, price } = formInput;
    if (!name || !description || !country || !weight || !collectionPoint || !inputFile) return;

    const data = new FormData();
    data.append("file", inputFile);

    const metadata = JSON.stringify({
      name: name,
      description: description,
      keyvalues: {
        country: country,
        collectionPoint: collectionPoint,
        weight: weight,
        price: price,
      },
    });
    data.append("pinataMetadata", metadata);

    const options = JSON.stringify({
      cidVersion: 1,
    });
    data.append("pinataOptions", options);

    try {
      setTxStatus("Uploading Item to IPFS via Pinata.");
      const res = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', data, {
        maxBodyLength: 'Infinity',
        headers: {
          'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
          'pinata_api_key': PINATA_API_KEY,
          'pinata_secret_api_key': PINATA_SECRET_API_KEY
        }
      });
      const metaData = res.data;
      setMetaDataURl(`https://gateway.pinata.cloud/ipfs/${metaData.IpfsHash}`);
      return metaData;
    } catch (error) {
      setErrorMessage("Could not save Waste to Pinata - Aborted minting Waste.");
      console.log("Error Uploading Content", error);
    }
  };

  const sendTxToBlockchain = async (metadata) => {
    try {
      setTxStatus("Adding transaction to CORE Blockchain.");
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);

      const price = ethers.utils.parseUnits(formInput.price, "ether");
      const connectedContract = new ethers.Contract(wastemarketplaceAddress, Waste.abi, provider.getSigner());
      const mintNFTTx = await connectedContract.createToken(`https://gateway.pinata.cloud/ipfs/${metadata.IpfsHash}`, price);
      return mintNFTTx;
    } catch (error) {
      setErrorMessage("Failed to send tx to CORE Blockchain.");
      console.log(error);
    }
  };

  const previewNFT = (metaData, mintNFTTx) => {
    if (!metaData || !metaData.IpfsHash) {
      setErrorMessage("Metadata is undefined or does not contain IpfsHash property");
      return;
    }

    const imgViewString = `https://gateway.pinata.cloud/ipfs/${metaData.IpfsHash}`;
    setImageView(imgViewString);
    setMetaDataURl(imgViewString);

    setTxURL(`https://explorer.coredao.org/tx/${mintNFTTx.hash}`);
    setTxStatus("Waste registration was successful!");
  };

  const mintNFTToken = async (e) => {
    e.preventDefault();
    const metaData = await uploadNFTContent(uploadedFile);

    if (!metaData) {
      setErrorMessage("Failed to upload content. MetaData is undefined.");
      return;
    }

    const mintNFTTx = await sendTxToBlockchain(metaData);

    if (!mintNFTTx) {
      setErrorMessage("Failed to send transaction to blockchain.");
      return;
    }

    previewNFT(metaData, mintNFTTx);

    navigate("/explore");
  };

  return (
    <div
      style={{
        background: "#1d1f35", // Same background color as .navbar-bg
        color: "white",
        minHeight: "100vh",
        padding: "20px",
        fontFamily: "'Open Sans', sans-serif",
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
            paddingBottom: "12px",
          }}
        >
          <select
            style={{
              marginTop: "15px",
              padding: "10px",
              borderRadius: "8px",
              border: "none",
              width: "100%",
              fontSize: "1rem",
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
              color: "white",
              background: "#1d1f35",
              marginTop: "15px",
              padding: "10px",
              borderRadius: "8px",
              border: "none",
              width: "100%",
              fontSize: "1rem",
            }}
            onChange={(e) => updateFormInput({ ...formInput, description: e.target.value })}
            rows={2}
          />
          <input
            placeholder="Enter your Country / Region"
            style={{
              color: "white",
              background: "#1d1f35",
              marginTop: "15px",
              padding: "10px",
              borderRadius: "8px",
              border: "none",
              width: "100%",
              fontSize: "1rem",
            }}
            onChange={(e) => updateFormInput({ ...formInput, country: e.target.value })}
          />
          <input
            placeholder="Enter Address of Collection Point"
            style={{
              color: "white",
              background: "#1d1f35",
              marginTop: "15px",
              padding: "10px",
              borderRadius: "8px",
              border: "none",
              width: "100%",
              fontSize: "1rem",
            }}
            onChange={(e) => updateFormInput({ ...formInput, collectionPoint: e.target.value })}
          />
          <input
            placeholder="Weight in Kg"
            style={{
              color: "white",
              background: "#1d1f35",
              marginTop: "15px",
              padding: "10px",
              borderRadius: "8px",
              border: "none",
              width: "100%",
              fontSize: "1rem",
            }}
            onChange={(e) => updateFormInput({ ...formInput, weight: e.target.value })}
          />
          <input
            placeholder="Price in ETH, if free put 0"
            style={{
              color: "white",
              background: "#1d1f35",
              marginTop: "15px",
              padding: "10px",
              borderRadius: "8px",
              border: "none",
              width: "100%",
              fontSize: "1rem",
            }}
            onChange={(e) => updateFormInput({ ...formInput, price: e.target.value })}
          />
          <input
            type="file"
            style={{
              color: "white",
              background: "#1d1f35",
              marginTop: "15px",
              padding: "10px",
              borderRadius: "8px",
              border: "none",
              width: "100%",
              fontSize: "1rem",
            }}
            onChange={(e) => handleFileUpload(e)}
          />
          {txStatus ? (
            <div style={{ marginTop: "15px", fontSize: "1.2rem", fontWeight: "bold" }}>{txStatus}</div>
          ) : null}
          <button
            style={{
              marginTop: "15px",
              padding: "10px",
              borderRadius: "8px",
              border: "none",
              background: "#78e08f",
              color: "white",
              fontWeight: "bold",
              fontSize: "1rem",
              cursor: "pointer",
              transition: "background 0.3s ease",
            }}
            onClick={mintNFTToken}
          >
            Register Waste
          </button>
          {errorMessage ? <p>{errorMessage}</p> : null}
        </div>
      </div>
    </div>
  );
};

export default MintProfile;
