const express = require('express');
const VoteController = require('../controllers/VoteController');

const router = express.Router();

// Q8: Cast vote - POST /api/votes (Status 228)
router.post('/', VoteController.castVote);

// Q14: Cast weighted vote - POST /api/votes/weighted (Status 234)
router.post('/weighted', VoteController.castWeightedVote);

// Q13: Get vote timeline - GET /api/votes/timeline?candidate_id={id} (Status 233)
router.get('/timeline', VoteController.getVoteTimeline);

// Q15: Get votes in range - GET /api/votes/range?candidate_id={id}&from={t1}&to={t2} (Status 235)
router.get('/range', VoteController.getVotesInRange);

module.exports = router;
