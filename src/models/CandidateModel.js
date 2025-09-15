/**
 * Candidate Model with Map-based storage for fast lookup
 */
class CandidateModel {
  constructor() {
    // Use Map for O(1) lookup performance
    this.candidatesMap = new Map();
    this.nextId = 1;
    
    // Secondary indices for fast filtering
    this.partyIndex = new Map(); // party_name -> Set of candidate_ids
  }

  /**
   * Create a new candidate
   * @param {Object} candidateData - Candidate information
   * @returns {Object} Created candidate
   */
  create(candidateData) {
    const candidate = {
      candidate_id: candidateData.candidate_id || this.nextId++,
      name: candidateData.name,
      party: candidateData.party,
      votes: 0
    };

    // Store in Map for fast lookup
    this.candidatesMap.set(candidate.candidate_id, candidate);
    
    // Update party index
    this.updatePartyIndex(candidate.candidate_id, candidate.party);
    
    return candidate;
  }

  /**
   * Find candidate by ID - O(1) lookup
   * @param {number} candidateId - Candidate ID
   * @returns {Object|null} Candidate or null
   */
  findById(candidateId) {
    return this.candidatesMap.get(parseInt(candidateId)) || null;
  }

  /**
   * Get all candidates
   * @returns {Array} Array of all candidates
   */
  getAll() {
    return Array.from(this.candidatesMap.values());
  }

  /**
   * Filter candidates by party - O(1) lookup via index
   * @param {string} partyName - Party name
   * @returns {Array} Array of candidates from the party
   */
  getByParty(partyName) {
    const candidateIds = this.partyIndex.get(partyName);
    if (!candidateIds) return [];
    
    return Array.from(candidateIds).map(id => this.candidatesMap.get(id));
  }

  /**
   * Increment vote count for candidate
   * @param {number} candidateId - Candidate ID
   * @returns {boolean} Success status
   */
  incrementVotes(candidateId) {
    const candidate = this.candidatesMap.get(parseInt(candidateId));
    if (!candidate) return false;

    candidate.votes++;
    return true;
  }

  /**
   * Get candidate vote count
   * @param {number} candidateId - Candidate ID
   * @returns {number|null} Vote count or null
   */
  getVoteCount(candidateId) {
    const candidate = this.candidatesMap.get(parseInt(candidateId));
    return candidate ? candidate.votes : null;
  }

  /**
   * Get all parties
   * @returns {Array} Array of unique party names
   */
  getAllParties() {
    return Array.from(this.partyIndex.keys());
  }

  /**
   * Update party index
   * @private
   */
  updatePartyIndex(candidateId, party) {
    if (!this.partyIndex.has(party)) {
      this.partyIndex.set(party, new Set());
    }
    this.partyIndex.get(party).add(candidateId);
  }

  /**
   * Get total count of candidates
   * @returns {number} Total candidate count
   */
  getCount() {
    return this.candidatesMap.size;
  }

  /**
   * Get candidates sorted by vote count (leaderboard)
   * @returns {Array} Sorted candidates array
   */
  getLeaderboard() {
    return this.getAll().sort((a, b) => b.votes - a.votes);
  }
}

// Export singleton instance
module.exports = new CandidateModel();
