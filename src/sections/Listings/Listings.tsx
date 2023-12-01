import { gql, useQuery, useMutation } from "@apollo/client";
// import {
//   DeleteListingData,
//   DeleteListingVariables,
//   ListingData,
// } from "./types";
import { Listings as ListingData } from "./__generated__/Listings";
import {
  DeleteListing as DeleteListingData,
  DeleteListingVariables,
} from "./__generated__/DeleteListing";
import { Alert, Avatar, Button, List, Spin } from "antd";
import "./styles/Listings.css";
import { ListingsSkeleton } from "./components/ListingsSkeleton/LintingsSkeletion";
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
    await deleteListing({ variables: { id } });

    refetch();
  };

  const listings = data ? data.listings : null;

  const listingList = listings ? (
    <List
      itemLayout="horizontal"
      dataSource={listings}
      renderItem={(listing) => [
        <List.Item
          actions={[
            <Button
              type="primary"
              onClick={() => handledeleteListing(listing._id)}
            >
              Delete
            </Button>,
          ]}
        >
          <List.Item.Meta
            title={listing.title}
            description={listing.address}
            avatar={<Avatar src={listing.image} shape="square" size={48} />}
          />
        </List.Item>,
      ]}
    >
      {/* {listings.map((listing) => {
        return (
          <li key={listing._id}>
            {listing.title}
            <button onClick={() => handledeleteListing(listing._id)}>
              Delete!
            </button>
          </li>
        );
      })} */}
    </List>
  ) : null;

  // if (loading) {
  //   return <h2>Loading...</h2>;
  // }

  if (loading) {
    return (
      <div className="listings">
        <ListingsSkeleton title={title} />;
      </div>
    );
  }

  if (error) {
    // return <h2>Uh oh! Something went wrong - please try again later</h2>;
    return (
      <div className="listings">
        <ListingsSkeleton title={title} error />;
      </div>
    );
  }

  // const deleteListingLoadingMessage = deleteListingLoading ? (
  //   <h4>Delete in progess...</h4>
  // ) : null;

  // const deleteListingErrorMessage = deleteListingError ? (
  //   <h4>Uh oh! Something went wrong with deleting - please try again later</h4>
  // ) : null;

  const deleteListingErrorAlert = deleteListingError ? (
    <Alert
    type="error"
    message="Uh oh! Something went wrong - please try again later"
    className="listings__alert"
  />
  ) : null;


  return (
    <div className="listings">
      <Spin spinning={deleteListingLoading}>
        {deleteListingErrorAlert}
        <h2>{title}</h2>
        {listingList}
        {/* {deleteListingLoadingMessage} */}
        {/* {deleteListingErrorMessage} */}
      </Spin>
    </div>
  );
};

// export const Listings2: FunctionComponent<Props> = ({ title }) => {
//     return <h2>{title}</h2>
// }
