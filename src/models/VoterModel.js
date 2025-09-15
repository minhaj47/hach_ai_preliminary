const { v4: uuidv4 } = require('uuid');

/**
 * Voter Model with Map-based storage for fast lookup
 */
class VoterModel {
  constructor() {
    // Use Map for O(1) lookup performance
    this.votersMap = new Map();
    this.nextId = 1;
  }

  /**
   * Create a new voter
   * @param {Object} voterData - Voter information
   * @returns {Object} Created voter
   */
  create(voterData) {
    const voter = {
      voter_id: this.nextId++,
      full_name: voterData.full_name,
      email: voterData.email,
      age: voterData.age,
      address: voterData.address,
      phone: voterData.phone,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      has_voted: false
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
   * Find voter by email - O(n) search
   * @param {string} email - Voter email
   * @returns {Object|null} Voter or null
   */
  findByEmail(email) {
    for (const voter of this.votersMap.values()) {
      if (voter.email === email) {
        return voter;
      }
    }
    return null;
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
   * @param {Object} updateData - Data to update
   * @returns {Object|null} Updated voter or null
   */
  update(voterId, updateData) {
    const voter = this.votersMap.get(parseInt(voterId));
    if (!voter) return null;

    // Update fields
    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        voter[key] = updateData[key];
      }
    });

    voter.updated_at = new Date().toISOString();
    
    // Update in Map
    this.votersMap.set(parseInt(voterId), voter);
    
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
    voter.updated_at = new Date().toISOString();
    
    return true;
  }

  /**
   * Get total count of voters
   * @returns {number} Total voter count
   */
  getCount() {
    return this.votersMap.size;
  }
}

// Export singleton instance
module.exports = new VoterModel();
