import { useContext, useEffect } from 'react';
import { useQuery } from "@apollo/client";

import { ME } from "../../api/authentication/me";

import LogoutButton from "../authentication/authentication-required/logout-button";

import { UserAuthenticationStateContext } from '../../contexts/authentication';


// NOTE: This is an example component !

/*
 * userIsAuthenticated is a required prop
 */


/**
 * Navigation component which gives the user information if logged in and a
 * LogoutButton component.
 * @returns Renders the Nav component
 */
const Nav = () => {
  // Authentication query
  const { data, loading, errors, refetch } = useQuery(ME);

  // Context
  const userAuthenticationState = useContext(UserAuthenticationStateContext);

  // Effect
  /**
   * Refetch the user information when the authentication flag changes
   */
  useEffect(() => refetch(), [refetch, userAuthenticationState.isAuthenticated]);

  // Conditional renders
  if (loading) return "User is loading...";
  if (errors) console.log(errors);

  return (
    <div className="Nav">
      <br />
      { JSON.stringify(data, null, 2) }
      <br />
      { userAuthenticationState.isAuthenticated ? <LogoutButton/> : ""}
    </div>
  )
}


export default Nav;
