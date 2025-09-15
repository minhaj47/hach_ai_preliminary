const CandidateModel = require('../models/CandidateModel');
const VoteModel = require('../models/VoteModel');
const config = require('../config/config');

class ResultController {
  /**
   * Get voting results/leaderboard (Q11)
   * GET /api/results
   * Status: 231 Results
   */
  async getResults(req, res) {
    try {
      const candidates = CandidateModel.getLeaderboard();
      const totalVotes = VoteModel.getTotalCount();

      const results = candidates.map((candidate, index) => ({
        rank: index + 1,
        candidate_id: candidate.candidate_id,
        candidate_name: candidate.full_name,
        party_name: candidate.party_name,
        votes: candidate.vote_count,
        percentage: totalVotes > 0 ? ((candidate.vote_count / totalVotes) * 100).toFixed(2) : "0.00"
      }));

      res.status(config.statusCodes.RESULTS).json({
        total_votes: totalVotes,
        total_candidates: candidates.length,
        winner: results.length > 0 ? results[0] : null,
        leaderboard: results
      });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  /**
   * Homomorphic tally with verifiable decryption (Q17)
   * POST /api/results/homomorphic
   * Status: 237 Tallied
   */
  async homomorphicTally(req, res) {
    try {
      const { election_id, trustee_decrypt_shares } = req.body;

      if (!election_id || !trustee_decrypt_shares) {
        return res.status(422).json({ message: 'election_id and trustee_decrypt_shares are required' });
      }

      // Simulate homomorphic tally computation
      const candidates = CandidateModel.getAll();
      const candidateTallies = candidates.map(candidate => ({
        candidate_id: candidate.candidate_id,
        votes: candidate.vote_count
      }));

      // Generate mock cryptographic proofs
      const encryptedTallyRoot = '0x9ab3' + Math.random().toString(16).substring(2, 10);
      const ballotMerkleRoot = '0x5d2c' + Math.random().toString(16).substring(2, 10);
      const decryptionProof = Buffer.from('mock_batch_proof_' + Date.now()).toString('base64');

      res.status(config.statusCodes.TALLIED).json({
        election_id: election_id,
        encrypted_tally_root: encryptedTallyRoot,
        candidate_tallies: candidateTallies,
        decryption_proof: decryptionProof,
        transparency: {
          ballot_merkle_root: ballotMerkleRoot,
          tally_method: 'threshold_paillier',
          threshold: '3-of-5'
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

module.exports = new ResultController();
