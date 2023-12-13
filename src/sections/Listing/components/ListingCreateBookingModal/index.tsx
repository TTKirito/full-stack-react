import { Button, Divider, Modal, Typography } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { KeyOutlined } from "@ant-design/icons";
import { formatListingPrice } from "../../../../lib/utils.ts";

interface Props {
  modalVisible: boolean;
  setModalVisible: (modalVisible: boolean) => void;
  checkInDate: Dayjs;
  checkOutDate: Dayjs;
  price: number;
}

const { Title, Paragraph, Text } = Typography;

export const ListingCreateBookingModel = ({
  modalVisible,
  setModalVisible,
  price,
  checkInDate,
  checkOutDate,
}: Props) => {
  const daysBooked = checkOutDate.diff(checkInDate, "days");
  const listingPrice = price * daysBooked;
  const fee = 0.05 * listingPrice;
  const totalPrice = listingPrice + fee;
  return (
    <Modal
      open={modalVisible}
      centered
      footer={null}
      onCancel={() => setModalVisible(false)}
    >
      <div className="listing-booking-modal">
        <div className="listing-booking-modal__intro">
          <Title className="listing-booking-modal__intro-title">
            <KeyOutlined />
          </Title>
          <Title level={3} className="listing-booking-model__intro-title">
            Book your trip
          </Title>
          <Paragraph>
            Enter your payment information to book the listing from the dates
            between{" "}
            <Text mark strong>
              {dayjs(checkInDate).format("MMMM Do YYY")}
            </Text>{" "}
            and {" " /* khoang cach */}
            <Text mark strong>
              {dayjs(checkOutDate).format("MMMM Do YYY")}
            </Text>
            , inclusive.
          </Paragraph>
        </div>
        <Divider />

        <div className="listing-booking-modal__charge-summary">
          <Paragraph>
            {formatListingPrice(price)} * {daysBooked} days ={" "}
            <Text strong>{formatListingPrice(listingPrice)}</Text>
          </Paragraph>
          <Paragraph>   
            Fee <sub>~ 5%</sub> ={" "}
            <Text strong>{formatListingPrice(fee)}</Text>
          </Paragraph>
          <Paragraph className="listing-booking-modal__charge-summary-total">
            Total = <Text mark>{formatListingPrice(totalPrice)}</Text>
          </Paragraph>
        </div>

        <Divider />
        <div className="listing-booking-modal__stripe-card-section">
          <Button
            size="large"
            type="primary"
            className="listing-booking-modal__cta"
          >
            Book
          </Button>
        </div>
      </div>
    </Modal>
  );
};
