import "../styles/globals.css";
import { Provider } from "../context";
import { NETWORKS } from "../constants";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }) {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Provider network={NETWORKS.rinkeby}>
          <Component {...pageProps} />
        </Provider>
        <ReactQueryDevtools />
      </QueryClientProvider>
    </>
  );
}

export default MyApp;
