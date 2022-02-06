import { useState } from 'react';
import { useMutation } from "@apollo/client";

import {
  TOKEN_AUTH_MUTATION
} from '../../../api/authentication/auth-token-mutations';

import { LOCALSTORAGE_TOKEN_AUTH_KEY, LOCALSTORAGE_REFRESH_TOKEN_KEY } from ".";


/**
 * Login form component
 * @param {Object} authenticationDispatch Reducer dispatch from parent
 * @return Login form component
 */
const LoginForm  = ({ authenticationDispatch }) => {
  // Authentication mutation
  const [tokenAuthMutation] = useMutation(TOKEN_AUTH_MUTATION);

  // States
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  /**
   * Log the user in, flag the user as authenticated and store both authToken
   * and refreshToken if the right credentials are submitted.
   */
  const login = async() => {
    authenticationDispatch.setAuthenticationLoading(true);

    try {
      const response = await tokenAuthMutation({
        variables: { username, password }
      });

      const { token, refreshToken, errors } = response.data.tokenAuth;
      if (!errors) {
        localStorage.setItem(LOCALSTORAGE_TOKEN_AUTH_KEY, token);
        localStorage.setItem(LOCALSTORAGE_REFRESH_TOKEN_KEY, refreshToken);
        authenticationDispatch.flagUserAsAuthenticated();

      } else {
        // DEBUG: Error must be handled
        console.log(errors);
        window.alert(errors.nonFieldErrors.map(
          nonFieldError => nonFieldError.message
        ));

        authenticationDispatch.tokensClear();

      }
    } catch (error) {
      // DEBUG: Error must be handled
      console.log(error);
      window.alert("An error has occurred");

      authenticationDispatch.tokensClear();
    };
  }

  // Event handle function
  /**
   * Prevent the default submit behavior and log the user in.
   * @param {Object} event Form submit event
   */
  const handleOnSubmit = (event) => {
    event.preventDefault();
    login();
  };

  // Render
  return (  // TODO: create a custom login form
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
