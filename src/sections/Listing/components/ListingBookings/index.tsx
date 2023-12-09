import { Avatar, Typography, Divider, List } from "antd";
import { Link } from "react-router-dom";
import { Listing } from "../../../../lib/graphql/queries/Listing/__generated__/Listing";

interface Props {
  listingBookings: Listing["listing"]["bookings"];
  bookingsPage: number;
  limit: number;
  setBookingsPage: (page: number) => void;
}

const { Title, Text } = Typography;

export const ListingBookings = ({
  listingBookings,
  bookingsPage,
  limit,
  setBookingsPage,
}: Props) => {
  const total = listingBookings ? listingBookings.total : null;
  const result = listingBookings ? listingBookings.result : null;

  const listingBookingsList = listingBookings ? (
    <List
      grid={{
        gutter: 8,
        xs: 1,
        sm: 2,
        lg: 3,
        column: 3,
      }}
      dataSource={result ? result : undefined}
      locale={{ emptyText: "No bookings have been made yet!" }}
      pagination={{
        position: "bottom",
        current: bookingsPage,
        total: total ? total : undefined,
        defaultPageSize: limit,
        hideOnSinglePage: true,
        showLessItems: true,
        onChange: (page: number) => setBookingsPage(page),
      }}
      renderItem={(listingBookings) => {
        const bookingHistory = (
          <div className="listing-bookings__history">
            <div>
              Check in: <Text strong>{listingBookings.checkIn}</Text>
            </div>
            <div>
              Check out: <Text strong>{listingBookings.checkOut}</Text>
            </div>
          </div>
        );
        return (
          <List.Item>
            {bookingHistory}
            <Link to={`/user/${listingBookings.tenant.id}`}>
              <Avatar
                src={listingBookings.tenant.avatar}
                size={64}
                shape="square"
              />
            </Link>
          </List.Item>
        );
      }}
    />
  ) : null;

  const listingBookingsElement = listingBookings ? (
    <div className="user-bookings">
      <Divider />
      <div className="listing-bookings__section">
        <Title level={4} className="user-listings__title">
          Bookings
        </Title>
      </div>
      {listingBookingsList}
    </div>
  ) : null;

  return listingBookingsElement;
};
