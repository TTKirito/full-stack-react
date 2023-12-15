import { Card, Col, Input, Row, Typography } from "antd";
import { Link } from "react-router-dom";

const { Title } = Typography;
const { Search } = Input;
const lodonImage = `https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZHViYWl8ZW58MHx8MHx8fDA%3D`;

interface Props {
  onSearch: (value: string) => void;
}

export const HomeHero = ({ onSearch }: Props) => {
  return (
    <div className="home-hero">
      <div className="home-hero__search">
        <Title>Find a place you'll love to stay at</Title>
        <Search
          placeholder="Search 'Hue'"
          size="large"
          enterButton
          className="home-hero__search-input"
          onSearch={onSearch}
        />
      </div>
      <Row gutter={12} className="home-hero__cards">
        <Col xs={12} md={6}>
          <Link to="/listings/Phuong%20Phu%20Nhuan">
            <Card
              cover={
                <img
                  alt="Phuong Phu Nhuan"
                  src={
                    "https://res.cloudinary.com/tttkirito/image/upload/v1702545558/APP_booking/eapiq6qxxo1tqg6ngedu.png"
                  }
                />
              }
            >
              Phuong Phu Nhuan
            </Card>
          </Link>
        </Col>
        <Col xs={12} md={6}>
          <Link to="/listings/Phuong%20Xuan%20Phu">
            <Card
              cover={
                <img
                  alt="Phuong Xuan Phu"
                  src={
                    "https://res.cloudinary.com/tttkirito/image/upload/v1702545558/APP_booking/bbcce2clyvqo2tuoyakc.png"
                  }
                />
              }
            >
              Phuong Xuan Phu
            </Card>
          </Link>
        </Col>
        <Col xs={0} md={6}>
          <Link to="/listings/Hue%20">
            <Card
              cover={
                <img
                  alt="Hue City"
                  src={
                    "https://res.cloudinary.com/tttkirito/image/upload/v1702545557/APP_booking/lhxinfzqn6nagbfs6w18.png"
                  }
                />
              }
            >
              Hue City
            </Card>
          </Link>
        </Col>
        <Col xs={0} md={6}>
          <Link to="/listings/Hue">
            <Card
              cover={
                <img
                  alt="Hue"
                  src={
                    "https://res.cloudinary.com/tttkirito/image/upload/v1702545556/APP_booking/y991lwcio7xkjuii8hyv.png"
                  }
                />
              }
            >
              Hue
            </Card>
          </Link>
        </Col>
      </Row>
    </div>
  );
};
