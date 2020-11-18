import axios from 'axios';
import keys from '../config/keys';

import {
  GET_ERRORS
} from './types';

//get users
export const getUsers = userData => dispatch => {
  return axios
    .get(`${keys.ActionURL}/users`)
    .then(res => {
      return res.data;
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

//update users
export const updateUser = (id, userData) => dispatch => {
  return axios
    .put(`${keys.ActionURL}/users/${id}`, userData)
    .then(res => {
      return res.data;
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

//delete user by id
export const deleteUserById = id => dispatch => {
  return axios
    .delete(`${keys.ActionURL}/users/${id}`)
    .then(res => {
      return res.data;
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};