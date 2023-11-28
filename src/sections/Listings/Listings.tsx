import React, { FunctionComponent } from "react";
import { server } from "../../lib/api";
import {
  DeleteListingData,
  DeleteListingVariables,
  ListingData,
} from "./types";

const LISTINGS = `
    query Listings {
        listings {
            _id
            title
            image
            address
            price
            numOfGuests
            numOfBeds
            rating
        }
    }
`;

const DELETE_LISTING = `
    mutation DeleteListing($id: ID!) {
        deleteListing(id: $id) {
            _id
        }
    }
`;

interface Props {
  title: string;
}

export const Listings = ({ title }: Props) => {
  const fetchListings = async () => {
    const { data } = await server.fetch<ListingData>({ query: LISTINGS });
    console.log(data, "hixxxxxxxxxxxxxxx");
  };
  const deleteListing = async () => {
    const { data } = await server.fetch<
      DeleteListingData,
      DeleteListingVariables
    >({
      query: DELETE_LISTING,
      variables: { id: "6565d0352b3431e25485e413" },
    });
  };
  return (
    <div>
      <h2>{title}</h2>
      <button onClick={fetchListings}>Query!</button>
      <button onClick={deleteListing}>Delete!</button>
    </div>
  );
};

// export const Listings2: FunctionComponent<Props> = ({ title }) => {
//     return <h2>{title}</h2>
// }
