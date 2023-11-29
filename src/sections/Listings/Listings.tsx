import { gql, useQuery, useMutation } from "@apollo/client";
// import {
//   DeleteListingData,
//   DeleteListingVariables,
//   ListingData,
// } from "./types";
import { Listings as ListingData } from './__generated__/Listings'
import { DeleteListing as DeleteListingData, DeleteListingVariables } from './__generated__/DeleteListing'

const LISTINGS = gql`
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

const DELETE_LISTING = gql`
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
  const { data, refetch, loading, error } = useQuery<ListingData>(LISTINGS);

  const [
    deleteListing,
    { loading: deleteListingLoading, error: deleteListingError },
  ] = useMutation<DeleteListingData, DeleteListingVariables>(DELETE_LISTING);

  const handledeleteListing = async (id: string) => {
    await deleteListing({ variables: {id } });

    refetch();
  };

  const listings = data ? data.listings : null;

  const listingList = listings ? (
    <ul>
      {listings.map((listing) => {
        return (
          <li key={listing._id}>
            {listing.title}
            <button onClick={() => handledeleteListing(listing._id)}>
              Delete!
            </button>
          </li>
        );
      })}
    </ul>
  ) : null;

  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (error) {
    return <h2>Uh oh! Something went wrong - please try again later</h2>;
  }

  const deleteListingLoadingMessage = deleteListingLoading ? (
    <h4>Delete in progess...</h4>
  ) : null;

  const deleteListingErrorMessage = deleteListingError ? (
    <h4>Uh oh! Something went wrong with deleting - please try again later</h4>
  ) : null;

  return (
    <div>
      <h2>{title}</h2>
      {listingList}
      {deleteListingLoadingMessage}
      {deleteListingErrorMessage}
    </div>
  );
};

// export const Listings2: FunctionComponent<Props> = ({ title }) => {
//     return <h2>{title}</h2>
// }
