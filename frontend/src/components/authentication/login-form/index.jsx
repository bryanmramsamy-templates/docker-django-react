import React, { useState } from 'react';
import { useMutation } from "@apollo/client";

import {
  LOCALSTORAGE_TOKEN_AUTH_KEY,
  LOCALSTORAGE_REFRESH_TOKEN_KEY,
 } from '../authentication-required';

import {
  TOKEN_AUTH_MUTATION
} from '../../../api/authentication/auth-token-mutations';


/**
 * Login form
 * @param {function} flagUserAsAuthenticated Flags the user as authenticated
 * @param {function} setAuthenticationLoading Change the Authentication loading
 * state
 * @param {function} tokensClear Clear the localStorage and flags the user as
 * unauthenticated to log one out
 * @return Login form
 */
const LoginForm  = ({
  flagUserAsAuthenticated,
  setAuthenticationLoading,
  tokensClear,
}) => {
  // Authentication mutation

  const [tokenAuthMutation] = useMutation(TOKEN_AUTH_MUTATION);


  // States

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");


  // Event handle functions

  /**
   * Generates a new tokenAuth and a refreshToken to store in localStorage if
   * the user enters the right credentials in the login form. Sign the user out
   * and clear localStorage from all tokens otherwise.
   * @param {Object} event Form submit event
   */
  const handleOnSubmit = (event) => {
    event.preventDefault();

    setAuthenticationLoading(true);

    tokenAuthMutation({ variables: { username, password }})
      .then(response => {
        const { token, refreshToken, errors } = response.data.tokenAuth;
        if (!errors) {
          localStorage.setItem(LOCALSTORAGE_TOKEN_AUTH_KEY, token);
          localStorage.setItem(LOCALSTORAGE_REFRESH_TOKEN_KEY, refreshToken);

          flagUserAsAuthenticated();

        } else {
          console.log(errors);
          window.alert(errors.nonFieldErrors.map(
            nonFieldError => nonFieldError.message
          ));

          tokensClear();

        }
      }).catch(e => {
        console.log(e);  // DEBUG: Must be removed
        window.alert("An error has occurred");

        tokensClear();

        throw e;
      })
  };


  // TODO: Create a custom login form
  return (
    <div className="LoginForm">
      <h2>
        Login
      </h2>
      <form>
        <label htmlFor="username">Username:</label>

        <input type="text" name="username" id="username" value={ username }
          onChange={ (event) => setUsername(event.target.value) } />
        <br />

        <label htmlFor="password">Password:</label>
        <input type="password" name="password" id="password" value={ password }
          onChange={ (event) => setPassword(event.target.value)}/>
        <br />

        <input type="submit" value="Sign in" onClick={ handleOnSubmit }/>
      </form>
    </div>
  );
}


export default LoginForm;
