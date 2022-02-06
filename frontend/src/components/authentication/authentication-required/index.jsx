import { useCallback, useEffect, useState } from 'react';
import { useMutation } from "@apollo/client";

import { REFRESH_TOKEN_MUTATION, REVOKE_TOKEN_MUTATION }
  from '../../../api/authentication/auth-token-mutations';

import LoginForm from './login-form';


// Env variables
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
 * @param {Object} children Children protected components
 * @param {Number} tokenRefreshInterval Tokens renew interval in milliseconds.
 * Default value is set to 4 minutes.
 * @param {Function} setUserIsAuthenticated Set user authentication status.
 * @param {Boolean} userIsAuthenticated True if the user is authenticated.
 * @return The protected content if the user is authenticated, otherwise a login
 * form
 */
const AuthenticationRequired = ({
  children,
  tokenRefreshInterval = 1000 * 60 * 4,
  setUserIsAuthenticated,
  userIsAuthenticated
}) => {

  // Authentication mutations
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
   * If the current user's refreshToken is valid, renew both authToken and
   * refreshToken, then revoke previous refreshToken.
   * @param {String} currentRefreshToken Current refreshToken to check
   * @return {Boolean} True if both tokens successfully renewed
   */
  const tokensRenewal = useCallback(async (currentRefreshToken) => {
    let success = false;
    let error = null;

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

      const revokeTokenResponse = await revokeTokenMutation({ variables: {
        refreshToken: currentRefreshToken
      }});
      success = revokeTokenResponse.data.revokeToken.success ? true : false;
      if(!success) error = revokeTokenResponse.data.revokeToken.error;

    } else error = refreshTokenResponse.data.revokeToken.error;

    if (!success){
      // DEBUG: Error must be handled
      console.log(error);

      authenticationDispatch.tokensClear();
    }
    return success;
  }, []);


  const authenticationDispatch
    = { tokensClear, flagUserAsAuthenticated, tokensRenewal };

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
  }, []);

  /**
   * Set the user as authenticated if one's refreshToken is valid, otherwise
   * clear the saved tokens.
   */
  useEffect(() => {
    const refreshToken= localStorage.getItem(
      LOCALSTORAGE_REFRESH_TOKEN_KEY
    );

    if (refreshToken){
      if (tokensRenewal(refreshToken))
        authenticationDispatch.flagUserAsAuthenticated();
    } else authenticationDispatch.tokensClear();
  }, []);


  // Conditional renders

  if (authenticationLoading) {
    return <h1>Please wait...</h1>;  // TODO: Insert loading component here

  } else if (userIsAuthenticated) {
    return children;

  } else {
    return (
      <div className="AuthenticationRequired">
        <LoginForm
          authenticationDispatch={ authenticationDispatch }
          setAuthenticationLoading={ setAuthenticationLoading }
        />
      </div>
    );
  }
}


export default AuthenticationRequired;
