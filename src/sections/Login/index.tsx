import { Card, Layout, Typography } from "antd";
import googleLogo from "./assets/google_logo.png";
const { Content } = Layout;
const { Text, Title } = Typography;

export const LogIn = () => {
  return (
    <Content className="log-in">
      <Card className="log-in-card">
        <div className="log-in-card__intro">
          <Title level={3} className="log-in-card__intro-title">
            <span role="img" aria-label="wave">
              👋
            </span>
          </Title>
          <Title level={3} className="log-in-card__intro-title">
            Login in to Thuan!
          </Title>
          <Text>Sign in with Google to start booking available retals</Text>
        </div>
        <button className="log-in-card__google-button">
          <img
            src={googleLogo}
            alt="Google Logo"
            className="log-in-card__google-button-logo"
          />
          <span className="log-in-card__google-button-text">
            Sign in with Google
          </span>
        </button>
        <Text type="secondary">
          Not: By signing in, you'll be redirected to the Google consent from to
          sign in with your Google account.
        </Text>
      </Card>
    </Content>
  );
};
