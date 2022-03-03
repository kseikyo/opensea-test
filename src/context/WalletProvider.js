import { ethers } from "ethers";
import React, { createContext, useCallback, useMemo, useState } from "react";
import Web3Modal from "web3modal";
import { useReadOnlyProvider } from "../hooks";

export const Web3Context = createContext(
  undefined
);

/**
 * @dev The global provider that handles and stores all the web3 connections. Wrap your entire App with this component.
 * @param children Your app.
 * @param network The network you want to connect to.
 * @param infuraId Your Infura project ID. This is required if you want to support WalletConnect.
 * @param extraWalletProviders An array of extra Wallet Providers you want to support.
 */
export const Provider = ({
  children,
  network,
  infuraId,
  extraWalletProviders = [],
  rpcUrl = "",
}) => {
  const [web3Modal, setWeb3Modal] = useState();
  const [signer, setSigner] = useState();
  const [error, setError] = useState();
  const [provider, setProvider] = useState();
  const [userAddress, setUserAddress] = useState();
  const [chainId, setChainId] = useState();
  const [connected, setConnected] = useState(false);
  const [correctNetwork, setCorrectNetwork] = useState(true);
  const readOnlyProvider = useReadOnlyProvider(rpcUrl);

  const defaulProviderOptions = {};

  const connectWallet = useCallback(async () => {
    try {
      const web3Modal = new Web3Modal({
        providerOptions: Object.assign(defaulProviderOptions, ...extraWalletProviders),
      });
      setWeb3Modal(web3Modal);
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      setProvider(provider);
      const chainId = await provider.getNetwork().then((network) => network.chainId);
      setChainId(chainId);
      setCorrectNetwork(chainId === network);
      const signer = provider.getSigner();
      setSigner(signer);
      setUserAddress(await signer.getAddress());
      setConnected(true);

      connection.on("chainChanged", async (newChainId) => {
        const formattedChainId = +newChainId;
        setChainId(formattedChainId);
        setCorrectNetwork(formattedChainId === network);
        const provider = new ethers.providers.Web3Provider(connection);
        setProvider(provider);
        const signer = provider.getSigner();
        setSigner(signer);
        setUserAddress(await signer.getAddress());
        setConnected(true);
      });

      connection.on("accountsChanged", async (accounts) => {
        if (accounts.length === 0) {
          // The user has disconnected their account from Metamask
          web3Modal?.clearCachedProvider();
          disconnectWallet();
          return;
        }
        const provider = new ethers.providers.Web3Provider(connection);
        setProvider(provider);
        const chainId = await provider.getNetwork().then((network) => network.chainId);
        setChainId(chainId);
        setCorrectNetwork(chainId === network);
        const signer = provider.getSigner();
        setSigner(signer);
        setUserAddress(await signer.getAddress());
        setConnected(true);
      });

      connection.on("disconnect", async () => {
        web3Modal?.clearCachedProvider();
        disconnectWallet();
      });
    } catch (err) {
      setError(err?.message || err.toString());
    }
  }, [network, correctNetwork, infuraId, extraWalletProviders]);

  const disconnectWallet = useCallback(() => {
    web3Modal?.clearCachedProvider();
    setSigner(null);
    setUserAddress(null);
    setConnected(false);
  }, [web3Modal]);

  const value = useMemo(
    () => ({
      connectWallet,
      signer,
      userAddress,
      disconnectWallet,
      connected,
      error,
      provider,
      network,
      chainId,
      correctNetwork,
      readOnlyProvider,
    }),
    [
      connectWallet,
      signer,
      userAddress,
      error,
      web3Modal,
      connected,
      provider,
      network,
      chainId,
      correctNetwork,
      readOnlyProvider,
    ]
  );

  return <Web3Context.Provider value={{ ...value }}>{children}</Web3Context.Provider>;
};
