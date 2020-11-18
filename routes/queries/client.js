const keys = require('../../config/keys.js');
const log_handler = require('./log_handler');

// Load input validation
const validateClientInput = require('../../validation/client');

async function getClients(req, res) {
  try {

    //get all clients and return on success
    const results = await keys.pool.query('select c.id, c.name, c.agency_id, a.name as agency from app.client c join app.agency a on c.agency_id = a.id order by id ASC');
    res.status(200).json(results.rows);

  } catch (error) {
    log_handler.sendErrorMessage(error.message);
    res.status(400).json({ error: error.message });
  }
};

async function getClientsByAgency(req, res) {
  try {

    const agency_id = parseInt(req.params.agency_id);

    //get clients by agency and return on success
    const results = await keys.pool.query('SELECT * FROM app.client where agency_id = $1 ORDER BY id ASC', [agency_id]);
    res.status(200).json(results.rows);

  } catch (error) {
    log_handler.sendErrorMessage(error.message);
    res.status(400).json({ error: error.message });
  }
};

async function getClientsByProduct(req, res) {
  try {

    const product_id = parseInt(req.params.product_id);

    //get clients by product and return on success
    const results = await keys.pool.query('SELECT c.* FROM app.client c JOIN app.product p on c.id = p.client_id WHERE p.id = $1 ORDER BY c.id ASC', [product_id]);
    res.status(200).json(results.rows);

  } catch (error) {
    log_handler.sendErrorMessage(error.message);
    res.status(400).json({ error: error.message });
  }
};

async function getClientById(req, res) {
  try {

    const id = parseInt(req.params.id);

    //get singular client and return on success
    const results = await keys.pool.query('SELECT * FROM app.client WHERE id = $1', [id]);
    res.status(200).json(results.rows);

  } catch (error) {
    log_handler.sendErrorMessage(error.message);
    res.status(400).json({ error: error.message });
  }
};

async function addClient(req, res) {
  try {

    const { errors, isValid } = validateClientInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    const { name, agency } = req.body;

    //check agency exists for foreign key constraint
    const agency_check = await keys.pool.query('SELECT * FROM app.agency WHERE name = $1', [agency]);
    if (agency_check.rowCount === 0) {
      return res.status(400).json({ email: 'Invalid Agency, please check that the agency exists and try again.' });
    }

    const agency_id = agency_check.rows[0].id;

    //check that record doesnt already exist in db
    const unique_check = await keys.pool.query('SELECT * FROM app.client WHERE name = $1', [name]);
    if (unique_check.rowCount !== 0) {
      return res.status(400).json({ email: 'Client already exists' });
    }

    //insert and return on success
    await keys.pool.query('INSERT INTO app.client (name, agency_id) VALUES ($1, $2)', [name, agency_id]);
    res.status(201).json({ message: 'Client added successfully.' });

  } catch (error) {
    log_handler.sendErrorMessage(error.message);
    res.status(400).json({ error: error.message });
  }
};

async function updateClient(req, res) {
  try {

    const { errors, isValid } = validateClientInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    const id = parseInt(req.params.id);
    const { name, agency } = req.body;

    const agency_search = await keys.pool.query('SELECT id from app.agency where name = $1', [agency]);
    if (agency_search.rowCount === 0) {
      return res.status(400).json({ agency: 'Invalid agency, please check that it exists and try again.'});
    }

    const new_agency_id = agency_search.rows[0].id;

    await keys.pool.query('UPDATE app.client SET name = $1, agency_id = $2 WHERE id = $3', [name, new_agency_id, id]);
    res.status(200).json({ message: `Client modified with ID: ${id}` });

  } catch (error) {
    log_handler.sendErrorMessage(error.message);
    res.status(400).json({ error: error.message });
  }
};

async function deleteClient(req, res) {
  try {

    const id = parseInt(req.params.id);

    //delete client and return on success 
    await keys.pool.query('DELETE FROM app.client WHERE id = $1', [id]);
    res.status(200).json({ message: `Client deleted with ID: ${id}` });

  } catch (error) {
    log_handler.sendErrorMessage(error.message);
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getClients,
  getClientsByAgency,
  getClientsByProduct,
  getClientById,
  addClient,
  updateClient,
  deleteClient,
}


