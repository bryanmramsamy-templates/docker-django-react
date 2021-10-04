import React, { useState } from 'react';
import { useMutation } from "@apollo/client";

import {
  LOCALSTORAGE_TOKEN_AUTH_KEY,
  LOCALSTORAGE_REFRESH_TOKEN_KEY,
 } from '../authentication-required';

import {
  TOKEN_AUTH_MUTATION
} from '../../../api/authentication/auth-token-mutations';


const LoginForm  = ({
  setInitialLoading,
  setIsAuthenticated,
  tokensClear,
  flagUserAsAuthenticated,
}) => {
  // Authentication mutation

  const [tokenAuthMutation] = useMutation(TOKEN_AUTH_MUTATION);


  // States

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");


  // Event handle functions

  const handleOnSubmit = (event) => {
    event.preventDefault();

    setInitialLoading(true);

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

  return (
    <form>
      <input type="text" name="username" id="username" value={ username } onChange={ (event) => setUsername(event.target.value) } />
      <input type="password" name="password" id="password" value={ password } onChange={ (event) => setPassword(event.target.value)}/>
      <input type="submit" value="submit" onClick={ handleOnSubmit }/>
    </form>
  );
}


export default LoginForm;
