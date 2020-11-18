const proxy = require("http-proxy-middleware");

module.exports = function(app) {
  app.use(
    proxy([
            "/users/register",
            "/users/login", 
            "/agencies",
            "/campaigns",
            "campaignsByFilter",
            "/campaigns",
            "/clients",
            "/clientsByProduct",
            "/clientsByAgency",
            "/lineItems",
            "/lineItemsByVendor",
            "/lineItemsByProduct",
            "/products",
            "/productsByClient",
            "/productsByAgency",
            "/vendors",
            "/vendorsByLineItem",
            "/vendorsByProduct"
          ], //{ target: "http://localhost:5000" })
             { target: "http://spendapp-157772191.us-west-1.elb.amazonaws.com:5000" })
  );
};