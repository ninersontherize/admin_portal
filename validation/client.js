const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateClientInput(data) {
  let errors = {};
  
  // Convert empty fields to an empty string so we can use validator functions
  data.name = !isEmpty(data.name) ? data.name : "";
  data.agency = !isEmpty(data.agency) ? data.agency : "";
  
  // Name checks
  if (Validator.isEmpty(data.name)) {
    errors.name = "Client Name field is required";
  }

  // Agency checks
  if (Validator.isEmpty(data.agency)) {
    errors.client = "Agency field is required";
  }
  
  return {
    errors,
    isValid: isEmpty(errors)
  };
};