const keys = require('../../config/keys.js');
const log_handler = require('./log_handler');

async function getVendors(req, res) {
  try {

    //get vendors and return
    const results = await keys.pool.query('SELECT * FROM app.vendor ORDER BY id ASC');
    res.status(200).json(results.rows);

  } catch (error) {
    log_handler.sendErrorMessage(error.message);
    res.status(400).json({ error: error.message });
  }
};

async function getVendorByLineItem(req, res) {
  try {

    const { line_item, product_id } = req.query;

    //get vendors by the specified line_item and return
    const results =  await keys.pool.query('SELECT v.* FROM app.vendor v JOIN app.line_item li on v.id = li.vendor_id WHERE li.name = $1 and v.product_id = $2 ORDER BY v.id ASC', [line_item, product_id]);
    res.status(200).json(results.rows);

  } catch (error) {
    log_handler.sendErrorMessage(error.message);
    res.status(400).json({ error: error.message });
  }
}

async function getVendorByProduct(req, res) {
  try {

    const { product } = req.query;

    //get vendors by the specified product and return
    const results = await keys.pool.query('SELECT v.* FROM app.vendor v WHERE v.product_id = $1 ORDER BY v.name ASC', [product]);
    res.status(200).json(results.rows);

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function getVendorById(req, res) {
  try {
    const id = parseInt(req.params.id);

    //get a singular vendor by id and return
    const results = await keys.pool.query('SELECT * FROM app.vendor WHERE id = $1', [id]);
    res.status(200).json(results.rows);

  } catch (error) {
    log_handler.sendErrorMessage(error.message);
    res.status(400).json({ error: error.message });
  }
};

async function addVendor(req, res) {
  try {
    const { name, product_id } = req.body;

    //check if a record exists for this vendor
    const unique_check = await keys.pool.query('SELECT * FROM app.vendor WHERE name = $1 AND product_id = $2', [name, product_id]);
    if (unique_check.rowCount !== 0) {
      return res.status(400).json({ vendor: 'Vendor already exists' });
    }

    //product check for foreign key constraint
    const product_check = await keys.pool.query('SELECT * FROM app.product WHERE id = $1', [product_id]);
    if (product_check.rowCount !== 1) {
      return res.status(404).json({ product_id: 'Product not found' });
    }

    await keys.pool.query('INSERT INTO app.vendor (name, product_id) VALUES ($1, $2)', [name, product_id]);
    res.status(201).json({ message: 'Vendor added successfully.' });

  } catch (error) {
    log_handler.sendErrorMessage(error.message);
    res.status(400).json({ error: error.message });
  }
};

async function updateVendor(req, res) {
  try {

    const id = parseInt(req.params.id);
    const { name, product_id } = req.body;

    const current_record = await keys.pool.query('SELECT * FROM app.vendor where id = $1', [id]);
    if (current_record.rowCount === 0) {
      return res.status(404).json({ vendor: 'specified id not found' });
    }
  
    //update and then send success message
    await keys.pool.query('UPDATE app.vendor SET name = $1, product_id = $2 WHERE id = $3', [name, product_id, id]);
    res.status(200).json({ message: `Vendor modified with ID: ${id}` });

  } catch (error) {
    log_handler.sendErrorMessage(error.message);
    res.status(400).json({ error: error.message });
  }
};

async function deleteVendor(req, res) {
  try {

    const id = parseInt(req.params.id);

    //delete and send message on success
    await keys.pool.query('DELETE FROM app.vendor WHERE id = $1', [id]);
    res.status(200).json({ message: `Vendor deleted with ID: ${id}` });

  } catch (error) {
    log_handler.sendErrorMessage(error.message);
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getVendors,
  getVendorById,
  getVendorByLineItem,
  getVendorByProduct,
  addVendor,
  updateVendor,
  deleteVendor,
}


