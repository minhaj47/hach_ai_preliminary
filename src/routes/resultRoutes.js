const express = require('express');
const ResultController = require('../controllers/ResultController');

const router = express.Router();

// Q11: Get voting results - GET /api/results (Status 231)
router.get('/', ResultController.getResults);

// Q17: Homomorphic tally - POST /api/results/homomorphic (Status 237)
router.post('/homomorphic', ResultController.homomorphicTally);

module.exports = router;
