import { Button, Divider, Modal, Typography } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { KeyOutlined } from "@ant-design/icons";
import {
  displayErrorMessage,
  displaySuccessNotification,
  formatListingPrice,
} from "../../../../lib/utils.ts";
import {
  CardElement,
  injectStripe,
  ReactStripeElements,
} from "react-stripe-elements";
import { useMutation } from "@apollo/client";
import { CREATE_BOOKING } from "../../../../lib/graphql/mutations/CreateBooking";
import {
  CreateBooking as CreateBookingData,
  CreateBookingVariables,
} from "../../../../lib/graphql/mutations/CreateBooking/__generated__/CreateBooking";

interface Props {
  modalVisible: boolean;
  setModalVisible: (modalVisible: boolean) => void;
  checkInDate: Dayjs;
  checkOutDate: Dayjs;
  price: number;
  id: string;
  clearBookingData: () => void;
  handleListingRefetch: () => Promise<void>;
}

const { Title, Paragraph, Text } = Typography;

export const ListingCreateBookingModel = ({
  modalVisible,
  setModalVisible,
  price,
  checkInDate,
  checkOutDate,
  stripe,
  id,
  clearBookingData,
  handleListingRefetch,
}: Props & ReactStripeElements.InjectedStripeProps) => {
  const [createBooking, { loading }] = useMutation<
    CreateBookingData,
    CreateBookingVariables
  >(CREATE_BOOKING, {
    onCompleted: () => {
      clearBookingData();
      displaySuccessNotification(
        "You've successfully booked the listing!",
        "Booking history can always be found in your User page."
      );
      handleListingRefetch()
    },
    onError: () => {
      displayErrorMessage("sorry! We weren't able to successfylly book the listing. Please try again later!")
    }
  });
  const daysBooked = checkOutDate.diff(checkInDate, "days");
  const listingPrice = price * daysBooked;
  const fee = 0.05 * listingPrice;
  const totalPrice = listingPrice + fee;

  const handleCreateBooking = async () => {
    if (!stripe) {
      return displayErrorMessage(
        "Sorry! We weren't able to connect with Stripe."
      );
    }

    let { token: stripeToken, error } = await stripe.createToken();
    if (stripeToken) {
      createBooking({
        variables: {
          input: {
            id,
            source: stripeToken.id,
            checkIn: dayjs(checkInDate).format("YYYY-MM-DD"),
            checkOut: dayjs(checkOutDate).format("YYYY-MM-DD"),
          },
        },
      });
    } else {
      displayErrorMessage(
        error && error.message
          ? error.message
          : "Sorry! We weren't able to book the listing. Please try again later!"
      );
    }
  };

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
            Fee <sub>~ 5%</sub> = <Text strong>{formatListingPrice(fee)}</Text>
          </Paragraph>
          <Paragraph className="listing-booking-modal__charge-summary-total">
            Total = <Text mark>{formatListingPrice(totalPrice)}</Text>
          </Paragraph>
        </div>

        <Divider />
        <div className="listing-booking-modal__stripe-card-section">
          <CardElement
            hidePostalCode
            className="listing-booking-modal__stripe-card"
          />
          <Button
            size="large"
            type="primary"
            className="listing-booking-modal__cta"
            onClick={handleCreateBooking}
            loading={loading}
          >
            Book
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export const WrappedListingCreateBookingModal = injectStripe(
  ListingCreateBookingModel
);
