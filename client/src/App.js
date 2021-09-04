import "./App.css";
import React from "react";
import { Login, Home, Account, Filter, ErrorPage } from "./components";
import { useSelector, useDispatch } from "react-redux";
import { signIn } from "./actions";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function App() {
  const isLoggedIn = useSelector((state) => state.authDetails.isLoggedIn);
  const currentTheme = useSelector((state) => state.themeDetails.theme);
  const dispatch = useDispatch();
  if (localStorage.getItem("userId") && localStorage.getItem("userId") !== "") {
    dispatch(signIn(localStorage.getItem("userId")));
  }

  return (
    <div className={currentTheme}>
      <Router>
        <Switch>
          <Route path="/" exact>
            <Login />
          </Route>
          {isLoggedIn ? (
            <Route path="/Home" exact>
              <Home />
            </Route>
          ) : (
            <ErrorPage />
          )}
          {isLoggedIn ? (
            <Route path="/Filter" exact>
              <Filter />
            </Route>
          ) : (
            <ErrorPage />
          )}
          {isLoggedIn ? (
            <Route path="/Account" exact>
              <Account />
            </Route>
          ) : (
            <ErrorPage />
          )}
        </Switch>
      </Router>
    </div>
  );
}

export default App;
