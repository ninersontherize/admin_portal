const keys = require('../../config/keys.js');
const log_handler = require('./log_handler');

// Load input validation
const validateCampaignInput = require('../../validation/campaign');
const validateCampaignUpdateInput = require('../../validation/campaignUpdate');

async function getCampaigns(req, res) {
  try {

    //get all campaigns and return on success
    const results = await keys.pool.query('select c.id,c.product_id,v.name as vendor,li.name as line_item,cast(c.start_date as varchar),cast(c.end_date as varchar),cast(c.planned_cpm as numeric),cast(c.planned_impressions as numeric),cast(c.planned_budget as numeric),cast(c.actual_cpm as numeric),cast(c.actual_impressions as numeric) from app.campaign c join app.vendor v on v.id = c.vendor_id join app.line_item li on li.id = c.line_item_id order by start_date ASC');
    res.status(200).json(results.rows);

  } catch (error) {
    log_handler.sendErrorMessage(error.message);
    res.status(400).json({ error: error.message });
  }
};

async function getCampaignsByProduct(req, res) {
  try {

    const product_id = parseInt(req.params.product_id);

    //get campaigns by product and return on success
    const results = await keys.pool.query('select c.id,c.product_id,v.name as vendor,li.name as line_item,cast(c.start_date as varchar),cast(c.end_date as varchar),cast(c.planned_cpm as numeric),cast(c.planned_impressions as numeric),cast(c.planned_budget as numeric),cast(c.actual_cpm as numeric),cast(c.actual_impressions as numeric) from app.campaign c join app.vendor v on v.id = c.vendor_id join app.line_item li on li.id = c.line_item_id where c.product_id = $1 order by start_date ASC', [product_id]);
    res.status(200).json(results.rows);

  } catch (error) {
    log_handler.sendErrorMessage(error.message);
    res.status(400).json({ error: error.message });
  }
};

