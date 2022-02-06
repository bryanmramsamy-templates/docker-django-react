import { useState } from "react";
import ExampleNav from './example-nav';

import { UserAuthenticationStateContext } from "../../contexts/authentication";

/**
 * Main wrapper container.
 *
 * Should contain every components visible on every page.
 * @param {Object} children Children components
 * @return Renders the base container and its children
 */
const BaseContainer = ({ children }) => {
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
        <ExampleNav/>
        { children }
      </UserAuthenticationStateContext.Provider>
    </div>
  );
}


export default BaseContainer;
