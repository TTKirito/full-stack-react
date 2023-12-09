import { Button, Card, DatePicker, Divider, Typography } from "antd";
import dayjs, { Dayjs } from "dayjs";
import {
  displayErrorMessage,
  formatListingPrice,
} from "../../../../lib/utils.ts";

const { Paragraph, Text, Title } = Typography;

interface Props {
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
}: Props) => {
  const disableDate = (currentDate?: Dayjs) => {
    if (currentDate) {
      const dateIsBeforeEndOfDate = currentDate.isBefore(dayjs().endOf("day"));
      return dateIsBeforeEndOfDate;
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

      setCheckOutDate(selectedCheckOutDate);
    }
  };

  const checkOutInputDisabled = !checkInDate;
  const buttonDisabled = !checkInDate || !checkOutDate;

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
          Reqeust to book!
        </Button>
      </Card>
    </div>
  );
};