async function getCampaignsByFilter(req, res) {
  try {

    const { start_date, end_date, product_id, agency_id } = req.query;

    if(agency_id !== '') {
      if (start_date !== '' && end_date !== '' && product_id !== '') {

        //get campaigns by agency, start_date, end_date, product
        const results = await keys.pool.query('select c.id,c.product_id,v.name as vendor,li.name as line_item,cast(c.start_date as varchar),cast(c.end_date as varchar),cast(c.planned_cpm as numeric),cast(c.planned_impressions as numeric),cast(c.planned_budget as numeric),cast(c.actual_cpm as numeric),cast(c.actual_impressions as numeric) from app.campaign c join app.vendor v on v.id = c.vendor_id join app.line_item li on li.id = c.line_item_id join app.product p on c.product_id = p.id join app.client cl on cl.id = p.client_id WHERE cl.agency_id = $1 and c.start_date >= $2 and c.end_date <= $3 and c.product_id = $4 order by start_date ASC, end_date ASC, v.id', [agency_id, start_date, end_date, product_id]);
        res.status(200).json(results.rows);

      } else if (start_date === '' && end_date !== '' && product_id !== '') {

        //get campaigns by agency, end_date, product
        const results = await keys.pool.query('select c.id,c.product_id,v.name as vendor,li.name as line_item,cast(c.start_date as varchar),cast(c.end_date as varchar),cast(c.planned_cpm as numeric),cast(c.planned_impressions as numeric),cast(c.planned_budget as numeric),cast(c.actual_cpm as numeric),cast(c.actual_impressions as numeric) from app.campaign c join app.vendor v on v.id = c.vendor_id join app.line_item li on li.id = c.line_item_id join app.product p on c.product_id = p.id join app.client cl on cl.id = p.client_id WHERE cl.agency_id = $1 and c.end_date <= $2 and c.product_id = $3 order by start_date ASC, end_date ASC, v.id', [agency_id, end_date, product_id]);
        res.status(200).json(results.rows);

      } else if (start_date !== '' && end_date === '' && product_id !== '') {

        //get campaigns by agency, start_date, product
        const results = await keys.pool.query('select c.id,c.product_id,v.name as vendor,li.name as line_item,cast(c.start_date as varchar),cast(c.end_date as varchar),cast(c.planned_cpm as numeric),cast(c.planned_impressions as numeric),cast(c.planned_budget as numeric),cast(c.actual_cpm as numeric),cast(c.actual_impressions as numeric) from app.campaign c join app.vendor v on v.id = c.vendor_id join app.line_item li on li.id = c.line_item_id join app.product p on c.product_id = p.id join app.client cl on cl.id = p.client_id WHERE cl.agency_id = $1 and c.start_date >= $2 and c.product_id = $3 order by start_date ASC, end_date ASC, v.id', [agency_id, start_date, product_id]);
        res.status(200).json(results.rows);

      } else if (start_date !== '' && end_date !== '' && product_id === '') {

        //get campaigns by agency, start_date, end_date
        const results = await keys.pool.query('select c.id,c.product_id,v.name as vendor,li.name as line_item,cast(c.start_date as varchar),cast(c.end_date as varchar),cast(c.planned_cpm as numeric),cast(c.planned_impressions as numeric),cast(c.planned_budget as numeric),cast(c.actual_cpm as numeric),cast(c.actual_impressions as numeric) from app.campaign c join app.vendor v on v.id = c.vendor_id join app.line_item li on li.id = c.line_item_id join app.product p on c.product_id = p.id join app.client cl on cl.id = p.client_id WHERE cl.agency_id = $1 and c.start_date >= $2 and c.end_date <= $3 order by start_date ASC, end_date ASC, v.id', [agency_id, start_date, end_date]);
        res.status(200).json(results.rows);

      } else if (start_date !== '' && end_date === '' && product_id === '') {

        //get campaigns by agency and start_date
        const results = await keys.pool.query('select c.id,c.product_id,v.name as vendor,li.name as line_item,cast(c.start_date as varchar),cast(c.end_date as varchar),cast(c.planned_cpm as numeric),cast(c.planned_impressions as numeric),cast(c.planned_budget as numeric),cast(c.actual_cpm as numeric),cast(c.actual_impressions as numeric) from app.campaign c join app.vendor v on v.id = c.vendor_id join app.line_item li on li.id = c.line_item_id join app.product p on c.product_id = p.id join app.client cl on cl.id = p.client_id WHERE cl.agency_id = $1 and c.start_date >= $2 order by start_date ASC, end_date ASC, v.id', [agency_id, start_date]);
        res.status(200).json(results.rows);

      } else if (start_date === '' && end_date !== '' && product_id === '') {

        //get campaigns by agency and end_date
        const results = await keys.pool.query('select c.id,c.product_id,v.name as vendor,li.name as line_item,cast(c.start_date as varchar),cast(c.end_date as varchar),cast(c.planned_cpm as numeric),cast(c.planned_impressions as numeric),cast(c.planned_budget as numeric),cast(c.actual_cpm as numeric),cast(c.actual_impressions as numeric) from app.campaign c join app.vendor v on v.id = c.vendor_id join app.line_item li on li.id = c.line_item_id join app.product p on c.product_id = p.id join app.client cl on cl.id = p.client_id WHERE cl.agency_id = $1 and c.end_date <= $2 order by start_date ASC, end_date ASC, v.id', [agency_id, end_date]);
        res.status(200).json(results.rows);

      } else if (start_date === '' && end_date === '' && product_id !== '') {

        //get campaigns by agency and product
        const results = await keys.pool.query('select c.id,c.product_id,v.name as vendor,li.name as line_item,cast(c.start_date as varchar),cast(c.end_date as varchar),cast(c.planned_cpm as numeric),cast(c.planned_impressions as numeric),cast(c.planned_budget as numeric),cast(c.actual_cpm as numeric),cast(c.actual_impressions as numeric) from app.campaign c join app.vendor v on v.id = c.vendor_id join app.line_item li on li.id = c.line_item_id join app.product p on c.product_id = p.id join app.client cl on cl.id = p.client_id WHERE cl.agency_id = $1 and c.product_id = $2 order by start_date ASC, end_date ASC, v.id', [agency_id, product_id]);
        res.status(200).json(results.rows);
        
      } else {

        //get campaigns by agency
        const results = await keys.pool.query('select c.id,c.product_id,v.name as vendor,li.name as line_item,cast(c.start_date as varchar),cast(c.end_date as varchar),cast(c.planned_cpm as numeric),cast(c.planned_impressions as numeric),cast(c.planned_budget as numeric),cast(c.actual_cpm as numeric),cast(c.actual_impressions as numeric) from app.campaign c join app.vendor v on v.id = c.vendor_id join app.line_item li on li.id = c.line_item_id join app.product p on c.product_id = p.id join app.client cl on cl.id = p.client_id WHERE cl.agency_id = $1 order by start_date ASC, end_date ASC, v.id', [agency_id]);
        res.status(200).json(results.rows);

      }
    } else {
      if (start_date !== '' && end_date !== '' && product_id !== '') {
        
        //get campaigns by start_date, end_date and product
        const results = await keys.pool.query('select c.id,c.product_id,v.name as vendor,li.name as line_item,cast(c.start_date as varchar),cast(c.end_date as varchar),cast(c.planned_cpm as numeric),cast(c.planned_impressions as numeric),cast(c.planned_budget as numeric),cast(c.actual_cpm as numeric),cast(c.actual_impressions as numeric) from app.campaign c join app.vendor v on v.id = c.vendor_id join app.line_item li on li.id = c.line_item_id WHERE c.start_date >= $1 and c.end_date <= $2 and c.product_id = $3 order by start_date ASC, end_date ASC, v.id', [start_date, end_date, product_id]);        
        res.status(200).json(results.rows);

      } else if (start_date === '' && end_date !== '' && product_id !== '') {

        //get campaigns by end_date and product
        const results = await keys.pool.query('select c.id,c.product_id,v.name as vendor,li.name as line_item,cast(c.start_date as varchar),cast(c.end_date as varchar),cast(c.planned_cpm as numeric),cast(c.planned_impressions as numeric),cast(c.planned_budget as numeric),cast(c.actual_cpm as numeric),cast(c.actual_impressions as numeric) from app.campaign c join app.vendor v on v.id = c.vendor_id join app.line_item li on li.id = c.line_item_id WHERE c.end_date <= $1 and c.product_id = $2 order by start_date ASC, end_date ASC, v.id', [end_date, product_id]);
        res.status(200).json(results.rows);

      } else if (start_date !== '' && end_date === '' && product_id !== '') {

        //get campaigns by start_date and product
        const results = await keys.pool.query('select c.id,c.product_id,v.name as vendor,li.name as line_item,cast(c.start_date as varchar),cast(c.end_date as varchar),cast(c.planned_cpm as numeric),cast(c.planned_impressions as numeric),cast(c.planned_budget as numeric),cast(c.actual_cpm as numeric),cast(c.actual_impressions as numeric) from app.campaign c join app.vendor v on v.id = c.vendor_id join app.line_item li on li.id = c.line_item_id WHERE c.start_date >= $1 and c.product_id = $2 order by start_date ASC, end_date ASC, v.id', [start_date, product_id]);
        res.status(200).json(results.rows);

      } else if (start_date !== '' && end_date !== '' && product_id === '') {

        //get campaigns by start_date and end_date
        const results = await keys.pool.query('select c.id,c.product_id,v.name as vendor,li.name as line_item,cast(c.start_date as varchar),cast(c.end_date as varchar),cast(c.planned_cpm as numeric),cast(c.planned_impressions as numeric),cast(c.planned_budget as numeric),cast(c.actual_cpm as numeric),cast(c.actual_impressions as numeric) from app.campaign c join app.vendor v on v.id = c.vendor_id join app.line_item li on li.id = c.line_item_id WHERE c.start_date >= $1 and c.end_date <= $2 order by start_date ASC, end_date ASC, v.id', [start_date, end_date]);
        res.status(200).json(results.rows);

      } else if (start_date !== '' && end_date === '' && product_id === '') {

        //get campaigns by start_date
        const results = await keys.pool.query('select c.id,c.product_id,v.name as vendor,li.name as line_item,cast(c.start_date as varchar),cast(c.end_date as varchar),cast(c.planned_cpm as numeric),cast(c.planned_impressions as numeric),cast(c.planned_budget as numeric),cast(c.actual_cpm as numeric),cast(c.actual_impressions as numeric) from app.campaign c join app.vendor v on v.id = c.vendor_id join app.line_item li on li.id = c.line_item_id WHERE c.start_date >= $1 order by start_date ASC, end_date ASC, v.id', [start_date]);
        res.status(200).json(results.rows);

      } else if (start_date === '' && end_date !== '' && product_id === '') {

        //get campaigns by end_date
        const results = await keys.pool.query('select c.id,c.product_id,v.name as vendor,li.name as line_item,cast(c.start_date as varchar),cast(c.end_date as varchar),cast(c.planned_cpm as numeric),cast(c.planned_impressions as numeric),cast(c.planned_budget as numeric),cast(c.actual_cpm as numeric),cast(c.actual_impressions as numeric) from app.campaign c join app.vendor v on v.id = c.vendor_id join app.line_item li on li.id = c.line_item_id WHERE c.end_date <= $1 order by start_date ASC, end_date ASC, v.id', [end_date]);
        res.status(200).json(results.rows);

      } else if (start_date === '' && end_date === '' && product_id !== '') {

        //get campaigns by product
        const results = await keys.pool.query('select c.id,c.product_id,v.name as vendor,li.name as line_item,cast(c.start_date as varchar),cast(c.end_date as varchar),cast(c.planned_cpm as numeric),cast(c.planned_impressions as numeric),cast(c.planned_budget as numeric),cast(c.actual_cpm as numeric),cast(c.actual_impressions as numeric) from app.campaign c join app.vendor v on v.id = c.vendor_id join app.line_item li on li.id = c.line_item_id WHERE c.product_id = $1 order by start_date ASC, end_date ASC, v.id', [product_id]);
        res.status(200).json(results.rows);

      } else {

        //get all campaigns
        const results = await keys.pool.query('select c.id,c.product_id,v.name as vendor,li.name as line_item,cast(c.start_date as varchar),cast(c.end_date as varchar),cast(c.planned_cpm as numeric),cast(c.planned_impressions as numeric),cast(c.planned_budget as numeric),cast(c.actual_cpm as numeric),cast(c.actual_impressions as numeric) from app.campaign c join app.vendor v on v.id = c.vendor_id join app.line_item li on li.id = c.line_item_id order by start_date ASC, end_date ASC, v.id');
        res.status(200).json(results.rows);

      }
    }
  } catch (error) {
    log_handler.sendErrorMessage(error.message);
    res.status(400).json({ error: error.message });
  }
};

