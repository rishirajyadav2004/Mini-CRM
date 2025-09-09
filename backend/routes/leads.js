const express = require('express');
const {
  getLeads,
  getLead,
  createLead,
  updateLead,
  deleteLead,
  getLeadsByStatus
} = require('../controllers/leads');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/status/:status')
  .get(getLeadsByStatus);

router.route('/:id')
  .get(getLead)
  .put(updateLead)
  .delete(deleteLead);

router.route('/customers/:customerId/leads')
  .get(getLeads)
  .post(createLead);

module.exports = router;