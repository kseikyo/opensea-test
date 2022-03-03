import { ethers } from "ethers";

export const connect = async ({ web3Modal, setProvider, setSigner }) => {
  const instance = await web3Modal.connect();

  const provider = new ethers.providers.Web3Provider(instance);
  const signer = provider.getSigner();
  setProvider(provider);
  setSigner(signer);
};