async function addCampaign(req, res) {
  try{

    const { errors, isValid } = validateCampaignInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }
  
    const { product_id, line_item, start_date, end_date, planned_cpm, planned_impressions, planned_budget, actual_cpm, actual_impressions } = req.body
    var vendor_id;
    var line_item_id;

    //check product for foreign key constraint
    const product_check = await keys.pool.query('SELECT * FROM app.product WHERE id = $1', [product_id]);
    if (product_check.rowCount === 0) {
      return res.status(400).json({ email: 'Invalid Product ID, please check that the product exists and try again.' });
    }

    //check line item for foreign key constraint
    const line_item_check = await keys.pool.query('SELECT * FROM app.line_item WHERE name = $1', [line_item]);
    if (line_item_check.rowCount === 0) {
      return res.status(400).json({ email: 'Invalid Line Item ID, please check that the line item exists and try again.' });
    } 

    //set ids for insert
    line_item_id = line_item_check.rows[0].id;
    vendor_id = line_item_check.rows[0].vendor_id;

    //insert and return on success
    await keys.pool.query('INSERT INTO app.campaign (product_id , vendor_id, line_item_id, start_date, end_date, planned_cpm, planned_impressions, planned_budget, actual_cpm, actual_impressions) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)', [product_id, vendor_id, line_item_id, start_date, end_date, planned_cpm, planned_impressions, planned_budget, actual_cpm, actual_impressions]);
    res.status(201).json({ message: 'Campaign added successfully.' });

  } catch (error) {
    log_handler.sendErrorMessage(error.message);
    res.status(400).json({ error: error.message });
  }
};

