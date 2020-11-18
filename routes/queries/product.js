const keys = require('../../config/keys.js');
const log_handler = require('./log_handler');

// Load input validation
const validateProductInput = require('../../validation/product');

async function getProducts(req, res) {
  try {

    //get all products and return on success
    const results = await keys.pool.query('select p.id, p.name, p.client_id, c.name as client, p.schema_name from app.product p join app.client c on p.client_id = c.id order by p.id asc');
    res.status(200).json(results.rows);

  } catch (error) {
    log_handler.sendErrorMessage(error.message);
    res.status(400).json({ error: error.message });
  }
};

async function getProductsByAgency(req, res) {
  try {

    const agency_id = parseInt(req.params.agency_id);

    //get all product by associated agency and return on success
    const results = await keys.pool.query('SELECT p.* FROM app.product p join app.client c on p.client_id = c.id WHERE c.agency_id =$1 ORDER BY id ASC', [agency_id]);
    res.status(200).json(results.rows);

  } catch (error) {
    log_handler.sendErrorMessage(error.message);
    res.status(400).json({ error: error.message });
  }
};

async function getProductsByClient(req, res) {
  try {

    const client_id = parseInt(req.params.client_id);

    //get all products by associeted client and return on success
    const results = await keys.pool.query('SELECT * FROM app.product WHERE client_id = $1 ORDER BY id ASC', [client_id]);
    res.status(200).json(results.rows);

  } catch (error) {
    log_handler.sendErrorMessage(error.message);
    res.status(400).json({ error: error.message });
  }
};

async function getProductById(req, res) {
  try {

    const id = parseInt(req.params.id);

    //get singular product by id and return on success
    const results = await keys.pool.query('SELECT * FROM app.product WHERE id = $1', [id]);
    res.status(200).json(results.rows);

  } catch (error) {
    log_handler.sendErrorMessage(error.message);
    res.status(400).json({ error: error.message });
  }
};

async function addProduct(req, res) {
  try {

    const { errors, isValid } = validateProductInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    const { name, client, schema_name } = req.body;

    //check that client exists to satisfy foreign key constraint
    const client_check = await keys.pool.query('SELECT * FROM app.client WHERE name = $1', [client]);
    if (client_check.rowCount === undefined || client_check.rowCount === 0) {
      return res.status(400).json({ email: 'Invalid Client ID, please check that the client exists and try again' });
    }

    const client_id = client_check.rows[0].id;

    //check that record doesnt already exist in db
    const unique_check = await keys.pool.query('SELECT * FROM app.product WHERE name = $1 AND client_id = $2 and schema_name = $3', [name, client_id, schema_name]);
    if (unique_check.rowCount !== 0) {
      return res.status(400).json({ email: 'Product Name already exists, please choose a different name' });
    }

    //insert and return on success
    await keys.pool.query('INSERT INTO app.product (name, client_id, schema_name) VALUES ($1, $2, $3)', [name, client_id, schema_name]);
    res.status(201).json({ message: 'Product added successfully.' });

  } catch (error) {
    log_handler.sendErrorMessage(error.message);
    res.status(400).json({ error: error.message });
  }
};

async function updateProduct(req, res) {
  try {

    const { errors, isValid } = validateProductInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    const id = parseInt(req.params.id);
    const { name, client, schema_name } = req.body;

    //get record we are updating and assign client_id
    const client_record = await keys.pool.query('SELECT * FROM app.client WHERE name = $1', [client]);
    if (client_record.rowCount === 0) {
      return res.status(400).json({ email: 'Client is a required field, please select a client and try again' });
    }

    const client_id = client_record.rows[0].id;

    //check that record we are changing to doesnt already exist
    const unique_check = await keys.pool.query('SELECT * FROM app.product WHERE name = $1 AND client_id = $2 AND id != $3', [name, client_id, id]);
    if (unique_check.rowCount !== 0) {
      return res.status(400).json({ email: 'Product already exists, please choose a different name and/or client' });
    }

    //updated and return on success
    await keys.pool.query('UPDATE app.product SET name = $1, client_id = $2, schema_name = $3 WHERE id = $4', [name, client_id, schema_name, id]);
    res.status(200).json({ message: `Product modified with ID: ${id}` });

  } catch (error) {
    log_handler.sendErrorMessage(error.message);
    res.status(400).json({ error: error.message });
  }
};

async function deleteProduct(req, res) {
  try {

    const id = parseInt(req.params.id);

    //delete record and return on success
    await keys.pool.query('DELETE FROM app.product WHERE id = $1', [id]);
    res.status(200).json({ message: `Product deleted with ID: ${id}` });

  } catch (error) {
    log_handler.sendErrorMessage(error.message);
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getProducts,
  getProductsByAgency,
  getProductsByClient,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
}


