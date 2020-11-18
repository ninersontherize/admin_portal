const crypto = require("crypto");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys.js');
const log_handler = require('./log_handler');

// Load input validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');
const validateUserInput = require('../../validation/user');
const validatePasswordUpdateInput = require('../../validation/passwordUpdate');

async function getUsers(req, res) {
  try {

    //grab users and return results
    const results = await keys.pool.query('select u.id, u.name, u.email, u.role, u.agency_id, a.name as agency from app.user u left join app.agency a on u.agency_id = a.id order by u.id asc');
    res.status(200).json(results.rows);

  } catch(error) {
    log_handler.sendErrorMessage(error.message);
    res.status(400).json({ error: error.message });
  }
};

async function getUserById(req, res) {
  try{

    const id = parseInt(req.params.id);

    //get singular user by id and return
    const results = await keys.pool.query('SELECT * FROM app.user WHERE id = $1', [id]);
    res.status(200).json(results.rows);

  } catch(error) {
    log_handler.sendErrorMessage(error.message);
    res.status(400).json({ error: error.message });
  }
  
};

async function registerUser(req, res) {
  try {

    const { errors, isValid } = validateRegisterInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    const { name, email, password, role, agency_id } = req.body;

    //check unique email
    const unique_check = await keys.pool.query('SELECT * FROM app.user WHERE email = $1', [email]);
    if (unique_check.rowCount !== 0) {
      return res.status(400).json({ email: 'Email already exists' });
    }

    //check agency exists to satisfy fk constraint
    if (agency_id !== null) {
      const agency_check = await keys.pool.query('SELECT * FROM app.agency WHERE id = $1', [agency_id]);
      if (agency_check.rowCount !== 1) {
        return res.status(400).json({ email: 'Agency does not exist' });
      }
    }
    
    //hash password for storage
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    //insert and send update message on success
    await keys.pool.query('INSERT INTO app.user (name, email, password, role, agency_id) VALUES ($1, $2, $3, $4, $5)', [name, email, hash, role, agency_id]);
    res.status(201).json({ message: 'User added successfully' });

  } catch(error) {
    log_handler.sendErrorMessage(error.message);
    res.status(400).json({ error: error.message });
  }
};

async function updateUser(req, res) {
  try {

    const { errors, isValid } = validateUserInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    const id = parseInt(req.params.id)
    const { name, email, role, agency } = req.body

    const email_check = await keys.pool.query('SELECT * from app.user where email = $1 and id != $2', [email, id]);
    if (email_check.rowCount !== 0) {
      return res.status(400).json({ email: 'Email already exists for another user, update with a new address and try again'});
    }

    if (role === 'agency') {
      const agency_search = await keys.pool.query('SELECT id from app.agency where name = $1', [agency]);
      if (agency_search.rowCount === 0) {
        return res.status(404).json({ agency: 'Invalid agency, please check that it exists and try again'});
      }
  
      const agency_id = agency_search.rows[0].id;

      //update and send response
      await keys.pool.query('UPDATE app.user SET name = $1, email = $2, role = $4, agency_id = $5 WHERE id = $3', [name, email, id, role, agency_id]);
      res.status(200).json({ message: `User modified with ID: ${id}` });
    } else {
      //update and send response
      await keys.pool.query('UPDATE app.user SET name = $1, email = $2, role = $4 WHERE id = $3', [name, email, id, role]);
      res.status(200).json({ message: `User modified with ID: ${id}` });
    }

  }  catch(error) {
    log_handler.sendErrorMessage(error.message);
    res.status(400).json({ error: error.message });
  }
};

async function deleteUser(req, res) {
  try {
    
    const id = parseInt(req.params.id);

    //delete and send response
    keys.pool.query('DELETE FROM app.user WHERE id = $1', [id]);
    res.status(200).json({ message: `User deleted with ID: ${id}` })

  } catch(error) {
    log_handler.sendErrorMessage(error.message);
    res.status(400).json({ error: error.message });
  }
};

async function login(req, res) {
  try {
    const { errors, isValid } = validateLoginInput(req.body);
  
    // Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
    
    const email = req.body.email;
    const password = req.body.password;
    
    // Find user by email
    const user_search = await keys.pool.query('SELECT * FROM app.user WHERE email = $1', [email]);
    if (user_search.rowCount === 0) {
      return res.status(404).json({ emailnotfound: 'Email not found' });
    }

    const user = user_search.rows[0];
    const match = await bcrypt.compare(password, user.password);
    
    if (match) {
      // User matched
      // Create JWT Payload
      const payload = {
        id: user.id,
        name: user.name,
        role: user.role,
        agency_id: user.agency_id
      };

      // Sign token set to expire in 1 year
      const token = await jwt.sign(payload, keys.secretOrKey,{ expiresIn: 31556926 });
      res.json({ success: true, token: 'Bearer ' + token });
    } else {
      return res
        .status(400)
        .json({ passwordincorrect: 'Password incorrect' });
    }

  } catch(error) {
    log_handler.sendErrorMessage(error.message);
    res.status(400).json({ error: error.message });
  }
}

async function forgotPassword(req, res) {
  try {

    const { email } = req.body;

    const user_search = await keys.pool.query('SELECT * FROM app.user WHERE email = $1', [email]);
    if (user_search.rowCount === 0) {
      return res.status(404).json({ email: 'Email does not yet exist in user pool' });
    }

    const token = crypto.randomBytes(20).toString("hex");
    const expire_date = Date.now() + 360000;

    await keys.pool.query('UPDATE app.user SET reset_password_token = $1, reset_password_expires = $2 WHERE email = $3', [token, expire_date, email]);
    res.status(200).json({ message: `Password Reset Token Set Successfully` });

    //TO-DO: add email send here.

  } catch(error) {
    log_handler.sendErrorMessage(error.message);
    res.status(400).json({ error: error.message });
  } 
}

async function validateToken(req, res) {
  try {
    const { reset_password_token } = req.body;

    const user_search = await keys.pool.query('SELECT * FROM app.user WHERE reset_password_token = $1 and reset_password_expires >= $2', [reset_password_token, Date.now()]);
    if (user_search.rowCount === 0) {
      return res.status(404).json({ email: "Password reset link is invalid or has expired" });
    }

    res.status(200).send({
      email: user_search.rows[0].email,
      message: 'password reset link valid'
    });

  } catch(error) {
    log_handler.sendErrorMessage(error.message);
    res.status(400).json({ error: error.message });
  }
}

async function updatePassword(req, res) {
  try {

    const { errors, isValid } = validatePasswordUpdateInput(req.body);
  
    // Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
    
    const { email, reset_password_token, password } = req.body;
    
    //hash password for storage
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    await keys.pool.query('UPDATE app.user SET password = $1, reset_password_token = null, reset_password_expires = null WHERE email = $2 and reset_password_token = $3 and reset_password_expires >= $4', [hash, email, reset_password_token, Date.now()]);
    res.status(200).json({ message: `Password Reset Successfully` });

  } catch(error) {
    log_handler.sendErrorMessage(error.message);
    res.status(400).json({ error: error.message });
  }
}


module.exports = {
  getUsers,
  getUserById,
  registerUser,
  updateUser,
  deleteUser,
  login,
  forgotPassword,
  validateToken,
  updatePassword
}