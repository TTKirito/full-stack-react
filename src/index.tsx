import React from "react";
import { render } from "react-dom";
import reportWebVitals from "./reportWebVitals";
import Listings from "./sections/Listings";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import "./styles/index.css";

const client = new ApolloClient({
  uri: "http://localhost:9000/api",
  cache: new InMemoryCache(),
});

render(
  <ApolloProvider client={client}>
    <Listings title="Thuan"></Listings>
  </ApolloProvider>,
  document.getElementById("root")
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
