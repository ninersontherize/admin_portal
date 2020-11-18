import axios from 'axios';
import keys from '../config/keys';

import {
  GET_ERRORS
} from './types';


// AddClient
export const addClient = (clientData, history) => dispatch => {
  axios
    .post(`${keys.ActionURL}/clients`, clientData)
    .then(res => history.push('/adminDashboard'))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

//get clients
export const getClients = clientData => dispatch => {
  return axios
    .get(`${keys.ActionURL}/clients`)
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

//get clients by productid
export const getClientsByProduct = product_id => dispatch => {
  return axios
    .get(`${keys.ActionURL}/clientsByProduct/${product_id}`)
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

//get clients by agencyid
export const getClientsByAgency = agency_id => dispatch => {
  return axios
    .get(`${keys.ActionURL}/clientsByAgency/${agency_id}`)
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

// AddClient
export const newClient = clientData => dispatch => {
  return axios
    .post(`${keys.ActionURL}/clients`, clientData)
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

//update clients
export const updateClient = (id, clientData) => dispatch => {
  return axios
    .put(`${keys.ActionURL}/clients/${id}`, clientData)
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

//delete client by id
export const deleteClientById = id => dispatch => {
  return axios
    .delete(`${keys.ActionURL}/clients/${id}`)
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