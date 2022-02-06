import { useReducer, useState } from 'react';
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
  return (
    <div className="App">
      <BrowserRouter>
        <BaseContainer>
          <Routes>
            <Route  // TODO: Change path name
              path="/home/*"
              element={ <UnprotectedRoutes /> }
            />

            <Route // TODO: Change path name
              path="/protected/*"
              element={
                <AuthenticationRequired tokenRefreshInterval={ 1000 * 60 * 4 }>
                  <ProtectedRoutes/>
                </AuthenticationRequired>
              }
            />
          </Routes>
        </BaseContainer>
      </BrowserRouter>
    </div>
  );
}


export default App;
