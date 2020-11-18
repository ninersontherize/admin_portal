import axios from 'axios';
import keys from '../config/keys';

import {
  GET_ERRORS
} from './types';

// AddAgency
export const addAgency = (agencyData, history) => dispatch => {
  axios
    .post(`${keys.ActionURL}/agencies`, agencyData)
    .then(res => history.push('/adminDashboard'))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// AddAgency
export const newAgency = agencyData => dispatch => {
  return axios
    .post(`${keys.ActionURL}/agencies`, agencyData)
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

//update agencies
export const updateAgency = (id, agencyData) => dispatch => {
  return axios
    .put(`${keys.ActionURL}/agencies/${id}`, agencyData)
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

//delete agency by id
export const deleteAgencyById = id => dispatch => {
  return axios
    .delete(`${keys.ActionURL}/agencies/${id}`)
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

//get agencies
export const getAgencies = agencyData => dispatch => {
  return axios
    .get(`${keys.ActionURL}/agencies`)
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

