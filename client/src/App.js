import React, { useEffect, createContext, useReducer, useContext } from "react";
import "./App.css";
import { BrowserRouter, Route, Switch, useHistory } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./screens/Home";
import Login from "./screens/Login";
import Profile from "./screens/Profile";
import Signup from "./screens/Signup";
import UserProfile from "./screens/UserProfile";
import Explore from "./screens/Explore";
import { initialState, reducer } from "./reducers/UserReducer";
import * as axios from "axios";

axios.defaults.headers.common["Authorization"] =
  "Bearer" + localStorage.getItem("jwt");
axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.headers.put["Content-Type"] = "application/json";

export const Usercontext = createContext();

const Routing = () => {
  const history = useHistory();
  const { state, dispatch } = useContext(Usercontext);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      dispatch({ type: "USER", payload: user });
      // history.push('/')
    } else {
      history.push("/login");
    }
  }, []);
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route path="/login">
        <Login />
      </Route>
      <Route path="/signup">
        <Signup />
      </Route>
      <Route exact path="/profile">
        <Profile />
      </Route>
      <Route path="/profile/:userid">
        <UserProfile />
      </Route>
      <Route path="/explore">
        <Explore />
      </Route>
    </Switch>
  );
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <Usercontext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <Navbar />
        <Routing />
      </BrowserRouter>
    </Usercontext.Provider>
  );
}

export default App;
