import React, { useEffect } from 'react';
import { useQuery } from "@apollo/client";

import { ME } from "../../api/authentication/me";

import LogoutButton from "../authentication/authentication-required/logout-button";


// NOTE: This is an example component !

/*
 * userIsAuthenticated is a required prop
 */


/**
 * Navigation component which gives the user information if logged in and a
 * LogoutButton component.
 * @param {boolean} userIsAuthenticated True if the user is authenticated.
 * @returns Renders the Nav component
 */
const Nav = ({ userIsAuthenticated }) => {
  // Authentication query

  const { data, loading, errors, refetch } = useQuery(ME);


  // Effect

  /**
   * Refetch the user information when the authentication flag changes
   */
  useEffect(() => refetch(), [refetch, userIsAuthenticated]);


  // Conditional renders

  if (loading) return "User is loading...";
  if (errors) console.log(errors);


  return (
    <div className="Nav">
      <br />
      { JSON.stringify(data, null, 2) }
      <br />
      { userIsAuthenticated ? <LogoutButton/> : ""}
    </div>
  )
}


export default Nav;
