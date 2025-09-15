const VoteModel = require('../models/VoteModel');
const VoterModel = require('../models/VoterModel');
const CandidateModel = require('../models/CandidateModel');
const config = require('../config/config');
const { validateVote } = require('../utils/validation');

/**
 * Normalize various timestamp formats to ISO 8601
 * @param {string} timestamp - Input timestamp in various formats
 * @returns {string} Normalized ISO 8601 timestamp
 */
function normalizeTimestamp(timestamp) {
  // Handle Unix timestamp (seconds or milliseconds)
  if (/^\d{10}$/.test(timestamp)) {
    // 10 digits = Unix timestamp in seconds
    return new Date(parseInt(timestamp) * 1000).toISOString();
  }
  if (/^\d{13}$/.test(timestamp)) {
    // 13 digits = Unix timestamp in milliseconds
    return new Date(parseInt(timestamp)).toISOString();
  }
  
  // Handle US format: MM/DD/YYYY or MM/DD/YYYY HH:mm:ss
  const usDateMatch = timestamp.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{1,2}):(\d{1,2}))?$/);
  if (usDateMatch) {
    const [, month, day, year, hour = '00', minute = '00', second = '00'] = usDateMatch;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${hour.padStart(2, '0')}:${minute.padStart(2, '0')}:${second.padStart(2, '0')}.000Z`;
  }
  
  // Handle EU format: DD/MM/YYYY or DD/MM/YYYY HH:mm:ss
  const euDateMatch = timestamp.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{1,2}):(\d{1,2}))?$/);
  if (euDateMatch) {
    const [, day, month, year, hour = '00', minute = '00', second = '00'] = euDateMatch;
    // Only treat as EU format if day > 12 (otherwise ambiguous with US format)
    if (parseInt(day) > 12) {
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${hour.padStart(2, '0')}:${minute.padStart(2, '0')}:${second.padStart(2, '0')}.000Z`;
    }
  }
  
  // Handle space-separated format: YYYY-MM-DD HH:mm:ss
  const spaceMatch = timestamp.match(/^(\d{4})-(\d{1,2})-(\d{1,2})\s+(\d{1,2}):(\d{1,2}):(\d{1,2})$/);
  if (spaceMatch) {
    const [, year, month, day, hour, minute, second] = spaceMatch;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${hour.padStart(2, '0')}:${minute.padStart(2, '0')}:${second.padStart(2, '0')}.000Z`;
  }
  
  // Handle date-only format: YYYY-MM-DD
  const dateOnlyMatch = timestamp.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (dateOnlyMatch) {
    const [, year, month, day] = dateOnlyMatch;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T00:00:00.000Z`;
  }
  
  // Handle ISO 8601 formats - only if they look like valid ISO formats
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(timestamp) || 
      /^\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}/.test(timestamp)) {
    let normalized = timestamp;
    
    // Convert space to T if needed
    normalized = normalized.replace(/(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2}:\d{2})/, '$1T$2');
    
    // Add timezone if missing
    if (!normalized.includes('Z') && !normalized.includes('+') && !normalized.includes('-', 10)) {
      // Add milliseconds if missing
      if (!normalized.includes('.')) {
        normalized += '.000';
      }
      normalized += 'Z';
    }
    
    return normalized;
  }
  
  // If no pattern matches, return the original timestamp
  // This will likely cause a validation error downstream
  return timestamp;
}

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
      CandidateModel.incrementVotesByWeight(candidate_id, weight);
      
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
        // Comprehensive date format normalization
        const normalizedFrom = normalizeTimestamp(from);
        const normalizedTo = normalizeTimestamp(to);
        
        // Validate normalized dates
        const fromDate = new Date(normalizedFrom);
        const toDate = new Date(normalizedTo);
        
        if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
          return res.status(400).json({ 
            message: 'Invalid date format. Supported formats: ISO 8601 (2025-09-15T10:00:00Z), Date only (2025-09-15), US format (09/15/2025), EU format (15/09/2025), Unix timestamp, or space-separated (2025-09-15 10:00:00)' 
          });
        }
        
        if (fromDate > toDate) {
          return res.status(400).json({ 
            message: 'invalid interval: from > to'
          });
        }
        
        const votesGained = VoteModel.getVotesInRange(candidate_id, normalizedFrom, normalizedTo);

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
