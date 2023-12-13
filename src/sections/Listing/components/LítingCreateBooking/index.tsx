import { Button, Card, DatePicker, Divider, Typography } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { Listing as ListingData } from "../../../../lib/graphql/queries/Listing/__generated__/Listing";
import { Viewer } from "../../../../lib/types";
import {
  displayErrorMessage,
  formatListingPrice,
} from "../../../../lib/utils.ts";
import { BookingsIndex } from "./types";

const { Paragraph, Text, Title } = Typography;

interface Props {
  viewer: Viewer;
  host: ListingData["listing"]["host"];
  bookingsIndex: ListingData["listing"]["bookingsIndex"];
  price: number;
  checkInDate: Dayjs | null;
  checkOutDate: Dayjs | null;
  setCheckInDate: (checkInDate: Dayjs | null) => void;
  setCheckOutDate: (checkOutDate: Dayjs | null) => void;
}

export const ListingCreateBooking = ({
  price,
  checkInDate,
  checkOutDate,
  setCheckInDate,
  setCheckOutDate,
  host,
  viewer,
  bookingsIndex,
}: Props) => {
  const bookingsIndexJSON: BookingsIndex = JSON.parse(bookingsIndex);

  const dateIsBooked = (currentDate: Dayjs) => {
    const year = dayjs(currentDate).year();
    const month = dayjs(currentDate).month();
    const day = dayjs(currentDate).date();

    if (bookingsIndex[year] && bookingsIndex[year][month]) {
      return Boolean(bookingsIndexJSON[year][month][day]);
    } else {
      return false;
    }
  };

  const disableDate = (currentDate?: Dayjs) => {
    if (currentDate) {
      const dateIsBeforeEndOfDate = currentDate.isBefore(dayjs().endOf("day"));
      return dateIsBeforeEndOfDate || dateIsBooked(currentDate);
    } else {
      return false;
    }
  };

  const verifyAndSetCheckOutDate = (selectedCheckOutDate: Dayjs | null) => {
    if (checkInDate && selectedCheckOutDate) {
      if (dayjs(selectedCheckOutDate).isBefore(checkInDate, "days")) {
        return displayErrorMessage(
          `You can't book date of check out to be prior to check in!`
        );
      }


      let dateCursor = checkInDate;

      while (dayjs(dateCursor).isBefore(selectedCheckOutDate, 'days')) {
        dateCursor = dayjs(dateCursor).add(1, 'days')

        const year = dayjs(dateCursor).year();
        const month = dayjs(dateCursor).month();
        const day = dayjs(dateCursor).date();
    
        if (bookingsIndex[year] && bookingsIndex[year][month] && bookingsIndex[year][month][day]) {
          return displayErrorMessage("You can't book a period of time that overlaps existing bookings. Please try again!")
        } else {
          return false;
        }
      }

      setCheckOutDate(selectedCheckOutDate);
    }
  };

  const viewerIsHost = viewer.id === host.id;
  const checkInInputDisabled = !viewer.id || viewerIsHost || !host.hasWallet;
  const checkOutInputDisabled = checkInInputDisabled || !checkInDate;
  const buttonDisabled = checkOutInputDisabled || !checkInDate || !checkOutDate;


  console.log(checkInInputDisabled, 'check', checkOutInputDisabled)
  let buttonMessage = "You won't be charged yet";
  if (!viewer.id) {
    buttonMessage = "You have to be signed in to book a listing!";
  } else if (viewerIsHost) {
    buttonMessage = "You can't book your own listing!";
  } else if (!host.hasWallet) {
    buttonMessage =
      "The host has disconnected from Stripe and thus won't be able to receive payment!";
  }

  return (
    <div className="listing-booking">
      <Card className="listing-booking__card">
        <div>
          <Paragraph>
            <Title level={2} className="listing-booking__card-title">
              {formatListingPrice(price)}
              <span>/day</span>
            </Title>
          </Paragraph>
          <Divider />
          <div className="listing-booking__card-date-picker">
            <Paragraph strong>Check In</Paragraph>
            <DatePicker
              value={checkInDate ? checkInDate : undefined}
              onChange={(checkInDate) => setCheckInDate(checkInDate)}
              format={"YYYY/MM/DD"}
              disabledDate={disableDate}
              showToday={false}
              disabled={checkInInputDisabled}
              onOpenChange={() => setCheckOutDate(null)}
            />
          </div>
          <div className="listing-booking__card-date-picker">
            <Paragraph strong>Check Out</Paragraph>
            <DatePicker
              value={checkOutDate ? checkOutDate : undefined}
              onChange={(checkOutDate) =>
                verifyAndSetCheckOutDate(checkOutDate)
              }
              format={"YYYY/MM/DD"}
              disabledDate={disableDate}
              showToday={false}
              disabled={checkOutInputDisabled}
            />
          </div>
        </div>
        <Divider />
        <Button
          disabled={buttonDisabled}
          size="large"
          type="primary"
          className="listing-booking__card-cta"
        >
          Request to book!
        </Button>
        {buttonMessage}
      </Card>
    </div>
  );
};
