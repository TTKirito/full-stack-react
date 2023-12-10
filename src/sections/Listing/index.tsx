import { useQuery } from "@apollo/client";
import { Col, Row } from "antd";
import { Content } from "antd/es/layout/layout";
import { Dayjs } from "dayjs";
import { useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { PageSkeleton } from "../../lib/components";
import { LISTING } from "../../lib/graphql/queries/Listing";
import {
  Listing as ListingData,
  ListingVariables,
} from "../../lib/graphql/queries/Listing/__generated__/Listing";
import {
  ListingBookings,
  ListingCreateBooking,
  ListingDetails,
} from "./components";

interface MatchParams {
  id: string;
}

const PAGE_LIMIT = 3;

export const Listing = ({ match }: RouteComponentProps<MatchParams>) => {
  const [bookingsPage, setBookingsPage] = useState(1);
  const [checkInDate, setCheckInDate] = useState<Dayjs | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Dayjs | null>(null);

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
  let listingBookings = listing ? listing.bookings : null;

  const listingDetailsElement = listing ? (
    <ListingDetails listing={listing} />
  ) : null;

  listingBookings = {
    total: 4,
    result: [
      {
        id: "1",
        tenant: {
          id: "114186990765449545089",
          name: "USEr",
          avatar:
            "https://lh3.googleusercontent.com/a/ACg8ocLrz1zV_pYYoRXAO7VFkO74063uTHlrZ8UZA4cF-qYCW3M=s100",
          __typename: "User",
        },
        checkIn: "2019-10-29",
        checkOut: "2019-10-31",
        __typename: "Booking",
      },
      {
        id: "1",
        tenant: {
          id: "114186990765449545089",
          name: "USEr",
          avatar:
            "https://lh3.googleusercontent.com/a/ACg8ocLrz1zV_pYYoRXAO7VFkO74063uTHlrZ8UZA4cF-qYCW3M=s100",
          __typename: "User",
        },
        checkIn: "2019-10-29",
        checkOut: "2019-10-31",
        __typename: "Booking",
      },
      {
        id: "1",
        tenant: {
          id: "114186990765449545089",
          name: "USEr",
          avatar:
            "https://lh3.googleusercontent.com/a/ACg8ocLrz1zV_pYYoRXAO7VFkO74063uTHlrZ8UZA4cF-qYCW3M=s100",
          __typename: "User",
        },
        checkIn: "2019-10-29",
        checkOut: "2019-10-31",
        __typename: "Booking",
      },
      {
        id: "1",
        tenant: {
          id: "114186990765449545089",
          name: "USEr",
          avatar:
            "https://lh3.googleusercontent.com/a/ACg8ocLrz1zV_pYYoRXAO7VFkO74063uTHlrZ8UZA4cF-qYCW3M=s100",
          __typename: "User",
        },
        checkIn: "2019-10-29",
        checkOut: "2019-10-31",
        __typename: "Booking",
      },
    ],
  } as any;

  const listingBookingsElement = listingBookings ? (
    <ListingBookings
      listingBookings={listingBookings}
      bookingsPage={bookingsPage}
      setBookingsPage={setBookingsPage}
      limit={PAGE_LIMIT}
    />
  ) : null;

  const listingCreateBooking = listing ? (
    <ListingCreateBooking
      price={listing.price}
      checkInDate={checkInDate}
      checkOutDate={checkOutDate}
      setCheckInDate={setCheckInDate}
      setCheckOutDate={setCheckOutDate}
    />
  ) : null;

  return (
    <Content className="listings">
      <Row gutter={24} justify="space-between">
        <Col xs={24} lg={14}>
          {listingDetailsElement}
          {listingBookingsElement}
        </Col>
        <Col xs={24} lg={10}>
          {listingCreateBooking}
        </Col>
      </Row>
    </Content>
  );
};
