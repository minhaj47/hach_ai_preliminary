const express = require('express');
const config = require('../config/config');
const { validateEncryptedBallot, validateRankedBallot } = require('../utils/validation');

const router = express.Router();

/**
 * Encrypted Ballot Controller (Q16)
 * POST /api/ballots/encrypted
 * Status: 236 Encrypted
 */
router.post('/encrypted', async (req, res) => {
  try {
    // Validate request body
    const { error } = validateEncryptedBallot(req.body);
    if (error) {
      return res.status(422).json({ message: error.details[0].message });
    }

    const {
      election_id,
      ciphertext,
      zk_proof,
      voter_pubkey,
      nullifier,
      signature
    } = req.body;

    // Simulate zero-knowledge proof verification
    const isValidProof = Math.random() > 0.1; // 90% success rate for demo
    
    if (!isValidProof) {
      return res.status(425).json({ message: 'invalid zk proof' });
    }

    // Generate ballot ID and response
    const ballotId = 'b_' + Math.random().toString(16).substring(2, 6);
    
    // Generate actual hash output for nullifier (keccak256 simulation)
    const crypto = require('crypto');
    const hashInput = `${election_id}${voter_pubkey}${Date.now()}`;
    const actualHash = crypto.createHash('sha256').update(hashInput).digest('hex');
    const formattedNullifier = '0x' + actualHash.substring(0, 4) + '...';

    res.status(config.statusCodes.ENCRYPTED).json({
      ballot_id: ballotId,
      status: 'accepted',
      nullifier: formattedNullifier,
      anchored_at: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * Ranked-Choice Ballots (Q19)
 * POST /api/ballots/ranked
 * Status: 239 Ranked
 */
router.post('/ranked', async (req, res) => {
  try {
    // Validate request body
    const { error } = validateRankedBallot(req.body);
    if (error) {
      return res.status(422).json({ message: error.details[0].message });
    }

    const { election_id, voter_id, ranking, timestamp } = req.body;

    // Generate ballot ID
    const ballotId = 'rb_' + Math.random().toString(16).substring(2, 6);
    
    res.status(config.statusCodes.RANKED).json({
      ballot_id: ballotId,
      status: 'accepted'
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
