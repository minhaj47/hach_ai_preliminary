const Joi = require('joi');

/**
 * Validation schemas using Joi - Following HackAI HTML specifications exactly
 */
const validationSchemas = {
  voter: Joi.object({
    voter_id: Joi.number().integer().positive().optional(), // Optional for create, required for update
    name: Joi.string().min(1).max(100).required(),
    age: Joi.number().integer().min(18).max(120).required()
  }),

  candidate: Joi.object({
    candidate_id: Joi.number().integer().positive().optional(),
    name: Joi.string().min(2).max(100).required(),
    party: Joi.string().min(2).max(50).required()
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
