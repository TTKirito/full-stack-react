import { Button, Empty, Layout, Typography } from "antd";
import { Fragment } from "react";
import { Link } from "react-router-dom";

const { Content } = Layout;
const { Text } = Typography;

export const NotFound = () => {
  return (
    <Content className="not-found">
      <Empty
        description={
          <Fragment>
            <Text className="not-found__description-title">
              Uh oh! Something went wrong
            </Text>
            <Text className="not-found__description-subtitle">
              The page you're looking for can't be found
            </Text>
          </Fragment>
        }
      />
      <Link to="/" className="not-found_cta ant-btn ant-btn-primary ant-btn-lg">
        <Button>Go to Home</Button>
      </Link>
    </Content>
  );
};
