import React from 'react';
import Nav from './nav';


/**
 * Main wrapper container.
 *
 * Should contain every components visible on every page.
 * @param {*} children Children components
 * @param {boolean} userIsAuthenticated True if the user is authenticated.
 * @return Renders the base container and its children
 */
const BaseContainer = ({ children, userIsAuthenticated }) => {
  return (
    <div className="BaseContainer">
      <Nav userIsAuthenticated={ userIsAuthenticated }/>
      { children }
    </div>
  );
}


export default BaseContainer;
