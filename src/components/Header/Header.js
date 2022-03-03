import { useCallback } from "react";
import { useWallet } from "../../hooks";

export const Header = () => {
  const {
    connection,
    connectWallet,
    disconnectWallet,
    connected,
    correctNetwork,
    switchToCorrectNetwork,
  } = useWallet();

  const connectToWallet = useCallback(() => {
    if (connected) {
      disconnectWallet();
    } else if (correctNetwork) {
      connectWallet();
    } else {
      switchToCorrectNetwork();
    }
  }, [connected]);

  const buttonText = () => {
    if (connected) {
      return connection.ens || connection.userAddress;
    }
    return "Connect to Wallet";
  };

  return (
    <header className="bg-white">
      <nav className="mx-auto px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="w-full py-6 flex items-center justify-end border-b border-indigo-500 lg:border-none">
          <div className="ml-10 space-x-4">
            <button
              onClick={connectToWallet}
              className="inline-block truncate max-w-xs bg-indigo-500 py-2 px-4 border border-transparent rounded-md text-base font-medium text-white hover:bg-opacity-75"
            >
              {buttonText()}
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};
