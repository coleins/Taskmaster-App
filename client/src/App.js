import React from "react";
import { Switch, Route, Link } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import TaskPage from "./pages/TaskPage";
import ProfilePage from "./pages/ProfilePage";

const App = () => {
  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/dashboards">Dashboards</Link>
          </li>
          <li>
            <Link to="/profile">Profile</Link>
          </li>
        </ul>
      </nav>

      <Switch>
        <Route exact path="/" component={LandingPage} />
        <Route path="/home" component={HomePage} />
        <Route path="/dashboards" component={DashboardPage} />
        <Route path="/tasks/:id" component={TaskPage} />
        <Route path="/profile" component={ProfilePage} />
      </Switch>
    </div>
  );
};

export default App;
