import { server, useQuery } from "../../lib/api";
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
  const { data } = useQuery<ListingData>(LISTINGS);

  const deleteListing = async (id: string) => {
    const { data } = await server.fetch<
      DeleteListingData,
      DeleteListingVariables
    >({
      query: DELETE_LISTING,
      variables: { id },
    });
  };

  const listings = data ? data.listings : null;

  const listingList = listings ? (
    <ul>
      {listings.map((listing) => {
        return (
          <li key={listing._id}>
            {listing.title}
            <button onClick={() => deleteListing(listing._id)}>Delete!</button>
          </li>
        );
      })}
    </ul>
  ) : null;

  return (
    <div>
      <h2>{title}</h2>
      {listingList}
    </div>
  );
};

// export const Listings2: FunctionComponent<Props> = ({ title }) => {
//     return <h2>{title}</h2>
// }
