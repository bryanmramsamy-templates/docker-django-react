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
  const [verifyToken] = useMutation(VERIFY_TOKEN_MUTATION);
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
   * Renew both tokenAuth and refreshToken if the current refreshToken is valid.
   * Revoke the previous refreshToken when a new one is renewed.
   * @param {String} currentRefreshToken Current refreshToken to check
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
  }, [refreshTokenMutation, revokeTokenMutation, tokensClear]);

  // Effects

  // Refreshes the tokenAuth based on the user's refreshToken each interval
  useEffect(() => {

    /**
     * Refreshes the user's tokenAuth and refreshToken at each given interval if
     * the refreshToken is valid. Then revoke it when the new one is generated.
     *
     * Otherwise, clears the localStorage if the refreshToken is not valid or
     * undefined.
     *
     * @return {function} Interval clear callback function
     */
    const interval = setInterval(() => {
      (async function loop() {
        const refreshTokenValue = localStorage.getItem(
          LOCALSTORAGE_REFRESH_TOKEN_KEY);

        if (!refreshTokenValue) {
          tokensClear();
          console.log("No refreshToken found");  // DEBUG: to be removed
          return null;
        } else {
          tokensRenewal(refreshTokenValue);

          /*
          const refreshResponse = await refreshToken(
            { variables: {  refreshToken: refreshTokenValue }})

          if (refreshResponse.data.refreshToken.success === true) {
            localStorage.setItem(
              LOCALSTORAGE_TOKEN_AUTH_KEY,
              refreshResponse.data.refreshToken.token,
            );
            localStorage.setItem(
              LOCALSTORAGE_REFRESH_TOKEN_KEY,
              refreshResponse.data.refreshToken.refreshToken,
            );

            console.log("Token successfully refreshed");
          } else {
            localStorage.clear();
            setIsAuthenticated(false);
            setInitialLoading(false);
          }
          */
        }
      }())
    }, tokenRefreshInterval);

    return () => clearInterval(interval);
  }, [verifyToken, refreshTokenMutation, tokenRefreshInterval, revokeTokenMutation, tokensRenewal]);


  // Check sif
  useEffect(() =>{
    const tokenValue = localStorage.getItem(LOCALSTORAGE_TOKEN_AUTH_KEY);
    const refreshTokenValue = localStorage.getItem(LOCALSTORAGE_REFRESH_TOKEN_KEY);

/*
    const tokensVerifications = async () => {
      let isValid = false;


      if (tokenValue){
        const verifyResponse = await verifyToken({ variables: { token: tokenValue }});

        if (verifyResponse.data.success === true){
          isValid = true;
          console.log("tokenAuth valid");
        }
      }

      if (!isValid && refreshTokenValue){
        const refreshResponse = await refreshToken({ variables: {refreshToken: refreshTokenValue }});

        if (refreshResponse.data.success === true){
          isValid = true;
          console.log("refreshToken valid");
        }
      }


      if (isValid){
        localStorage.setItem(LOCALSTORAGE_TOKEN_AUTH_KEY, refreshResponse.data.refreshToken.token);
        localStorage.setItem(LOCALSTORAGE_REFRESH_TOKEN_KEY, refreshResponse.data.refreshToken.refreshToken);
      }
    }
    */




    let refreshResponse;

    if (tokenValue){
      (async function useEffectInner() {
        const verifyResponse = await verifyToken({ variables: { token: tokenValue }});
        if (verifyResponse.data.success === false) {
          localStorage.clear();
          setIsAuthenticated(false);
          setInitialLoading(false);
          return null;
        } else {
          const refreshResponse = await refreshTokenMutation({ variables: { refreshToken: refreshTokenValue }});
          if (refreshResponse.data.success === false){
            throw new Error(refreshResponse.data.errors);
          }

          localStorage.setItem(LOCALSTORAGE_TOKEN_AUTH_KEY, refreshResponse.data.refreshToken.token);
          localStorage.setItem(LOCALSTORAGE_REFRESH_TOKEN_KEY, refreshResponse.data.refreshToken.refreshToken);

          setIsAuthenticated(true);
          setInitialLoading(false);
        }})()
    } else {
      setIsAuthenticated(false);
      setInitialLoading(false);
    }
  }, [verifyToken, refreshTokenMutation, isAuthenticated]);


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
