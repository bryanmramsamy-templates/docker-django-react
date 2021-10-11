import React, { useCallback, useEffect, useState } from 'react';
import { useMutation } from "@apollo/client";

import {
  REFRESH_TOKEN_MUTATION,
  REVOKE_TOKEN_MUTATION,
  VERIFY_TOKEN_MUTATION
} from '../../../api/authentication/auth-token-mutations';

import LoginForm from './login-form';


const appName = process.env.REACT_APP_NAME;


// Token keys

export const LOCALSTORAGE_TOKEN_AUTH_KEY = `${ appName }.tokenAuth`;
export const LOCALSTORAGE_REFRESH_TOKEN_KEY = `${ appName }.refreshToken`;


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
 * @param {*} children Children protected components
 * @param {int} tokenRefreshInterval Tokens renew interval in milliseconds.
 * Default value is set to 4 minutes.
 * @param {Function} setUserIsAuthenticated Set user authentication status.
 * @param {boolean} userIsAuthenticated True if the user is authenticated.
 * @return The protected content if the user is authenticated, otherwise a login
 * form
 */
const AuthenticationRequired = ({
  children,
  tokenRefreshInterval = 1000 * 60 * 4 ,
  setUserIsAuthenticated,
  userIsAuthenticated
}) => {
  // Authentication mutations

  const [verifyTokenMutation] = useMutation(VERIFY_TOKEN_MUTATION);
  const [refreshTokenMutation] = useMutation(REFRESH_TOKEN_MUTATION);
  const [revokeTokenMutation] = useMutation(REVOKE_TOKEN_MUTATION);


  // State

  const [authenticationLoading, setAuthenticationLoading] = useState(true);


  // CallBacks

  /**
   * Clears the localStorage from all tokens and flags the user as
   * unauthenticated.
   */
  const tokensClear = useCallback(() => {
    localStorage.clear();

    setAuthenticationLoading(false);
    setUserIsAuthenticated(false);
  }, [setUserIsAuthenticated]);

  /**
   * Flag the user as authenticated.
   */
  const flagUserAsAuthenticated = useCallback(() => {
    setAuthenticationLoading(false);
    setUserIsAuthenticated(true);
  }, [setUserIsAuthenticated]);

  /**
   * Renew both tokenAuth and refreshToken if the current refreshToken is valid.
   * Revoke the previous refreshToken when a new one is renewed.
   * @param {string} currentRefreshToken Current refreshToken to check
   * @return {boolean} True if both tokens successfully renewed
   */
  const tokensRenewal = useCallback(async (currentRefreshToken) => {
    let hasSucceeded = false;

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

      const revokeTokenResponse = await revokeTokenMutation({ variables:
        { refreshToken: currentRefreshToken }
      })

      revokeTokenResponse.data.revokeToken.success ?
        hasSucceeded = true : hasSucceeded = false;
    }

    if (!hasSucceeded) tokensClear();

    return hasSucceeded;
  }, [refreshTokenMutation, revokeTokenMutation, tokensClear]);


  // Effects

  /**
   * Refreshes the tokenAuth and the refreshToken, based on the current
   * refreshToken stored in localStorage, at each interval. Clears
   * localStorage if the current refreshToken is not found.
   */
  useEffect(() => {
    const interval = setInterval(() => {
      (function loop() {
        const refreshTokenValue = localStorage.getItem(
          LOCALSTORAGE_REFRESH_TOKEN_KEY);

        if (!refreshTokenValue) {
          tokensClear();
          return null;

        } else tokensRenewal(refreshTokenValue);
      }())
    }, tokenRefreshInterval);

    return () => clearInterval(interval);
  }, [tokenRefreshInterval, tokensClear, tokensRenewal]);

  /**
   * Checks if the user has a valid tokenAuth. If the tokenAuth is not valid,
   * tries to renew both tokenAuth and refreshToken. Flags the user as
   * authenticated if one of these two operations succeeds, otherwise as
   * unauthenticated followed by a localStorage clear.
   */
  useEffect(() => {
    const tokenAuthValue = localStorage.getItem(
      LOCALSTORAGE_TOKEN_AUTH_KEY
    );
    const refreshTokenValue = localStorage.getItem(
      LOCALSTORAGE_REFRESH_TOKEN_KEY
    );

    let isValidTokenAuth = false;
    let isValidRefreshToken = false;

    (async function useEffectInner() {
      if (refreshTokenValue){
        if (tokenAuthValue) {
          const verifyResponse = await verifyTokenMutation(
            { variables: { token: tokenAuthValue }}
          );
          isValidTokenAuth = verifyResponse.data.success;
        }

        if (isValidTokenAuth) flagUserAsAuthenticated();

        else {
          isValidRefreshToken = tokensRenewal(refreshTokenValue);
          if (isValidRefreshToken) flagUserAsAuthenticated();
        }

      } else tokensClear();
    }())
  }, [
    flagUserAsAuthenticated,
    tokensClear,
    tokensRenewal,
    verifyTokenMutation,
  ]);


  // Conditional renders

  if (authenticationLoading) {
    return <h1>Please wait...</h1>;  // TODO: Insert loading component here

  } else if (userIsAuthenticated) {
    return children;

  } else {
    return (
      <div className="AuthenticationRequired">
        <LoginForm
          flagUserAsAuthenticated={ flagUserAsAuthenticated }
          setAuthenticationLoading={ setAuthenticationLoading }
          tokensClear={ tokensClear }
        />
      </div>
    );
  }
}


export default AuthenticationRequired;
