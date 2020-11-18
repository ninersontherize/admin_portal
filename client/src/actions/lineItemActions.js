import axios from "axios";
import keys from '../config/keys';

import {
  GET_ERRORS
} from "./types";

//get line_items
export const getLineItems = lineItemData => dispatch => {
  return axios
    .get(`${keys.ActionURL}/lineItems`)
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

//get line_items by vendor
export const getLineItemsByVendor = vendorData => dispatch => {
  return axios
    .get(`${keys.ActionURL}/lineItemsByVendor/`, {
      params: {
        vendor: vendorData.name,
        product_id: vendorData.product
      }
    })
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

//get line_items by product
export const getLineItemsByProduct = product => dispatch => {
  return axios
    .get(`${keys.ActionURL}/lineItemsByProduct/`, {
      params: {
        product: product,
      }
    })
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