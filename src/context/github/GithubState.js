import React, { useReducer } from 'react';
import axios from 'axios';
import GithubContext from './githubContext';
import GithubReducer from './githubReducer';
import {
  SEARCH_USERS,
  SET_LOADING,
  CLEAR_USERS,
  GET_USER,
  GET_REPOS,
} from '../types';

const GithubState = (props) => {
  const initialState = {
    users: [],
    user: {},
    repos: [],
    loading: false,
  };

  const [state, dispatch] = useReducer(GithubReducer, initialState);

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

  const searchUsers = async (text) => {
    setLoading();

    const res = await axios.get(
      `https://api.github.com/search/users?q=${text}`,
      authHeader
    );

    dispatch({
      type: SEARCH_USERS,
      payload: res.data.items,
    });
  };

  const getUser = async (username) => {
    setLoading();
    const res = await axios.get(
      `https://api.github.com/users/${username}`,
      authHeader
    );
    dispatch({
      type: GET_USER,
      payload: res.data,
    });
  };

  const clearUsers = () => dispatch({ type: CLEAR_USERS });

  const setLoading = () => dispatch({ type: SET_LOADING });

  return (
    <GithubContext.Provider
      value={{
        users: state.users,
        user: state.user,
        repos: state.repos,
        loading: state.loading,
        searchUsers,
        clearUsers,
        getUser,
      }}
    >
      {props.children}
    </GithubContext.Provider>
  );
};

export default GithubState;
