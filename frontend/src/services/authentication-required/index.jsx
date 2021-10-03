import React, { useEffect, useState } from 'react';
import { useMutation } from "@apollo/client";

import {
  REFRESH_TOKEN_MUTATION,
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

  const [refreshToken] = useMutation(REFRESH_TOKEN_MUTATION);


  // States

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);


  // Effects

  // Refreshes the tokenAuth based on the user's refreshToken each interval
  useEffect(() => {

    /**
     * Refreshes the user's tokenAuth each interval if one has a valid
     * refreshToken stored in its localStorage, otherwise sets the user as
     * unauthenticated.
     *
     * @return {function} Interval clear callback function
     */
    const interval = setInterval(() => {
      (async function loop() {
        const refreshTokenValue = localStorage.getItem(
          LOCALSTORAGE_REFRESH_TOKEN_KEY);

        if (!refreshTokenValue) {
          console.log("No refreshToken found");
          localStorage.clear();
          setIsAuthenticated(false);
          setInitialLoading(false);
          return null;
        } else {
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
        }
      }())
    }, tokenRefreshInterval);

    return () => clearInterval(interval);
  }, [verifyToken, refreshToken, tokenRefreshInterval]);


  useEffect(() =>{
    const tokenValue = localStorage.getItem(LOCALSTORAGE_TOKEN_AUTH_KEY);
    const refreshTokenValue = localStorage.getItem(LOCALSTORAGE_REFRESH_TOKEN_KEY);

    if (tokenValue && refreshTokenValue){
      (async function useEffectInner() {
        const verifyResponse = await verifyToken({ variables: { token: tokenValue }});
        if (verifyResponse.data.success === false) {
          localStorage.clear();
          setIsAuthenticated(false);
          setInitialLoading(false);
          return null;
        } else {
          const refreshResponse = await refreshToken({ variables: { refreshToken: refreshTokenValue }});
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
  }, [verifyToken, refreshToken, isAuthenticated]);


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
