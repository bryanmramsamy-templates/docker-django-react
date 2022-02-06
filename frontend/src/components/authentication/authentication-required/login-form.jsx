import { useState } from 'react';
import { useMutation } from "@apollo/client";

import {
  TOKEN_AUTH_MUTATION
} from '../../../api/authentication/auth-token-mutations';

import { LOCALSTORAGE_TOKEN_AUTH_KEY, LOCALSTORAGE_REFRESH_TOKEN_KEY } from ".";


/**
 * Revoke the current refreshToken, clears the localStorage from every stored
 * token and reload the page to get the login form back.
 * @param {Function} revokeTokenMutation Mutation which revokes a refreshToken.
 * Must be called in a useMutation hook in the component which calls this
 * function.
 */
export const logout = async(revokeTokenMutation) => {
  const refreshToken = localStorage.getItem(LOCALSTORAGE_REFRESH_TOKEN_KEY);
  if (refreshToken) await revokeTokenMutation({ variables: { refreshToken }});

  localStorage.clear();
  window.location.reload();
}

/**
 * Login form
 * @param {Function} flagUserAsAuthenticated Flags the user as authenticated
 * @param {Function} setAuthenticationLoading Change the Authentication loading
 * state
 * @param {Function} tokensClear Clear the localStorage and flags the user as
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

  // Authentication functions
  /**
   * Generates a new tokenAuth and a refreshToken to store in localStorage if
   * valid credentials are submitted. Otherwise sign the user out and clear
   * localStorage from all tokens.
   * @param {Function} setAuthenticationLoading Change the Authentication loading
   * @param {Function} tokenAuthMutation Mutation which generates a new tokenAuth
   * and a refreshToken if valid credentials are given. Must be called in a
   * useMutation hook in the component which calls this function.
   * @param {Function} tokensClear Clear the localStorage and flags the user as
   * unauthenticated to log one out
   */
  const login = async(
    setAuthenticationLoading,
    tokenAuthMutation,
    tokensClear,
  ) => {
    setAuthenticationLoading(true);

    try {
      const response = await tokenAuthMutation({ variables: {
        username,
        password,
      }});

      const { token, refreshToken, errors } = response.data.tokenAuth;
      if (!errors) {
        localStorage.setItem(LOCALSTORAGE_TOKEN_AUTH_KEY, token);
        localStorage.setItem(LOCALSTORAGE_REFRESH_TOKEN_KEY, refreshToken);
        flagUserAsAuthenticated();

      } else {
        // DEBUG: Error must be handled
        console.log(errors);
        window.alert(errors.nonFieldErrors.map(
          nonFieldError => nonFieldError.message
        ));

        tokensClear();

      }
    } catch (error) {
      // DEBUG: Error must be handled
      console.log(error);
      window.alert("An error has occurred");

      tokensClear();
    };
  }


  // Event handle functions

  /**
   * Prevent the default submit behavior and log the user in if the right
   * credentials are submitted.
   * @param {Object} event Form submit event
   */
  const handleOnSubmit = (event) => {
    event.preventDefault();

    login(setAuthenticationLoading, tokenAuthMutation, tokensClear);
  };

  // Render
  return (  // todo: create a custom login form
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
