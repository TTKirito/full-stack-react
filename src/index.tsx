import React from "react";
import { render } from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import reportWebVitals from "./reportWebVitals";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import "./styles/index.css";
import { Listings, Home, Host, Listing, NotFound, User, LogIn } from "./sections";
import Layout from "antd/es/layout/layout";

const client = new ApolloClient({
  uri: "http://localhost:9000/api",
  cache: new InMemoryCache(),
});

const App = () => {
  return (
    <Router>
     <Layout id="app">
     <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/host" component={Host} />
        <Route exact path="/listing/:id" component={Listing} />
        <Route exact path="/listing/:location?" component={Listings} />
        <Route exact path="/login" component={LogIn} />
        <Route exact path="/user/:id" component={User} />
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
