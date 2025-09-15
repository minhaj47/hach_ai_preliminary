const express = require('express');
const CandidateController = require('../controllers/CandidateController');

const router = express.Router();

// Q6: Register candidate - POST /api/candidates (Status 226)
router.post('/', CandidateController.registerCandidate);

// Q7: List candidates - GET /api/candidates (Status 227)
// Q10: Filter candidates by party - GET /api/candidates?party={party_name} (Status 230)
router.get('/', CandidateController.getAllCandidates);

// Q9: Get candidate votes - GET /api/candidates/{candidate_id}/votes (Status 229)
router.get('/:candidate_id/votes', CandidateController.getCandidateVotes);

// Get candidate by ID
router.get('/:candidate_id', CandidateController.getCandidateById);

module.exports = router;
