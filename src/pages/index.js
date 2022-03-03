import { Header } from "../components/Header";
import { NFTPreview } from "@zoralabs/nft-components";
import { useWallet, useZNFT } from "../hooks";
import { useEffect, useState } from "react";
import { OpenSeaPort, Network } from "opensea-js";
import { OPENSEA_API_KEY } from "../constants/env";

const renderZNFTs = (data) => {
  const { Token } = data;
  return Token.map((item) => {
    return (
      <div className="w-full" key={item.tokenId}>
        {/* For some reason, it wasn't loading for me the data from that address
            You can change the comments and see for yourself
         */}
        <NFTPreview id="3158" showBids showPerpetual />
        {/* <NFTPreview
          tokenId={item.tokenId}
          onClick={() => alert(`clicked on item ${item.tokenId}`)}
          showBids
          showPerpetual
        /> */}
      </div>
    );
  });
};

export default function Home({ seaport }) {
  const { provider, connection, connected } = useWallet();
  const [openseaAssets, setOpenseaAssets] = useState([]);
  const [loading, setLoading] = useState(false);

  const { data, error, isFetching } = useZNFT(connection.userAddress);

  useEffect(() => {
    if (connected && !loading) {
      if (connection) {
        const getOpenseaData = async () => {
          setLoading(true);
          const res = await fetch(
            `https://testnets-api.opensea.io/api/v1/assets?owner=${connection.userAddress}`
          );
          const { assets } = await res.json();
          console.log(assets);
          setOpenseaAssets(assets);
          setLoading(false);
        };
        getOpenseaData();
      }
    }
  }, [connected]);

  const listItem = async (item) => {
    // in 30 minutes
    const expirationTime = Math.round(Date.now() / 1000 + 60 * 30);

    // const seaport = new OpenSeaPort(provider, {
    //   networkName: Network.Main,
    //   apiKey: OPENSEA_API_KEY,
    // });

    // const listing = await seaport.createSellOrder({
    //   asset: {
    //     tokenId: item.tokenId,
    //     tokenAddress: item.asset_contract.address,
    //   },
    //   accountAddress: connection.userAddress,
    //   startAmount: 999,
    //   // If `endAmount` is specified, the order will decline in value to that amount until `expirationTime`. Otherwise, it's a fixed-price order:
    //   endAmount: 0.1,
    //   expirationTime,
    // });
    // console.log(listing);
  };

  return (
    <div className="w-full h-full">
      <Header />
      {isFetching && "loading..."}
      {error && `Error ${error}`}
      <div className="px-4 w-full h-full">
        <h1 className="text-black px-4 font-mono text-4xl">ZNFTs</h1>
        <div className="w-full gap-4 grid md:grid-cols-2 lg:grid-cols-4 grid-cols-1">
          {data && renderZNFTs(data)}
        </div>
        <div className="my-8 w-full h-full gap-4 grid md:grid-cols-2 lg:grid-cols-4 grid-cols-1">
          {openseaAssets.length &&
            openseaAssets.map((asset) => {
              return (
                <div
                  className="max-w-xs min-w-64 p-4 flex items-center flex-col gap-8"
                  key={asset.id}
                >
                  <img
                    className="w-full h-full object-contain"
                    src={asset.image_url}
                    alt={asset.description}
                  />
                  <button
                    onClick={() => listItem(asset)}
                    className="inline-block truncate max-w-xs bg-indigo-500 py-2 px-4 border border-transparent rounded-md text-base font-medium text-white hover:bg-opacity-75"
                  >
                    Click to list for 999
                  </button>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
