/**
 * Voter Model with Map-based storage for fast lookup
 * Follows HackAI HTML specifications exactly
 */
class VoterModel {
  constructor() {
    // Use Map for O(1) lookup performance
    this.votersMap = new Map();
    this.nextId = 1;
  }

  /**
   * Create a new voter
   * @param {Object} voterData - Voter information {voter_id, name, age}
   * @returns {Object} Created voter
   */
  create(voterData) {
    const now = new Date().toISOString();
    const voter = {
      voter_id: voterData.voter_id || this.nextId++,
      name: voterData.name,
      age: voterData.age,
      has_voted: false,
      created_at: now,
      updated_at: now
    };

    // Store in Map for fast lookup
    this.votersMap.set(voter.voter_id, voter);
    
    return voter;
  }

  /**
   * Find voter by ID - O(1) lookup
   * @param {number} voterId - Voter ID
   * @returns {Object|null} Voter or null
   */
  findById(voterId) {
    return this.votersMap.get(parseInt(voterId)) || null;
  }

  /**
   * Check if voter exists by ID
   * @param {number} voterId - Voter ID
   * @returns {boolean} True if voter exists
   */
  exists(voterId) {
    return this.votersMap.has(parseInt(voterId));
  }

  /**
   * Get all voters
   * @returns {Array} Array of all voters
   */
  getAll() {
    return Array.from(this.votersMap.values());
  }

  /**
   * Update voter by ID
   * @param {number} voterId - Voter ID
   * @param {Object} updateData - Data to update {name, age}
   * @returns {Object|null} Updated voter or null
   */
  update(voterId, updateData) {
    const voter = this.votersMap.get(parseInt(voterId));
    if (!voter) return null;

    // Update allowed fields
    if (updateData.name !== undefined) voter.name = updateData.name;
    if (updateData.age !== undefined) voter.age = updateData.age;
    
    // Update timestamp when profile is modified
    voter.updated_at = new Date().toISOString();

    return voter;
  }

  /**
   * Delete voter by ID
   * @param {number} voterId - Voter ID
   * @returns {boolean} Success status
   */
  delete(voterId) {
    return this.votersMap.delete(parseInt(voterId));
  }

  /**
   * Mark voter as voted
   * @param {number} voterId - Voter ID
   * @returns {boolean} Success status
   */
  markAsVoted(voterId) {
    const voter = this.votersMap.get(parseInt(voterId));
    if (!voter) return false;

    voter.has_voted = true;
    return true;
  }

  /**
   * Get total count of voters
   * @returns {number} Total voter count
   */
  getCount() {
    return this.votersMap.size;
  }

  /**
   * Clear all voters (for testing)
   */
  clear() {
    this.votersMap.clear();
    this.nextId = 1;
  }
}

// Export singleton instance
module.exports = new VoterModel();
