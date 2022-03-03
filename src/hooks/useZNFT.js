import { useQuery } from "react-query";
import { request, gql } from "graphql-request";
import { zoraEndpoint } from "../constants";

export function useZNFT(address, order_by = "{ tokenId: asc }", limit = "4") {
  return useQuery(
    ["nft", address],
    async () => {
      const data = await request(
        zoraEndpoint,
        gql`
          {
            Token(
              where: { address: { _eq: "0x8d04a8c79cEB0889Bdd12acdF3Fa9D207eD3Ff63" } }
              order_by: ${order_by}
              limit: ${limit}
            ) {
              tokenId
              address
              minter
              owner
              metadata {
                json
              }
            }
          }
        `
      );

      return data;
    },
    {
      enabled: !!address,
    }
  );
}
