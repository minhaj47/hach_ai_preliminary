const express = require('express');
const VoterController = require('../controllers/VoterController');

const router = express.Router();

// Q1: Create voter - POST /api/voters (Status 218)
router.post('/', VoterController.createVoter);

// Q2: Get voter by ID - GET /api/voters/{voter_id} (Status 222)
router.get('/:voter_id', VoterController.getVoterById);

// Q3: List all voters - GET /api/voters (Status 223)
router.get('/', VoterController.getAllVoters);

// Q4: Update voter - PUT /api/voters/{voter_id} (Status 224)
router.put('/:voter_id', VoterController.updateVoter);

// Q5: Delete voter - DELETE /api/voters/{voter_id} (Status 225)
router.delete('/:voter_id', VoterController.deleteVoter);

module.exports = router;
