import { useQuery } from "@apollo/client";
import { Content } from "antd/es/layout/layout";
import { useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { PageSkeleton } from "../../lib/components";
import { LISTING } from "../../lib/graphql/queries/Listing";
import {
  Listing as ListingData,
  ListingVariables,
} from "../../lib/graphql/queries/Listing/__generated__/Listing";

interface MatchParams {
  id: string;
}

const PAGE_LIMIT = 3;

export const Listing = ({ match }: RouteComponentProps<MatchParams>) => {
  const [bookingsPage, setBookingsPage] = useState(1);
  const { loading, data, error } = useQuery<ListingData, ListingVariables>(
    LISTING,
    {
      variables: {
        id: match.params.id,
        bookingsPage,
        limit: PAGE_LIMIT,
      },
    }
  );

  if (loading) {
    return (
      <Content className="listings">
        <PageSkeleton />
      </Content>
    );
  }

  if (error) {
    return (
      <Content className="listings">
        <PageSkeleton />
      </Content>
    );
  }

  const listing = data ? data.listing : null;
  const listingBookings = listing ? listing.bookings : null;

  return <h2>Listing</h2>;
};
