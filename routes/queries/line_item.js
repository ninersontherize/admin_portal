const keys = require('../../config/keys.js');
const log_handler = require('./log_handler');

async function getLineItems(req, res) {
  try {

    //get all line_items and return on success
    const results = await keys.pool.query('SELECT * FROM app.line_item ORDER BY id ASC');
    res.status(200).json(results.rows);
  
  } catch (error) {
    log_handler.sendErrorMessage(error.message);
    res.status(400).json({ error: error.message });
  }
};

async function getLineItemsByVendor(req, res) {
  try {

    const { vendor, product_id } = req.query;

    //get line items by vendor and return on success
    const results = await keys.pool.query('SELECT l.* FROM app.line_item l JOIN app.vendor v on v.id = l.vendor_id WHERE v.name = $1 AND v.product_id = $2 ORDER BY l.id ASC', [vendor, product_id]);
    res.status(200).json(results.rows);

  } catch (error) {
    log_handler.sendErrorMessage(error.message);
    res.status(400).json({ error: error.message });
  }
};

async function getLineItemsByProduct(req, res) {
  try {

    const { product } = req.query;

    //get line items by given product and return on success
    let results = await keys.pool.query('SELECT l.* FROM app.line_item l JOIN app.vendor v on v.id = l.vendor_id WHERE v.product_id = $1 ORDER BY l.name ASC', [product]);
    res.status(200).json(results.rows);

  } catch (error) {
    log_handler.sendErrorMessage(error.message);
    res.status(400).json({ error: error.message });
  }
};

async function getLineItemById(req, res) {
  try {

    const id = parseInt(req.params.id);

    //get a singular line item by id and return on success
    const results = await keys.pool.query('SELECT * FROM app.line_item WHERE id = $1', [id]);
    res.status(200).json(results.rows);

  } catch (error) {
    log_handler.sendErrorMessage(error.message);
    res.status(400).json({ error: error.message });
  }
};

async function addLineItem(req, res) {
  try {

    const { name, vendor_id } = req.body;

    //check vendor exists for foreign key constraint
    const vendor_check = await keys.pool.query('SELECT * FROM app.vendor WHERE id = $1', [vendor_id]);
    if (vendor_check.rowCount === 0) {
      return res.status(400).json({ email: 'Invalid Vendor ID, please check that the vendor exists and try again.' });
    }

    //check that line item does not already exist in db
    const unique_check = await keys.pool.query('SELECT * FROM app.line_item WHERE name = $1 and vendor_id = $2', [name, vendor_id]);
    if (unique_check.rowCount !== 0) {
      return res.status(400).json({ email: 'Line Item already exists' });
    }

    //insert and return on success
    await keys.pool.query('INSERT INTO app.line_item (name, vendor_id) VALUES ($1, $2)', [name, vendor_id]);
    res.status(201).json({ message: 'LineItem added successfully.' });

  } catch (error) {
    log_handler.sendErrorMessage(error.message);
    res.status(400).json({ error: error.message });
  }
};

async function updateLineItem(req, res) {
  try {

    const id = parseInt(req.params.id);
    const { name } = req.body;

    //update record given the params passed
    await keys.pool.query('UPDATE app.line_item SET name = $1 WHERE id = $2', [name, id]);
    res.status(200).json({ message: `Line Item modified with ID: ${id}` });

  } catch (error) {
    log_handler.sendErrorMessage(error.message);
    res.status(400).json({ error: error.message });
  }
};

async function deleteLineItem(req, res) {
  try {

    const id = parseInt(req.params.id);
    
    //delete record based on id and return on success
    await keys.pool.query('DELETE FROM app.line_item WHERE id = $1', [id]);
    res.status(200).json({ message: `Line Item deleted with ID: ${id}` });

  } catch (error) {
    log_handler.sendErrorMessage(error.message);
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getLineItems,
  getLineItemsByVendor,
  getLineItemsByProduct,
  getLineItemById,
  addLineItem,
  updateLineItem,
  deleteLineItem,
}


