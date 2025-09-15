const VoteModel = require('../models/VoteModel');
const VoterModel = require('../models/VoterModel');
const CandidateModel = require('../models/CandidateModel');
const config = require('../config/config');
const { validateVote } = require('../utils/validation');

class VoteController {
  /**
   * Cast a vote (Q8)
   * POST /api/votes
   * Status: 228 Voted
   */
  async castVote(req, res) {
    try {
      const { error } = validateVote(req.body);
      if (error) {
        return res.status(422).json({ message: error.details[0].message });
      }

      const { voter_id, candidate_id } = req.body;
      
      // Check if voter exists
      const voter = VoterModel.findById(voter_id);
      if (!voter) {
        return res.status(404).json({ message: 'voter not found' });
      }

      // Check if candidate exists
      const candidate = CandidateModel.findById(candidate_id);
      if (!candidate) {
        return res.status(404).json({ message: 'candidate not found' });
      }

      // Check if voter has already voted
      if (VoteModel.hasVoterVoted(voter_id)) {
        return res.status(423).json({ message: `voter with id: ${voter_id} has already voted` });
      }

      // Cast the vote
      const vote = VoteModel.create({ voter_id, candidate_id });
      
      // Update candidate vote count
      CandidateModel.incrementVotes(candidate_id);
      
      // Mark voter as voted
      VoterModel.markAsVoted(voter_id);

      res.status(config.statusCodes.VOTED).json({
        vote_id: vote.vote_id,
        voter_id: vote.voter_id,
        candidate_id: vote.candidate_id,
        timestamp: vote.timestamp
      });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  /**
   * Cast a weighted vote (Q14)
   * POST /api/votes/weighted
   * Status: 234 Weighted
   */
  async castWeightedVote(req, res) {
    try {
      const { error } = validateVote(req.body);
      if (error) {
        return res.status(422).json({ message: error.details[0].message });
      }

      const { voter_id, candidate_id } = req.body;

      // Check if voter exists
      const voter = VoterModel.findById(voter_id);
      if (!voter) {
        return res.status(404).json({ message: 'voter not found' });
      }

      // Check if candidate exists
      const candidate = CandidateModel.findById(candidate_id);
      if (!candidate) {
        return res.status(404).json({ message: 'candidate not found' });
      }

      // Check if voter has already voted
      if (VoteModel.hasVoterVoted(voter_id)) {
        return res.status(409).json({ message: 'voter has already cast a vote' });
      }

      // Determine weight based on voter profile update status
      // Weight = 2 if voter has updated profile recently, 1 otherwise
      const weight = voter.updated_at !== voter.created_at ? 2 : 1;

      // Cast the weighted vote
      const vote = VoteModel.create({ voter_id, candidate_id, weight });
      
      // Update candidate vote count (considering weight)
      for (let i = 0; i < weight; i++) {
        CandidateModel.incrementVotes(candidate_id);
      }
      
      // Mark voter as voted
      VoterModel.markAsVoted(voter_id);

      res.status(config.statusCodes.WEIGHTED).json({
        vote_id: vote.vote_id,
        voter_id: voter_id,
        candidate_id: candidate_id,
        weight: weight
      });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  /**
   * Get vote timeline for candidate (Q13)
   * GET /api/votes/timeline?candidate_id={id}
   * Status: 233 Timeline
   */
  async getVoteTimeline(req, res) {
    try {
      const candidateId = req.query.candidate_id;

      if (!candidateId) {
        return res.status(400).json({ message: 'candidate_id is required' });
      }

      // Check if candidate exists
      const candidate = CandidateModel.findById(candidateId);
      if (!candidate) {
        return res.status(404).json({ message: 'candidate not found' });
      }

      const timeline = VoteModel.getTimelineForCandidate(candidateId);

      res.status(config.statusCodes.TIMELINE).json({
        candidate_id: parseInt(candidateId),
        timeline: timeline
      });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  /**
   * Get votes in range for candidate (Q15)
   * GET /api/votes/range?candidate_id={id}&from={t1}&to={t2}
   * Status: 235 Range
   */
  async getVotesInRange(req, res) {
    try {
      const { candidate_id, from, to } = req.query;

      if (!candidate_id || !from || !to) {
        return res.status(400).json({ message: 'candidate_id, from, and to are required' });
      }

      // Check if candidate exists
      const candidate = CandidateModel.findById(candidate_id);
      if (!candidate) {
        return res.status(404).json({ message: 'candidate not found' });
      }

      try {
        const votesGained = VoteModel.getVotesInRange(candidate_id, from, to);

        res.status(config.statusCodes.RANGE).json({
          candidate_id: parseInt(candidate_id),
          from: from,
          to: to,
          votes_gained: votesGained
        });
      } catch (rangeError) {
        return res.status(424).json({ message: rangeError.message });
      }
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

module.exports = new VoteController();
