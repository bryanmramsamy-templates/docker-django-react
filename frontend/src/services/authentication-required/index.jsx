import React, { useCallback, useEffect, useState } from 'react';
import { useMutation } from "@apollo/client";

import {
  REFRESH_TOKEN_MUTATION,
  REVOKE_TOKEN_MUTATION,
  TOKEN_AUTH_MUTATION,
  VERIFY_TOKEN_MUTATION
} from '../../hooks/authentication/auth-token-mutations';


const appName = process.env.REACT_APP_NAME;

export const LOCALSTORAGE_TOKEN_AUTH_KEY = `${ appName }.tokenAuth`;
export const LOCALSTORAGE_REFRESH_TOKEN_KEY = `${ appName }.refreshToken`;


export const AuthenticationRequired = ({ children, tokenRefreshInterval }) => {
  // Authentication mutations

  const [tokenAuth] = useMutation(TOKEN_AUTH_MUTATION);
  const [verifyTokenMutation] = useMutation(VERIFY_TOKEN_MUTATION);
  const [refreshTokenMutation] = useMutation(REFRESH_TOKEN_MUTATION);
  const [revokeTokenMutation] = useMutation(REVOKE_TOKEN_MUTATION);


  // States

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);


  // CallBacks

  /**
   * Clears the localStorage from all tokens and flags the user as
   * unauthenticated.
   */
  const tokensClear = useCallback(() => {
    localStorage.clear();

    setIsAuthenticated(false);
    setInitialLoading(false);

    console.log("User has been signed out");  // DEBUG: to be removed
  }, []);

  /**
   * Flag the user as authenticated.
   */
  const flagUserAsAuthenticated = useCallback(() => {
    setIsAuthenticated(true);
    setInitialLoading(false);
  }, []);

  /**
   * Renew both tokenAuth and refreshToken if the current refreshToken is valid.
   * Revoke the previous refreshToken when a new one is renewed.
   * @param {String} currentRefreshToken Current refreshToken to check
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

      if (revokeTokenResponse.data.revokeToken.success) {
        hasSucceeded = true;
        console.log("Tokens successfully refreshed");  // DEBUG: to be removed
      }
    }

    if (!hasSucceeded) {  // FIXME: ternary
      tokensClear()
      console.log("Token has not successfully been refreshed");  // DEBUG: to be removed
    }

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
          console.log("No refreshToken found");  // DEBUG: to be removed
          return null;

        } else {
          tokensRenewal(refreshTokenValue);
        }
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
      if (tokenAuthValue && refreshTokenValue){
        const verifyResponse = await verifyTokenMutation(
          { variables: { token: tokenAuthValue }}
        );
        isValidTokenAuth = verifyResponse.data.success;

        if (isValidTokenAuth){
          flagUserAsAuthenticated();

          console.log("User successfully logged in");  // DEBUG: to be removed

        } else {
          isValidRefreshToken = tokensRenewal(refreshTokenValue);
          if (isValidRefreshToken) {
            flagUserAsAuthenticated();

            console.log("User successfully logged in");  // DEBUG: to be removed
          }
        }
      } else {
        tokensClear();
        console.log("tokenAuth and/or refreshToken not found");  // DEBUG: to be removed
      }
    }())
  }, [
    flagUserAsAuthenticated,
    tokensClear,
    tokensRenewal,
    verifyTokenMutation,
  ]);


  // Conditional renders

  if (initialLoading) return <h1>loading...initialLoading</h1>;
  if (isAuthenticated) return children;

  return (
    <div className="AuthenticationRequired">
      <form>
        <input type="text" name="username" id="username" value={ username } onChange={ (event) => setUsername(event.target.value) } />
        <input type="password" name="password" id="password" value={ password } onChange={ (event) => setPassword(event.target.value)}/>
        <input type="submit" value="submit" onClick={
          (event) => {
            event.preventDefault();
            setInitialLoading(true);
            tokenAuth({variables:{username, password,}})
              .then(response => {
                const { token, refreshToken, errors } = response.data.tokenAuth
                if (!errors) {
                  localStorage.setItem(LOCALSTORAGE_TOKEN_AUTH_KEY, token)
                  localStorage.setItem(LOCALSTORAGE_REFRESH_TOKEN_KEY, refreshToken)
                  setInitialLoading(false)
                  setIsAuthenticated(true)
                } else {
                  console.log(errors);
                  window.alert(errors.nonFieldErrors.map(nonFieldError => nonFieldError.message))
                  localStorage.clear();
                  setInitialLoading(false);
                  setIsAuthenticated(false)
                }
              }).catch(reason => {
                window.alert("ERROR", reason)
                setInitialLoading(false)
                setIsAuthenticated(false)
                throw reason
              })
          }
        }/>
      </form>
    </div>
  );
}
