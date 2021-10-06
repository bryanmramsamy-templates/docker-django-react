import React, { useState } from 'react';
import { useMutation } from "@apollo/client";

import {
  TOKEN_AUTH_MUTATION
} from '../../../api/authentication/auth-token-mutations';

import { login } from '../../../utils/authentication';


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


  // Event handle functions

  /**
   * Prevent the default submit behavior and log the user in if the right
   * credentials are submitted.
   * @param {Object} event Form submit event
   */
  const handleOnSubmit = (event) => {
    event.preventDefault();

    login(
      username,
      password,
      flagUserAsAuthenticated,
      setAuthenticationLoading,
      tokenAuthMutation,
      tokensClear
    );
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
