const express = require('express');
const ResultController = require('../controllers/ResultController');

const router = express.Router();

// Q11: Get voting results - GET /api/results (Status 231)
router.get('/', ResultController.getResults);

// Q12: Get election winner - GET /api/results/winner (Status 231)
router.get('/winner', ResultController.getWinner);

// Q17: Homomorphic tally - POST /api/results/homomorphic (Status 237)
router.post('/homomorphic', ResultController.homomorphicTally);

module.exports = router;
