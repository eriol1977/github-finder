import React, { Fragment, useState } from 'react';
import './App.css';
import Navbar from './components/layout/Navbar';
import Users from './components/users/Users';
import axios from 'axios';
import Search from './components/users/Search';
import { Alert } from './components/layout/Alert';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { About } from './components/pages/About';
import User from './components/users/User';
import GithubState from './context/github/GithubState';

const App = () => {
  const [repos, setRepos] = useState([]);
  const [alert, setAlert] = useState(null);

  const authHeader = {
    headers: {
      Authorization:
        'Basic ' +
        btoa(
          process.env.REACT_APP_GITHUB_CLIENT_ID +
            ':' +
            process.env.REACT_APP_GITHUB_CLIENT_SECRET
        ),
    },
  };

  const getUserRepos = async (username) => {
    //setLoading(true);
    const res = await axios.get(
      `https://api.github.com/users/${username}/repos?per_page=5&sort=created:asc`,
      authHeader
    );
    //setLoading(false);
    setRepos(res.data);
  };

  const showAlert = (msg, type) => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 3000);
  };

  return (
    <GithubState>
      <Router>
        <div className='App'>
          <Navbar />
          <div className='container'>
            <Alert alert={alert} />
            <Switch>
              <Route
                exact
                path='/'
                render={(props) => (
                  <Fragment>
                    <Search setAlert={showAlert} />
                    <Users />
                  </Fragment>
                )}
              />
              <Route exact path='/about' component={About} />
              <Route
                exact
                path='/user/:login'
                render={(props) => (
                  <User {...props} getUserRepos={getUserRepos} repos={repos} />
                )}
              />
            </Switch>
          </div>
        </div>
      </Router>
    </GithubState>
  );
};

export default App;