async function updateCampaign(req, res) {
  try {
    
    const { errors, isValid } = validateCampaignUpdateInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    const id = parseInt(req.params.id)
    const { line_item, start_date, end_date, planned_cpm, planned_impressions, planned_budget, actual_cpm, actual_impressions } = req.body

    //check line item exists for foreign key constraints
    const line_item_check = await keys.pool.query('SELECT * FROM app.line_item WHERE name = $1', [line_item]);
    if (line_item_check.rowCount === 0) {
      return res.status(400).json({ email: 'Invalid Line Item ID, please check that the line item exists and try again.' });
    }

    //set ids for update
    let line_item_id = line_item_check.rows[0].id;
    let vendor_id = line_item_check.rows[0].vendor_id;
    let actual_cpm_validated = ((actual_cpm === '') ? 0.00 : actual_cpm);
    let actual_impressions_validated = ((actual_impressions === '') ? 0 : actual_impressions);

    //update and return on success
    await keys.pool.query("UPDATE app.campaign SET vendor_id = $2, line_item_id = $3, start_date = $4, end_date = $5, planned_cpm = $6, planned_impressions = $7, planned_budget = $8, actual_cpm = NULLIF($9, 0.00), actual_impressions = NULLIF($10, 0) WHERE id = $1", [id, vendor_id, line_item_id, start_date, end_date, planned_cpm, planned_impressions, planned_budget, actual_cpm_validated, actual_impressions_validated]);
    res.status(200).json({ message: `Campaign modified with ID: ${id}` });

  } catch (error) {
    console.log(error.message);
    //log_handler.sendErrorMessage(error.message);
    res.status(400).json({ error: error.message });
  }
};

async function deleteCampaign(req, res) {
  try {

    const id = parseInt(req.params.id);

    //delete record and return on success
    await keys.pool.query('DELETE FROM app.campaign WHERE id = $1', [id]);
    res.status(200).json({ message: `Client deleted with ID: ${id}` });

  } catch (error) {
    log_handler.sendErrorMessage(error.message);
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getCampaigns,
  getCampaignsByProduct,
  getCampaignsByFilter,
  addCampaign,
  updateCampaign,
  deleteCampaign,
}


