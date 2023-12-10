import React, { useEffect, useRef, useState } from "react";
import { render } from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import reportWebVitals from "./reportWebVitals";
import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  concat,
  createHttpLink,
  InMemoryCache,
  useApolloClient,
  useMutation,
} from "@apollo/client";
import "./styles/index.css";
import {
  Listings,
  Home,
  Host,
  Listing,
  NotFound,
  User,
  LogIn,
  AppHeader,
} from "./sections";
import Layout from "antd/es/layout/layout";
import { Viewer } from "./lib/types";
import { Affix, Spin } from "antd";
import {
  LogIn as LoginData,
  LogInVariables,
} from "./lib/graphql/mutations/Login/__generated__/LogIn";
import { LOG_IN } from "./lib/graphql/mutations/Login";
import { AppHeaderSkeleton } from "./sections/AppHeader/components";
import { ErrorBanner } from "./lib/components/ErrorBanner";

const link = createHttpLink({
  uri: "http://localhost:9000/api",
  credentials: "include",
});

const authMiddleware = new ApolloLink((operation, forward) => {
  const token = sessionStorage.getItem("token");
  operation.setContext({
    headers: {
      "X-CSRF_TOKEN": token || "",
    },
  });

  return forward(operation);
});

const client = new ApolloClient({
  link: concat(authMiddleware, link),
  cache: new InMemoryCache(),
});

const initialViewer: Viewer = {
  id: null,
  token: null,
  avatar: null,
  hasWallet: null,
  didRequest: false,
};

const App = () => {
  const [viewer, setViewer] = useState<Viewer>(initialViewer);
  // const client = useApolloClient();
  const [logIn, { error }] = useMutation<LoginData, LogInVariables>(LOG_IN, {
    onCompleted: (data) => {
      if (data && data.logIn) {
        setViewer(data.logIn);

        if (data.logIn.token) {
          sessionStorage.setItem("token", data.logIn.token);
        } else {
          sessionStorage.removeItem("token");
        }
      }
    },
  });

  const logInRef = useRef(logIn);

  useEffect(() => {
    logInRef.current();
  }, []);

  if (!viewer.didRequest && !error) {
    return (
      <Layout className="app-skeleton">
        <AppHeaderSkeleton />
        <div className="app-skeleton__spin-section">
          <Spin size="large" tip="Launching Thuan" />
        </div>
      </Layout>
    );
  }

  const logInErrorBannerElement = error ? (
    <ErrorBanner description="We weren't able to verify if you were logged in. Please try again later!" />
  ) : null;

  return (
    <Router>
      <Layout id="app">
        {logInErrorBannerElement}
        <Affix offsetTop={0} className="app_affix-header">
          <AppHeader viewer={viewer} setViewer={setViewer} />
        </Affix>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/host" component={Host} />
          <Route exact path="/listing/:id" component={Listing} />
          <Route exact path="/listings/:location?" component={Listings} />
          <Route
            exact
            path="/login"
            render={(props) => <LogIn {...props} setViewer={setViewer} />}
          />
          <Route
            exact
            path="/user/:id"
            render={(props) => <User {...props} viewer={viewer} />}
          />
          <Route component={NotFound} />
        </Switch>
      </Layout>
    </Router>
  );
};

render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("root")
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
