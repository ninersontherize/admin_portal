import axios from 'axios';
import keys from '../config/keys';

import {
  GET_ERRORS
} from './types';


// AddProduct
export const addProduct = (productData, history) => dispatch => {
  axios
    .post(`${keys.ActionURL}/products`, productData)
    .then(res => history.push('/adminDashboard'))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

//get products
export const getProducts = productData => dispatch => {
  return axios
    .get(`${keys.ActionURL}/products`)
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

//get products by clientid
export const getProductsByClient = client_id => dispatch => {
  return axios
    .get(`${keys.ActionURL}/productsByClient/${client_id}`)
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

//get products by agencyid
export const getProductsByAgency = agency_id => dispatch => {
  return axios
    .get(`${keys.ActionURL}/productsbyAgency/${agency_id}`)
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

// AddProduct
export const newProduct = productData => dispatch => {
  return axios
    .post(`${keys.ActionURL}/products`, productData)
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

//update products
export const updateProduct = (id, productData) => dispatch => {
  return axios
    .put(`${keys.ActionURL}/products/${id}`, productData)
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

//delete product by id
export const deleteProductById = id => dispatch => {
  return axios
    .delete(`${keys.ActionURL}/products/${id}`)
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