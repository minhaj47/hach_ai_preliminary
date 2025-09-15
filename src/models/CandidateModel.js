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
      candidate_id: this.nextId++,
      full_name: candidateData.full_name,
      party_name: candidateData.party_name,
      age: candidateData.age,
      bio: candidateData.bio,
      created_at: new Date().toISOString(),
      vote_count: 0
    };

    // Store in Map for fast lookup
    this.candidatesMap.set(candidate.candidate_id, candidate);
    
    // Update party index
    this.updatePartyIndex(candidate.candidate_id, candidate.party_name);
    
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

    candidate.vote_count++;
    return true;
  }

  /**
   * Get candidate vote count
   * @param {number} candidateId - Candidate ID
   * @returns {number|null} Vote count or null
   */
  getVoteCount(candidateId) {
    const candidate = this.candidatesMap.get(parseInt(candidateId));
    return candidate ? candidate.vote_count : null;
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
  updatePartyIndex(candidateId, partyName) {
    if (!this.partyIndex.has(partyName)) {
      this.partyIndex.set(partyName, new Set());
    }
    this.partyIndex.get(partyName).add(candidateId);
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
    return this.getAll().sort((a, b) => b.vote_count - a.vote_count);
  }
}

// Export singleton instance
module.exports = new CandidateModel();
