/**
 * Vote Model with Map-based storage for fast lookup
 */
class VoteModel {
  constructor() {
    // Use Map for O(1) lookup performance
    this.votesMap = new Map();
    this.nextId = 1;
    
    // Secondary indices for fast queries
    this.voterIndex = new Map();     // voter_id -> vote_id
    this.candidateIndex = new Map(); // candidate_id -> Set of vote_ids
    this.timelineIndex = new Map();  // candidate_id -> Array of {vote_id, timestamp}
  }

  /**
   * Cast a vote
   * @param {Object} voteData - Vote information
   * @returns {Object} Created vote
   */
  create(voteData) {
    const vote = {
      vote_id: this.nextId++,
      voter_id: voteData.voter_id,
      candidate_id: voteData.candidate_id,
      timestamp: new Date().toISOString(),
      weight: voteData.weight || 1
    };

    // Store in Map for fast lookup
    this.votesMap.set(vote.vote_id, vote);
    
    // Update indices
    this.updateIndices(vote);
    
    return vote;
  }

  /**
   * Find vote by ID - O(1) lookup
   * @param {number} voteId - Vote ID
   * @returns {Object|null} Vote or null
   */
  findById(voteId) {
    return this.votesMap.get(parseInt(voteId)) || null;
  }

  /**
   * Check if voter has already voted - O(1) lookup
   * @param {number} voterId - Voter ID
   * @returns {boolean} True if voter has voted
   */
  hasVoterVoted(voterId) {
    return this.voterIndex.has(parseInt(voterId));
  }

  /**
   * Get vote by voter ID - O(1) lookup
   * @param {number} voterId - Voter ID
   * @returns {Object|null} Vote or null
   */
  getByVoterId(voterId) {
    const voteId = this.voterIndex.get(parseInt(voterId));
    return voteId ? this.votesMap.get(voteId) : null;
  }

  /**
   * Get all votes for a candidate - O(1) lookup via index
   * @param {number} candidateId - Candidate ID
   * @returns {Array} Array of votes for the candidate
   */
  getByCandidateId(candidateId) {
    const voteIds = this.candidateIndex.get(parseInt(candidateId));
    if (!voteIds) return [];
    
    return Array.from(voteIds).map(id => this.votesMap.get(id));
  }

  /**
   * Get vote count for a candidate - O(1) lookup
   * @param {number} candidateId - Candidate ID
   * @returns {number} Vote count
   */
  getVoteCountForCandidate(candidateId) {
    const voteIds = this.candidateIndex.get(parseInt(candidateId));
    return voteIds ? voteIds.size : 0;
  }

  /**
   * Get vote timeline for a candidate - O(1) lookup
   * @param {number} candidateId - Candidate ID
   * @returns {Array} Timeline array with vote_id and timestamp
   */
  getTimelineForCandidate(candidateId) {
    return this.timelineIndex.get(parseInt(candidateId)) || [];
  }

  /**
   * Get votes within time range for a candidate
   * @param {number} candidateId - Candidate ID
   * @param {string} fromTime - Start time (ISO string)
   * @param {string} toTime - End time (ISO string)
   * @returns {number} Vote count in range
   */
  getVotesInRange(candidateId, fromTime, toTime) {
    const timeline = this.getTimelineForCandidate(candidateId);
    const from = new Date(fromTime);
    const to = new Date(toTime);
    
    if (from >= to) {
      throw new Error('invalid interval: from > to');
    }
    
    return timeline.filter(entry => {
      const voteTime = new Date(entry.timestamp);
      return voteTime >= from && voteTime <= to;
    }).length;
  }

  /**
   * Get all votes
   * @returns {Array} Array of all votes
   */
  getAll() {
    return Array.from(this.votesMap.values());
  }

  /**
   * Update indices when a vote is created
   * @private
   */
  updateIndices(vote) {
    const { vote_id, voter_id, candidate_id, timestamp } = vote;
    
    // Update voter index
    this.voterIndex.set(voter_id, vote_id);
    
    // Update candidate index
    if (!this.candidateIndex.has(candidate_id)) {
      this.candidateIndex.set(candidate_id, new Set());
    }
    this.candidateIndex.get(candidate_id).add(vote_id);
    
    // Update timeline index
    if (!this.timelineIndex.has(candidate_id)) {
      this.timelineIndex.set(candidate_id, []);
    }
    this.timelineIndex.get(candidate_id).push({ vote_id, timestamp });
  }

  /**
   * Get total vote count
   * @returns {number} Total votes cast
   */
  getTotalCount() {
    return this.votesMap.size;
  }
}

// Export singleton instance
module.exports = new VoteModel();
