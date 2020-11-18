const keys = require('../../config/keys.js');
const log_handler = require('./log_handler');

// Load input validation
const validateAgencyInput = require('../../validation/agency');

async function getAgencies(req, res) {
  try {

    //get all agencies and return result
    const results = await keys.pool.query('SELECT * FROM app.agency ORDER BY id ASC');
    res.status(200).json(results.rows);

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

async function getAgencyById(req, res) {
  try {

    const id = parseInt(req.params.id);

    //get a single agency by id and return
    const results = await keys.pool.query('SELECT * FROM app.agency WHERE id = $1', [id]);
    res.status(200).json(results.rows);

  } catch (error) {
    log_handler.sendErrorMessage(error.message);
    res.status(400).json({ error: error.message });
  }
};

async function addAgency(req, res) {
  try {

    const { errors, isValid } = validateAgencyInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    const { name } = req.body;

    //check to see if name already exists
    const unique_check = await keys.pool.query('SELECT * FROM app.agency WHERE name = $1', [name]);
    if (unique_check.rowCount !== 0) {
      return res.status(400).json({ email: 'Agency already exists' });
    }

    //insert and return message on success
    await keys.pool.query('INSERT INTO app.agency (name) VALUES ($1)', [name]);
    res.status(201).json({ message: 'Agency added successfully.' });

  } catch (error) {
    log_handler.sendErrorMessage(error.message);
    res.status(400).json({ error: error.message });
  }
};

async function updateAgency(req, res) {
  try {

    const { errors, isValid } = validateAgencyInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    const id = parseInt(req.params.id);
    const { name } = req.body;

    //update given agency and return message on success
    await keys.pool.query('UPDATE app.agency SET name = $1 WHERE id = $2', [name, id]);
    res.status(200).json({ message: `Agency modified with ID: ${id}` });

  } catch {
    log_handler.sendErrorMessage(error.message);
    res.status(400).json({ error: error.message });
  }
};

async function deleteAgency(req, res) {
  try {

    const id = parseInt(req.params.id);

    //delete record and return message on success
    await keys.pool.query('DELETE FROM app.agency WHERE id = $1', [id]);
    res.status(200).json({ message: `Agency deleted with ID: ${id}` });

  } catch {
    log_handler.sendErrorMessage(error.message);
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getAgencies,
  getAgencyById,
  addAgency,
  updateAgency,
  deleteAgency,
}


