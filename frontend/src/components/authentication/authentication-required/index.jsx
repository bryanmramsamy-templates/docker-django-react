import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useMutation } from "@apollo/client";

import { REFRESH_TOKEN_MUTATION }
  from '../../../api/authentication/auth-token-mutations';

import LoginForm from './login-form';

import { UserAuthenticationStateContext }
  from '../../../contexts/authentication';


// Env variables
const APP_NAME = process.env.REACT_APP_NAME;
const JWT_RENEW_INTERVAL
  = (Number(process.env.REACT_APP_JWT_EXPIRATION_DELTA) > 1)
  ? 1000 * 60 * (Number(process.env.REACT_APP_JWT_EXPIRATION_DELTA) - 1)
  : 1000 * 30;

// Token keys
export const LOCALSTORAGE_TOKEN_AUTH_KEY = `${ APP_NAME }.tokenAuth`;
export const LOCALSTORAGE_REFRESH_TOKEN_KEY
  = `${ APP_NAME }.refreshToken`;

/**
 * Wrapper that contains all the protected content which must only be visible by
 * authenticated users.
 *
 * If the user has a valid refreshToken, a tokenAuth and a new refreshToken will
 * be generated, stored in localStorage and renewed at a regular interval as
 * long as the user has a valid refreshToken in one's localStorage.
 *
 * Each refreshToken is revoked once a new one is generated.
 *
 * If the refreshToken is missing or is not valid, a login form will be rendered
 * instead of the protected content.
 * @param {Object} children Children protected components
 * @param {Number} tokenRefreshInterval Tokens renew interval in milliseconds.
 * Default value is one minute less than the JWT_EXPIRATION_DELTA value.
 * @return The protected content if the user is authenticated, otherwise a login
 * form
 */
const AuthenticationRequired
  = ({ children, tokenRefreshInterval = JWT_RENEW_INTERVAL }) => {
  // Authentication mutations
  const [refreshTokenMutation] = useMutation(REFRESH_TOKEN_MUTATION);

  // State
  const [authenticationLoading, setAuthenticationLoading] = useState(true);

  // Context
  const userAuthenticationState = useContext(UserAuthenticationStateContext);

  // CallBacks
  /**
   * Clears the localStorage from all tokens and flags the user as
   * unauthenticated.
   */
  const tokensClear = useCallback(() => {
    localStorage.clear();
    setAuthenticationLoading(false);
    userAuthenticationState.setAuthenticated(false);
  }, [setAuthenticationLoading, userAuthenticationState]);

  /**
   * Flag the user as authenticated.
   */
  const flagUserAsAuthenticated = useCallback(() => {
    setAuthenticationLoading(false);
    userAuthenticationState.setAuthenticated(true);
  }, [setAuthenticationLoading, userAuthenticationState]);

  /**
   * If the current user's refreshToken is valid, renew both authToken and
   * refreshToken, then revoke previous refreshToken.
   * @param {String} currentRefreshToken Current refreshToken to check
   * @return {Boolean} True if both tokens successfully renewed
   */
  const tokensRenewal = useCallback(async (currentRefreshToken) => {
    const refreshTokenResponse = await refreshTokenMutation(
        { variables: { refreshToken: currentRefreshToken }});

    if (refreshTokenResponse.data.refreshToken.success) {
      localStorage.setItem(
        LOCALSTORAGE_TOKEN_AUTH_KEY,
        refreshTokenResponse.data.refreshToken.token
      );
      localStorage.setItem(
        LOCALSTORAGE_REFRESH_TOKEN_KEY,
        refreshTokenResponse.data.refreshToken.refreshToken
      );

    } else {
      // TODO: Error must be handled
      console.log(refreshTokenResponse.data.refreshToken.errors);

      tokensClear();
    }

    return refreshTokenResponse.data.refreshToken.success;
  }, [refreshTokenMutation, tokensClear]);

  // Reduce dispatch to child component
  const authenticationDispatch = useMemo(() => ({
    flagUserAsAuthenticated,
    setAuthenticationLoading,
    tokensClear,
    tokensRenewal,
  }), [
    flagUserAsAuthenticated,
    setAuthenticationLoading,
    tokensClear,
    tokensRenewal,
  ]);

  // Effects
  /**
   * Refresh both tokenAuth and refreshToken is user's current refreshToken is
   * valid.
   */
  useEffect(() => {
    const interval = setInterval(() => {
      const refreshTokenValue = localStorage.getItem(
        LOCALSTORAGE_REFRESH_TOKEN_KEY);

      if (!refreshTokenValue) authenticationDispatch.tokensClear();
      else authenticationDispatch.tokensRenewal(refreshTokenValue);
    }, tokenRefreshInterval);

    return () => clearInterval(interval);
  }, [authenticationDispatch, tokenRefreshInterval]);

  /**
   * Set the user as authenticated if one's refreshToken is valid, otherwise
   * clear the saved tokens.
   */
  useEffect(() => {
    const refreshToken= localStorage.getItem(
      LOCALSTORAGE_REFRESH_TOKEN_KEY
    );

    if (refreshToken){
      if (authenticationDispatch.tokensRenewal(refreshToken))
        authenticationDispatch.flagUserAsAuthenticated();
    } else authenticationDispatch.tokensClear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  // Conditional renders
  if (authenticationLoading) {
    return <h1>Please wait...</h1>;  // TODO: Insert loading component here

  } else if (userAuthenticationState.isAuthenticated) {
    return children;

  } else {
    return (
      <div className="AuthenticationRequired">
        <LoginForm authenticationDispatch={ authenticationDispatch }/>
      </div>
    );
  }
}


export default AuthenticationRequired;
