import { BrowserRouter, Route, Switch } from "react-router-dom";

import './app.css';
import AuthenticationRequired
  from "./components/authentication/authentication-required";
import { TestQueries } from "./test-query";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
           <TestQueries/>
        <Switch>
          <Route path="/q">
            <h1>Not protected</h1>
          </Route>
          <AuthenticationRequired tokenRefreshInterval={ 1000 * 60 * 4 }>
              <Route path="/t">
                <h1>Protected</h1>
              </Route>
              <Route path="/y">
                <h1>Protected too</h1>
              </Route>
          </AuthenticationRequired>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;



/*

      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
*/