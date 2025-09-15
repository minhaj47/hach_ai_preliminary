const Joi = require('joi');

/**
 * Validation schemas using Joi
 */
const validationSchemas = {
  voter: Joi.object({
    full_name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    age: Joi.number().integer().min(18).max(120).required(),
    address: Joi.string().min(5).max(200).required(),
    phone: Joi.string().pattern(/^[\+]?[1-9][\d]{0,15}$/).required()
  }),

  candidate: Joi.object({
    full_name: Joi.string().min(2).max(100).required(),
    party_name: Joi.string().min(2).max(50).required(),
    age: Joi.number().integer().min(25).max(120).required(),
    bio: Joi.string().max(500).optional()
  }),

  vote: Joi.object({
    voter_id: Joi.number().integer().positive().required(),
    candidate_id: Joi.number().integer().positive().required()
  }),

  encryptedBallot: Joi.object({
    election_id: Joi.string().required(),
    ciphertext: Joi.string().required(),
    zk_proof: Joi.string().required(),
    voter_pubkey: Joi.string().required(),
    nullifier: Joi.string().required(),
    signature: Joi.string().required()
  }),

  rankedBallot: Joi.object({
    election_id: Joi.string().required(),
    voter_id: Joi.number().integer().positive().required(),
    ranking: Joi.array().items(Joi.number().integer().positive()).min(1).required(),
    timestamp: Joi.string().isoDate().optional()
  }),

  dpQuery: Joi.object({
    election_id: Joi.string().required(),
    query: Joi.object({
      type: Joi.string().valid('histogram', 'count', 'mean').required(),
      dimension: Joi.string().required(),
      buckets: Joi.array().items(Joi.string()).optional(),
      filter: Joi.object().optional()
    }).required(),
    epsilon: Joi.number().positive().max(10).required(),
    delta: Joi.number().positive().max(1).required()
  }),

  auditPlan: Joi.object({
    election_id: Joi.string().required(),
    reported_tallies: Joi.array().items(
      Joi.object({
        candidate_id: Joi.number().integer().positive().required(),
        votes: Joi.number().integer().min(0).required()
      })
    ).min(2).required(),
    risk_limit_alpha: Joi.number().positive().max(0.5).required(),
    audit_type: Joi.string().valid('ballot_polling', 'comparison', 'ballot_comparison').required(),
    stratification: Joi.object().optional()
  })
};

/**
 * Validation functions
 */
const validateVoter = (data) => validationSchemas.voter.validate(data);
const validateCandidate = (data) => validationSchemas.candidate.validate(data);
const validateVote = (data) => validationSchemas.vote.validate(data);
const validateEncryptedBallot = (data) => validationSchemas.encryptedBallot.validate(data);
const validateRankedBallot = (data) => validationSchemas.rankedBallot.validate(data);
const validateDpQuery = (data) => validationSchemas.dpQuery.validate(data);
const validateAuditPlan = (data) => validationSchemas.auditPlan.validate(data);

module.exports = {
  validateVoter,
  validateCandidate,
  validateVote,
  validateEncryptedBallot,
  validateRankedBallot,
  validateDpQuery,
  validateAuditPlan
};
