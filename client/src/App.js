import React from "react";
import LandingPage from "./pages/LandingPage";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import TaskPage from "./pages/TaskPage";
import ProfilePage from "./pages/ProfilePage";
import SignUp from "./components/Auth/sign up/SignUp";
import Login from "./components/Auth/login /Login";
import { Route, Switch } from "react-router-dom";
import NotificationChecker from "./components/Nav/NotificationChecker";
const App = () => {
  return (
    <div>
      <Switch>
        <Route exact path="/" component={LandingPage} />
        <Route path="/signup" component={SignUp} />
        <Route path="/login" component={Login} />
        <Route path="/home" component={HomePage} />
        <Route path="/dashboards" component={DashboardPage} />
        <Route path="/notifications" element={<NotificationChecker />} />
        <Route path="/tasks/:id" component={TaskPage} />
        <Route path="/profile" component={ProfilePage} />
      </Switch>
    </div>
  );
};

export default App;
