const log_handler = require('./log_handler');

async function healthCheck(req, res) {
  try {
    res.status(200).json({ status: 'UP' });
  } catch (error) {
    log_handler.sendErrorMessage(error.message);
    res.status(400).json({ error: error });
  }
};

module.exports = {
  healthCheck
}