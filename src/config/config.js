module.exports = {
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development',
  
  // Custom status codes for voting system
  statusCodes: {
    CREATED: 218,         // Voter/Candidate created
    FOUND: 222,           // Voter found
    LISTED: 223,          // Voters listed
    UPDATED: 224,         // Voter updated
    DELETED: 225,         // Voter deleted
    REGISTERED: 226,      // Candidate registered
    CANDIDATES_LISTED: 227, // Candidates listed
    VOTED: 228,           // Vote cast
    VOTES_RETRIEVED: 229, // Candidate votes retrieved
    FILTERED: 230,        // Candidates filtered by party
    RESULTS: 231,         // Voting results
    WEIGHTED: 234,        // Weighted vote
    RANGE: 235,           // Range vote query
    ENCRYPTED: 236,       // Encrypted ballot
    TALLIED: 237,         // Homomorphic tally
    PRIVATE: 238,         // Differential privacy
    RANKED: 239,          // Ranked choice
    AUDITED: 240,         // Risk limiting audit
    TIMELINE: 233         // Vote timeline
  },
  
  // Error codes
  errorCodes: {
    CONFLICT: 409,
    EXPECTATION_FAILED: 417,
    UNPROCESSABLE_ENTITY: 422,
    LOCKED: 423,
    FAILED_DEPENDENCY: 424,
    TOO_EARLY: 425
  }
};
