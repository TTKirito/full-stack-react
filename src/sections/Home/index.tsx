import { Content } from "antd/es/layout/layout";
import { HomeHero } from "./components/HomeHero";
import { ListingsFilter } from "../../lib/graphql/globalTypes";

import mapBackground from "./assets/map-background.jpg";

import { Link, RouteComponentProps } from "react-router-dom";
import { displayErrorMessage } from "../../lib/utils.ts";
import { Button, Col, Row, Typography } from "antd";
import { useQuery } from "@apollo/client";
import {
  Listings as ListingsData,
  ListingsVariables,
} from "../../lib/graphql/queries/Listings/__generated__/Listings";
import { LISTINGS } from "../../lib/graphql/queries";
import { HomeListings, HomeListingsSkeleton } from "./components";

const { Title, Paragraph } = Typography;
const hueImgae = `https://huedailytour.net/wp-content/uploads/2023/02/DAI-NOI.jpeg`;

const PAGE_LIMIT = 4;
const PAGE_NUMBER = 1;

export const Home = ({ history }: RouteComponentProps) => {
  const { loading, data } = useQuery<ListingsData, ListingsVariables>(LISTINGS, {
    variables: {
      filter: ListingsFilter.PRICE_HIGH_TO_LOW,
      limit: PAGE_LIMIT,
      page: PAGE_NUMBER,
    },
  });

  const onSearch = (value: string) => {
    const trimmedValue = value.trim();

    if (trimmedValue) {
      history.push(`/listings/${value}`);
    } else {
      displayErrorMessage("Please enter a valid search!");
    }
  };



  const renderListingSection = () => {
    if (loading) {
      return <HomeListingsSkeleton />
    }

    if (data) {
      return (
        <HomeListings title="Premium Listings" listings={data.listings.result}/>
      )
    }

    return null;
  }


  return (
    <Content
      className="home"
      style={{ backgroundImage: `url(${mapBackground})` }}
    >
      <HomeHero onSearch={onSearch} />

      <div className="home__cta-section">
        <Title level={2} className="home__cta-section-title">
          You guide for all things rental
        </Title>
        <Paragraph>
          helping you make the best decisions in renting you last minute
          locations
        </Paragraph>
        <Button className="ant-btn ant-btn-primary ant-btn-lg home__cta-section-button">
          <Link to="/listings/united%20states">
            Popular listings in the United States
          </Link>
        </Button>
      </div>

      {renderListingSection()}

      <div className="home__listings">
        <Title level={4} className="home__listings-title">
          Listings of any kind
        </Title>
        <Row gutter={12}>
          <Col xs={24} sm={12}>
            <Link to="/listings/san%20fransisco">
              <div className="home__listings-image-cover">
                <img
                  src={hueImgae}
                  alt="San Fransisco"
                  className="home__listings-img"
                />
              </div>
            </Link>
          </Col>
          <Col xs={24} sm={12}>
            <Link to="/listings/cancún">
              <div className="home__listings-image-cover">
                <img
                  src={hueImgae}
                  alt="San Fransisco"
                  className="home__listings-img"
                />
              </div>
            </Link>
          </Col>
        </Row>
      </div>
    </Content>
  );
};
