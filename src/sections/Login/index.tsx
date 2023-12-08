import { Card, Layout, Spin, Typography } from "antd";
import { Viewer } from "../../lib/types";
import { useApolloClient, useMutation } from "@apollo/client";

import googleLogo from "./assets/google_logo.png";
import { AuthUrl as AuthUrlData } from "../../lib/graphql/queries/AuthUrl/__generated__/AuthUrl";
import { AUTH_URL } from "../../lib/graphql/queries/AuthUrl";
import {
  LogIn as LoginData,
  LogInVariables,
} from "../../lib/graphql/mutations/Login/__generated__/LogIn";
import { LOG_IN } from "../../lib/graphql/mutations/Login";
import { useEffect, useRef } from "react";
import {
  displayErrorMessage,
  displaySuccessNotification,
} from "../../lib/utils.ts";
import { ErrorBanner } from "../../lib/components/ErrorBanner";
import { Redirect } from "react-router-dom";

const { Content } = Layout;
const { Text, Title } = Typography;

interface Props {
  setViewer: (viewer: Viewer) => void;
}

export const LogIn = ({ setViewer }: Props) => {
  const client = useApolloClient();
  const [logIn, { data: logInData, loading: logInLoading, error: logInError }] =
    useMutation<LoginData, LogInVariables>(LOG_IN, {
      onCompleted: (data) => {
        if (data && data.logIn && data.logIn.token) {
          setViewer(data.logIn);
          sessionStorage.setItem("token", data.logIn.token);
          displaySuccessNotification("You've successfully logged in!");
        }
      },
    });

  const logInRef = useRef(logIn);

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");
    if (code) {
      logInRef.current({
        variables: {
          input: { code },
        },
      });
    }
  }, []);

  const handleAuthorize = async () => {
    try {
      const { data } = await client.query<AuthUrlData>({
        query: AUTH_URL,
      });
      window.location.href = data.authUrl;
    } catch (e) {
      displayErrorMessage(
        "Sorry! We ware't able to log you in. Please try again later!"
      );
    }
  };

  if (logInLoading) {
    return (
      <Content className="log-in">
        <Spin size="large" tip="Login you in" />
      </Content>
    );
  }

  if (logInData && logInData.logIn) {
    const { id: viewerId } = logInData.logIn;

    return <Redirect to={`/user/${viewerId}`} />;
  }

  const loginErrorBannerElement = logInError ? (
    <ErrorBanner description="Sorry! We weren't able to log you in. Please try again later!" />
  ) : null;

  return (
    <Content className="log-in">
      {loginErrorBannerElement}
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
        <button
          className="log-in-card__google-button"
          onClick={handleAuthorize}
        >
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
          Note: By signing in, you'll be redirected to the Google consent from
          to sign in with your Google account.
        </Text>
      </Card>
    </Content>
  );
};
