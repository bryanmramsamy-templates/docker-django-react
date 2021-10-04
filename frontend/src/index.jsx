import React from 'react';
import ReactDOM from 'react-dom';

import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";

import App from './app';

import {
  LOCALSTORAGE_TOKEN_AUTH_KEY
} from './components/authentication/authentication-required';

import reportWebVitals from './utils/reportWebVitals';
import { getGraphQLUri } from './utils/apollo-provider/backend-graphql-uri';

import './index.css';


const tokenAuth = localStorage.getItem(LOCALSTORAGE_TOKEN_AUTH_KEY);


/**
 * Define the default ApolloClient.
 *
 * Use the GraphQL URI based on the domain name, inject the Authorization header
 * with tokenAuth stored in localStorage if found and define the local memory as
 * cache.
 */
const client = new ApolloClient({
  uri: getGraphQLUri(),
  headers: {
    Authorization: tokenAuth ? `JWT ${ tokenAuth }` : ""
  },
  cache: new InMemoryCache(),
})


ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={ client }>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
