const CandidateModel = require('../models/CandidateModel');
const config = require('../config/config');
const { validateCandidate } = require('../utils/validation');

class CandidateController {
  /**
   * Register a new candidate (Q6)
   * POST /api/candidates
   * Status: 226 Registered
   */
  async registerCandidate(req, res) {
    try {
      const { error } = validateCandidate(req.body);
      if (error) {
        return res.status(422).json({ message: error.details[0].message });
      }

      if (req.body.candidate_id && CandidateModel.findById(req.body.candidate_id)) {
          return res.status(409).json({ 
            message: `candidate with id: ${req.body.candidate_id} already exists` 
        });
      }

      const candidate = CandidateModel.create(req.body);
      
      res.status(config.statusCodes.REGISTERED).json({
        candidate_id: candidate.candidate_id,
        name: candidate.name,
        party: candidate.party,
        votes: candidate.votes
      });
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  /**
   * List all candidates (Q7)
   * GET /api/candidates
   * Status: 227 Listed
   */
  async getAllCandidates(req, res) {
    try {
      const { party } = req.query;
      
      let candidates;
      if (party) {
        // Filter by party (Q10)
        candidates = CandidateModel.getByParty(party);
        return res.status(config.statusCodes.FILTERED).json({
          party: party,
          total: candidates.length,
          candidates: candidates
        });
      } else {
        // Get all candidates
        candidates = CandidateModel.getAll();
        return res.status(config.statusCodes.CANDIDATES_LISTED).json({
          candidates: candidates
        });
      }
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  /**
   * Get candidate votes (Q9)
   * GET /api/candidates/{candidate_id}/votes
   * Status: 229 Votes Retrieved
   */
  async getCandidateVotes(req, res) {
    try {
      const candidateId = req.params.candidate_id;
      const candidate = CandidateModel.findById(candidateId);

      if (!candidate) {
        return res.status(404).json({ message: 'candidate not found' });
      }

      const voteCount = CandidateModel.getVoteCount(candidateId);
      
      res.status(config.statusCodes.VOTES_RETRIEVED).json({
        candidate_id: parseInt(candidateId),
        votes: voteCount
      });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  /**
   * Get candidate by ID
   * GET /api/candidates/{candidate_id}
   */
  async getCandidateById(req, res) {
    try {
      const candidateId = req.params.candidate_id;
      const candidate = CandidateModel.findById(candidateId);

      if (!candidate) {
        return res.status(404).json({ message: 'candidate not found' });
      }

      res.status(200).json(candidate);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

module.exports = new CandidateController();
