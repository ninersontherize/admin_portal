const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const passport = require('passport');

const app = express();

const agencies = require('./routes/queries/agency');
const campaigns = require('./routes/queries/campaign');
const clients = require('./routes/queries/client');
const line_items = require('./routes/queries/line_item');
const products = require('./routes/queries/product');
const users = require('./routes/queries/user');
const vendors = require('./routes/queries/vendor');
const health = require('./routes/queries/health_check');
const port = process.env.PORT || 5000;

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(cors());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' })
});

app.use(passport.initialize());
require('./config/passport')(passport);

//agencies
app.get('/agencies', agencies.getAgencies);
app.get('/agencies/:id', agencies.getAgencyById);
app.post('/agencies', agencies.addAgency);
app.put('/agencies/:id', agencies.updateAgency);
app.delete('/agencies/:id', agencies.deleteAgency);

//campaigns
app.get('/campaigns', campaigns.getCampaigns);
app.get('/campaignsByProduct/:product_id', campaigns.getCampaignsByProduct);
app.get('/campaignsByFilter', campaigns.getCampaignsByFilter);
app.post('/campaigns', campaigns.addCampaign);
app.put('/campaigns/:id', campaigns.updateCampaign);
app.delete('/campaigns/:id', campaigns.deleteCampaign);

//clients
app.get('/clients', clients.getClients);
app.get('/clientsByProduct/:product_id', clients.getClientsByProduct);
app.get('/clientsByAgency/:agency_id', clients.getClientsByAgency);
app.get('/clients/:id', clients.getClientById);
app.post('/clients', clients.addClient);
app.put('/clients/:id', clients.updateClient);
app.delete('/clients/:id', clients.deleteClient);

//line_items
app.get('/lineItems', line_items.getLineItems);
app.get('/lineItemsByVendor', line_items.getLineItemsByVendor);
app.get('/lineItemsByProduct', line_items.getLineItemsByProduct);
app.get('/lineItems/:id', line_items.getLineItemById);
app.post('/lineItems', line_items.addLineItem);
app.put('/lineItems/:id', line_items.updateLineItem);
app.delete('/lineItems/:id', line_items.deleteLineItem);

//products
app.get('/products', products.getProducts);
app.get('/productsByClient/:client_id', products.getProductsByClient);
app.get('/productsByAgency/:agency_id', products.getProductsByAgency);
app.get('/products/:id', products.getProductById);
app.post('/products', products.addProduct);
app.put('/products/:id', products.updateProduct);
app.delete('/products/:id', products.deleteProduct);

//users
app.get('/users', users.getUsers);
app.get('/users/:id', users.getUserById);
app.post('/users/register', users.registerUser);
app.post('/users/validateToken', users.validateToken);
app.put('/users/updatePassword', users.updatePassword);
app.put('/users/forgotPassword', users.forgotPassword);
app.put('/users/:id', users.updateUser);
app.delete('/users/:id', users.deleteUser);
app.post('/users/login', users.login);

//vendors
app.get('/vendors', vendors.getVendors);
app.get('/vendorsByLineItem', vendors.getVendorByLineItem);
app.get('/vendorsByProduct', vendors.getVendorByProduct);
app.get('/vendors/:id', vendors.getVendorById);
app.post('/vendors', vendors.addVendor);
app.put('/vendors/:id', vendors.updateVendor);
app.delete('/vendors/:id', vendors.deleteVendor);

//health check
app.get('/health', health.healthCheck);

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
});