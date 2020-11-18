import axios from "axios";
import keys from '../config/keys';

import {
  GET_ERRORS
} from "./types";

//update campaigns
export const updateCampaign = (id, campaignData) => dispatch => {
  return axios
    .put(`${keys.ActionURL}/campaigns/${id}`, campaignData)
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

//get campaigns by filter
export const getCampaignsByFilter = (start_date, end_date, product_id, agency_id) => dispatch => {
  return axios
    .get(`${keys.ActionURL}/campaignsByFilter`, {
      params: {
        start_date: start_date,
        end_date: end_date,
        product_id: product_id,
        agency_id: agency_id
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

//delete campaign by id
export const deleteCampaignById = id => dispatch => {
  return axios
    .delete(`${keys.ActionURL}/campaigns/${id}`)
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

//create new campaign
export const createCampaign = campaignData => dispatch => {
  return axios
    .post(`${keys.ActionURL}/campaigns`, campaignData)
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
