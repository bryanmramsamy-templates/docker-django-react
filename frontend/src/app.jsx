import React, { useState } from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";

import ProtectedRoutes from "./routes/protected-routes";
import UnprotectedRoutes from "./routes/unprotected-routes";

import AuthenticationRequired
  from "./components/authentication/authentication-required";
import BaseContainer from "./components/base-container";


/**
 * Renders the main components of the app
 * @return The main components of the app
 */
const App = () => {
  const [userIsAuthenticated, setUserIsAuthenticated] = useState(false);


  return (
    <div className="App">
      <BrowserRouter>
        <BaseContainer userIsAuthenticated={ userIsAuthenticated }>
          <Routes>

            <Route path="/home">  {/* TODO: Change path name */}
              <UnprotectedRoutes />
            </Route>

            <Route path="/protected">  {/* TODO: Change path name */}
              <AuthenticationRequired
                tokenRefreshInterval={ 1000 * 60 * 4 }
                setUserIsAuthenticated={ setUserIsAuthenticated }
                userIsAuthenticated={ userIsAuthenticated }>
                <ProtectedRoutes/>
              </AuthenticationRequired>
            </Route>

          </Routes>
        </BaseContainer>
      </BrowserRouter>
    </div>
  );
}


export default App;
