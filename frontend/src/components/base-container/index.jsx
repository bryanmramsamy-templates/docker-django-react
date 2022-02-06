import { useState } from "react";
import Nav from './nav';

import { UserAuthenticationStateContext } from "../../contexts/authentication";

/**
 * Main wrapper container.
 *
 * Should contain every components visible on every page.
 * @param {*} children Children components
 * @param {boolean} userIsAuthenticated True if the user is authenticated.
 * @return Renders the base container and its children
 */
const BaseContainer = ({ children, userIsAuthenticated }) => {
  // State
  const [isAuthenticated, setAuthenticated] = useState(false);

  // Render
  return (
    <div className="BaseContainer">
      <UserAuthenticationStateContext.Provider value={{
          isAuthenticated: isAuthenticated,
          setAuthenticated: setAuthenticated,
        }}
      >
        <Nav userIsAuthenticated={ userIsAuthenticated }/>
        { children }
      </UserAuthenticationStateContext.Provider>
    </div>
  );
}


export default BaseContainer;
