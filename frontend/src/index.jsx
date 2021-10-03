import React from 'react';
import ReactDOM from 'react-dom';

import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";

import './index.css';
import App from './app';
import reportWebVitals from './utils/reportWebVitals';
import { getGraphQLUri } from './utils/apollo-provider/backend-graphql-uri';
import { LOCALSTORAGE_TOKEN_AUTH_KEY } from './services/authentication-required';


/*const client = new ApolloClient({
  uri: "http://127.0.0.1:8000/graphql/",
  cache: new InMemoryCache(),
})
const authenticationLink = new ApolloLink((operation, forward) =>{
  const tokenAuth = localStorage.getItem(LOCALSTORAGE_AUTH_TOKEN_KEY);
  operation.setContext({
    headers: {
      Authorization: tokenAuth ? `JWT ${ tokenAuth }` : "",
    }
  })

  return forward(operation);
})*/


const tokenAuth = localStorage.getItem(LOCALSTORAGE_TOKEN_AUTH_KEY);

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
