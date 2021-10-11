import React, { useEffect } from 'react';
import { useQuery } from "@apollo/client";

import { ME } from "../../api/authentication/me";

import LogoutButton from "../authentication/authentication-required/logout-button";


const Nav = ({ userIsAuthenticated }) => {
  const { data, loading, errors, refetch } = useQuery(ME);

  useEffect(() => refetch(), [refetch, userIsAuthenticated]);


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
