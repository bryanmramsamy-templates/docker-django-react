import React from 'react';
import ReactDOM from 'react-dom';

import { ApolloClient, ApolloProvider, createHttpLink, InMemoryCache }
  from "@apollo/client";
import { setContext } from '@apollo/client/link/context';

import App from './app';

import {
  LOCALSTORAGE_TOKEN_AUTH_KEY
} from './components/authentication/authentication-required';

import reportWebVitals from './utils/reportWebVitals';
import { getGraphQLUri } from './utils/apollo-provider/backend-graphql-uri';


/**
 * ApolloClient link which define the backend URI
 */
const httpLink = createHttpLink({
  uri: getGraphQLUri(),
});


/**
 * ApolloClient link which get the authentication token from the localStorage
 * if it exists.
 * @return The headers to the context so the httpLink can read them
 */
const authLink = setContext((_, { headers }) => {
  const authToken = localStorage.getItem(LOCALSTORAGE_TOKEN_AUTH_KEY);

  return {
    headers: {
      ...headers,
      authorization: authToken ? `JWT ${ authToken }` : "",
    }
  }
});


/**
 * ApolloClient definition which uses the httpLink and authLink. Also defines
 * the local memory as cache.
 */
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});


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
