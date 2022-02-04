import { useReducer, useState } from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";

import ProtectedRoutes from "./routes/protected-routes";
import UnprotectedRoutes from "./routes/unprotected-routes";

import AuthenticationRequired
  from "./components/authentication/authentication-required";
import BaseContainer from "./components/base-container";

import { initialUserState, userReducer } from './reducers/authentication';
import { UserContext } from './contexts/authentication';


/**
 * Renders the main components of the app
 * @return The main components of the app
 */
const App = () => {
  const [userState, userDispatch] = useReducer(userReducer, initialUserState)

  const [userIsAuthenticated, setUserIsAuthenticated] = useState(false);


  return (
    <div className="App">
      <BrowserRouter>
        <UserContext.Provider value={ userState }>
          <BaseContainer userIsAuthenticated={ userIsAuthenticated }>
            <Routes>

              <Route  // TODO: Change path name
                path="/home/*"
                element={ <UnprotectedRoutes /> }
              />

              <Route // TODO: Change path name
                path="/protected/*"
                element={
                  <AuthenticationRequired
                    tokenRefreshInterval={ 1000 * 60 * 4 }
                    setUserIsAuthenticated={ setUserIsAuthenticated }
                    userIsAuthenticated={ userIsAuthenticated }
                  >
                    <ProtectedRoutes/>
                  </AuthenticationRequired>
                }
              />

            </Routes>
          </BaseContainer>
        </UserContext.Provider>
      </BrowserRouter>
    </div>
  );
}


export default App;
