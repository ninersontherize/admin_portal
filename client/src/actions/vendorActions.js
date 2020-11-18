import axios from "axios";
import keys from '../config/keys';

import {
  GET_ERRORS
} from "./types";

//get vendors
export const getVendors = vendorData => dispatch => {
  return axios
    .get(`${keys.ActionURL}/vendors`)
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

//get vendors
export const getVendorByLineItem = lineItemData => dispatch => {
  return axios
    .get(`${keys.ActionURL}/vendorsByLineItem`, {
      params: {
        line_item: lineItemData.name,
        product_id: lineItemData.product
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

//get vendors by Product
export const getVendorByProduct = productData => dispatch => {
  return axios
    .get(`${keys.ActionURL}/vendorsByProduct`, {
      params: {
        product: productData,
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