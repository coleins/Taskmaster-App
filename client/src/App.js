import React from "react";
import LandingPage from "./pages/LandingPage";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import TaskPage from "./pages/TaskPage";
import ProfilePage from "./pages/ProfilePage";
import SignUp from "./components/Auth/SignUp/SignUp";
import Login from "./components/Auth/Login/Login";
import { Route, Switch } from "react-router-dom";
import NotificationChecker from "./components/Nav/NotificationChecker";
import User from "./components/Nav/User";
import Inbox from "./pages/Inbox";
import Timer from "./components/Nav/Timer"


const App = () => {
  return (
    <div>
      <Switch>
        <Route exact path="/" component={LandingPage} />
        <Route path="/signup" component={SignUp} />
        <Route path="/login" component={Login} />
        <Route path="/home" component={HomePage} />
        <Route path="/timer" component={Timer}/>
        <Route path="/dashboards" component={DashboardPage} />
        <Route path="/notifications" element={<NotificationChecker />} />
        <Route path="/tasks/:id" component={TaskPage} />
        <Route path="/profile" component={ProfilePage} />
        <Route path="/user" component={User} />
        <Route path="/inbox" component={Inbox} />
      </Switch>
    </div>
  );
};

export default App;
