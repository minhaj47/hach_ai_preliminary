const express = require('express');
const config = require('../config/config');
const { validateAuditPlan } = require('../utils/validation');

const router = express.Router();

/**
 * Risk-Limiting Audit (Q20)
 * POST /api/audits/plan
 * Status: 240 Audited
 */
router.post('/plan', async (req, res) => {
  try {
    // Validate request body
    const { error } = validateAuditPlan(req.body);
    if (error) {
      return res.status(422).json({ message: error.details[0].message });
    }

    const { 
      election_id, 
      reported_tallies, 
      risk_limit_alpha, 
      audit_type, 
      stratification 
    } = req.body;

    // Calculate initial sample size based on risk limit
    const totalVotes = reported_tallies.reduce((sum, tally) => sum + tally.votes, 0);
    const margin = Math.abs(reported_tallies[0].votes - reported_tallies[1].votes) / totalVotes;
    const initialSampleSize = Math.ceil(1200 / (margin * margin)); // Simplified calculation

    // Generate audit plan
    const auditId = 'rla_' + Math.random().toString(16).substring(2, 6);
    const samplingPlan = Buffer.from('county_A:0.3,county_B:0.4,county_C:0.3,seed:' + Date.now()).toString('base64');

    res.status(config.statusCodes.AUDITED).json({
      audit_id: auditId,
      initial_sample_size: Math.min(initialSampleSize, 1200),
      sampling_plan: samplingPlan,
      test: 'kaplan-markov',
      status: 'planned'
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
