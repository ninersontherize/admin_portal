const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateCampaignUpdateInput(data) {
  let errors = {};

  //check for undefined and set to empty to trigger missing error
  if (data.line_item === undefined) {
    data['line_item'] = '';
  }
  
  if (data.start_date === undefined) {
    data['start_date'] = '';
  }
  
  if (data.end_date === undefined) {
    data['end_date'] = '';
  }
  
  if (data.planned_cpm === undefined) {
    data['planned_cpm'] = '';
  }
  
  if (data.planned_impressions === undefined) {
    data['planned_impressions'] = '';
  }
  
  if (data.planned_budget === undefined) {
    data['planned_budget'] = '';
  } 

  if (data.actual_cpm === undefined) {
    data['actual_cpm'] = '';
  }

  if (data.actual_impressions === undefined) {
    data['actual_impressions'] = '';
  }
  
  // Convert empty fields to an empty string so we can use validator functions
  data.line_item_id = !isEmpty(data.line_item) ? data.line_item : "";
  data.start_date = !isEmpty(data.start_date) ? data.start_date : "";
  data.end_date = !isEmpty(data.end_date) ? data.end_date : "";
  data.planned_cpm = !isEmpty(data.planned_cpm) ? data.planned_cpm : "";
  data.planned_impressions = !isEmpty(data.planned_impressions) ? data.planned_impressions : "";
  data.planned_budget = !isEmpty(data.planned_budget) ? data.planned_budget : "";
  data.actual_cpm = !isEmpty(data.actual_cpm) ? data.actual_cpm : "";
  data.actual_impressions = !isEmpty(data.actual_impressions) ? data.actual_impressions : "";
  
  // checks for empty fields in NOT NULL columns
  if (Validator.isEmpty(data.line_item)) {
    errors.line_item = "Line Item was not selected";
  }

  if (Validator.isEmpty(data.start_date)) {
    errors.start_date = "Start Date is required";
  }

  if (Validator.isEmpty(data.end_date)) {
    errors.end_date = "End Date is required";
  }  

  if (Validator.isEmpty(data.planned_cpm.toString())) {
    errors.planned_cpm = "Planned CPM must be filled";
  } else if (data.planned_cpm < 0) {
    errors.planned_cpm = "Planned CPM must be a positive number";
  }

  if (Validator.isEmpty(data.planned_impressions.toString())) {
    errors.planned_impressions = "Planned Impressions must be filled";
  } else if (data.planned_impressions < 0) {
    errors.planned_impressions = "Planned Impressions must be a positive number";
  }

  if (Validator.isEmpty(data.planned_budget.toString())) {
    errors.planned_budget = "Planned Budget must be filled";
  } else if (data.planned_budget < 0) {
    errors.planned_budget = "Planned Budget must be a positive number";
  }

  if (!Validator.isEmpty(data.actual_cpm.toString()) && data.actual_cpm < 0) {
    errors.actual_cpm = "Actual CPM must be a positive number";
  }

  if (!Validator.isEmpty(data.actual_impressions.toString()) && data.actual_impressions < 0) {
    errors.actual_cpm = "Actual Impressions must be a positive number";
  }
  
  return {
    errors,
    isValid: isEmpty(errors)
  };
};