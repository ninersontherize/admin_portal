const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateProductInput(data) {
  let errors = {};
  
  // Convert empty fields to an empty string so we can use validator functions
  data.name = !isEmpty(data.name) ? data.name : "";
  data.client_id = !isEmpty(data.client) ? data.client : "";
  data.schema_name = !isEmpty(data.schema_name) ? data.schema_name : "";
  
  // Name check
  if (Validator.isEmpty(data.name)) {
    errors.name = "Name field is required";
  }

  // Client check
  if (Validator.isEmpty(data.client)) {
    errors.client = "Client field is required";
  }
  
  // Schema Name check
  if (Validator.isEmpty(data.schema_name)) {
    errors.schema_name = "Schema Name field is required";
  }
  
  return {
    errors,
    isValid: isEmpty(errors)
  };
};