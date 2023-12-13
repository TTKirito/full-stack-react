import {
  Button,
  Form,
  Input,
  InputNumber,
  Layout,
  Radio,
  Typography,
  Upload,
} from "antd";
import { Link, Redirect } from "react-router-dom";
import { ListingType } from "../../lib/graphql/globalTypes";
import { Viewer } from "../../lib/types";
import {
  BankOutlined,
  HomeOutlined,
  LoadingOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  displayErrorMessage,
  displaySuccessNotification,
  iconColor,
} from "../../lib/utils.ts";
import { FormEvent, useState } from "react";
import { UploadChangeParam } from "antd/es/upload";
import { useMutation } from "@apollo/client";
import {
  HostListing as HostListingData,
  HostListingVariables,
} from "../../lib/graphql/mutations/HostListing/__generated__/HostListing";
import { HOST_LISTING } from "../../lib/graphql/mutations";

interface Props {
  viewer: Viewer;
}

const { Content } = Layout;
const { Text, Title } = Typography;
const { Item } = Form;

// fix action
const uploadImage = async (options: any) => {
  const { onSuccess, onError, file, onProgress } = options;
  onSuccess("Ok");
};

export const Host = ({ viewer }: Props) => {
  const [imageLoading, setImageLoading] = useState(false);
  const [imageBase65Value, setImageBase64Value] = useState<string | null>(null);

  const [hostListing, { loading, data }] = useMutation<
    HostListingData,
    HostListingVariables
  >(HOST_LISTING, {
    onCompleted: () => {
      displaySuccessNotification("You've successfully created your listing!");
    },
    onError: () => {
      displayErrorMessage(
        "sorry! We weren't able to createyour listing. Please try again later."
      );
    },
  });

  const handleImageUpload = (info: UploadChangeParam) => {
    const { file } = info;

    if (file.status === "uploading") {
      setImageLoading(true);
      return;
    }

    if (file.status === "done" && file.originFileObj) {
      getBase64Value(file.originFileObj, (imageBase64Value) => {
        setImageBase64Value(imageBase64Value);
        setImageLoading(false);
      });
    }
  };

  const handleHostListing = (values: any) => {
    // const fullAddress = `${values.address}, ${values.city}, ${values.state}, ${values.postalCode}`;
    const fullAddress = values.city;
    const input = {
      ...values,
      address: fullAddress,
      image: imageBase65Value,
      price: values.price * 100,
    };

    delete input.city;
    delete input.state;
    delete input.postalCode;
    delete input.submit;

    hostListing({
      variables: {
        input,
      },
    });
  };

  const handleHostListingError = () => {
    displayErrorMessage("Pleae complete all required form fields!");
  };

  if (!viewer.id || !viewer.hasWallet) {
    return (
      <Content className="host-content">
        <div className="host__form-header">
          <Title level={3} className="host__form-title">
            You'll have to be signed in and connected with Stripe to host a
            listing!
          </Title>
          <Text type="secondary">
            We only allow users who've signed in to our application and have
            connected with Stripe to host new listings. You can sign in at the{" "}
            <Link to="/login">/login</Link> page and connect with Stripe shortly
            after.
          </Text>
        </div>
      </Content>
    );
  }

  if (loading) {
    return (
      <Content className="host-content">
        <div className="host__form-header">
          <Title level={4} className="host__form-title">
            Please wait!
          </Title>
          <Text type="secondary">We've creating your listing now</Text>
        </div>
      </Content>
    );
  }

  if (data && data.hostListing) {
    return <Redirect to={`/listing/${data.hostListing.id}`} />;
  }

  return (
    <Content className="host-content">
      <Form
        layout="vertical"
        onFinish={handleHostListing}
        onFinishFailed={handleHostListingError}
      >
        <div className="host__form-header">
          <Title level={3} className="host__form-title">
            Hi! Let's get started listing your place.
          </Title>
          <Text type="secondary">
            In this form, we'll collect some basic and additional information
            about your listing.
          </Text>
        </div>

        <Item
          name="type"
          label="Home Type"
          rules={[{ required: true, message: "Please select a home type!" }]}
          required
        >
          <Radio.Group>
            <Radio.Button value={ListingType.APARTMENT}>
              <BankOutlined style={{ color: iconColor, marginRight: "5px" }} />
              <span>Apartment</span>
            </Radio.Button>
            <Radio.Button value={ListingType.HOUSE}>
              <HomeOutlined style={{ color: iconColor, marginRight: "5px" }} />
              <span>House</span>
            </Radio.Button>
          </Radio.Group>
        </Item>

        <Item
          name="numOfGuests"
          label="Max # of Guests"
          extra="Max character count of 45"
          required
          rules={[
            { required: true, message: "Please enter a max number of guests!" },
          ]}
        >
          <InputNumber
            maxLength={45}
            placeholder="The iconic and luxurious Bel-Air mansion"
          />
        </Item>

        <Item
          name="title"
          label="Title of listing"
          required
          rules={[
            {
              required: true,
              message: "Please enter a title for your listing!",
            },
          ]}
        >
          <Input min={1} placeholder="4" />
        </Item>

        <Item
          name="description"
          required
          rules={[
            {
              required: true,
              message: "Please enter a description for your listing!",
            },
          ]}
          label="Description of listing"
          extra="Max character count of 45"
        >
          <Input.TextArea
            rows={3}
            maxLength={400}
            placeholder="Modern, clean, and iconic home of the Fresh Prine. Situated in the heart of Bel-Air, Los Angeles."
          />
        </Item>

        <Item
          label="Address"
          name="address"
          required
          rules={[
            {
              required: true,
              message: "Please enter a address for your listing!",
            },
          ]}
        >
          <Input placeholder="251 North Bristol Avenue" />
        </Item>

        <Item
          label="City/Town"
          name="city"
          required
          rules={[
            {
              required: true,
              message: "Please enter a city (or region) for your listing!",
            },
          ]}
        >
          <Input placeholder="Los Angeles" />
        </Item>

        <Item
          label="State/Province"
          name="state"
          required
          rules={[
            {
              required: true,
              message: "Please enter a state (or province) for your listing!",
            },
          ]}
        >
          <Input placeholder="California" />
        </Item>

        <Item
          label="Zip/Postal Code"
          name="postalCode"
          required
          rules={[
            {
              required: true,
              message: "Please enter a zip (or postal code) for your listing!",
            },
          ]}
        >
          <Input placeholder="Please enter a zip code for your listing!" />
        </Item>

        <Item
          label="Image"
          extra="Images have to under 1MB in size and of type JPG or PNG"
          name="image"
          required
          rules={[
            {
              required: true,
              message: "Please enter provide an image for your listing!",
            },
          ]}
        >
          <div className="host__form-image-upload">
            <Upload
              name="image"
              listType="picture-card"
              showUploadList={false}
              customRequest={uploadImage}
              // action="http://localhost:9000/api/mock-upload"
              beforeUpload={beforeImageUpload}
              onChange={handleImageUpload}
            >
              {imageBase65Value ? (
                <img src={imageBase65Value} alt="Listing" />
              ) : (
                <div>
                  {imageLoading ? <LoadingOutlined /> : <PlusOutlined />}
                  <div className="ant-upload-text">Upload</div>
                </div>
              )}
            </Upload>
          </div>
        </Item>

        <Item
          label="Price"
          extra="All prices in $USD/day"
          name="price"
          required
          rules={[
            {
              required: true,
              message: "Please enter a price for your listing!",
            },
          ]}
        >
          <InputNumber min={0} placeholder="120" />
        </Item>

        <Item name="submit">
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Item>
      </Form>
    </Content>
  );
};

const beforeImageUpload = (file: File) => {
  const fileIsValidImage =
    file.type === "image/jpeg" || file.type === "image/png";
  const fileIsValidSize = file.size / 1024 / 1024 < 1;

  if (!fileIsValidImage) {
    displayErrorMessage("You're only able to upload valid JPG or PNG files!");
    return false;
  }

  if (!fileIsValidSize) {
    displayErrorMessage(
      "You're only able to upload valid image files of under 1MB in size! or PNG files!"
    );
    return false;
  }

  return fileIsValidImage && fileIsValidSize;
};

const getBase64Value = (
  img: File | Blob,
  callback: (imageBase64Value: string) => void
) => {
  const reader = new FileReader();
  reader.readAsDataURL(img);
  reader.onload = (res) => {
    callback(reader.result as string);
  };
};
