const VoterModel = require('../models/VoterModel');
const VoteModel = require('../models/VoteModel');
const config = require('../config/config');
const { validateVoter } = require('../utils/validation');

class VoterController {
  /**
   * Create a new voter (Q1)
   * POST /api/voters
   * Status: 218 Created
   */
  async createVoter(req, res) {
    try {
      const { error } = validateVoter(req.body);
      if (error) {
        return res.status(422).json({ message: error.details[0].message });
      }

      // Check if voter already exists
      const existingVoter = VoterModel.findByEmail(req.body.email);
      if (existingVoter) {
        return res.status(409).json({ message: 'voter already exists' });
      }

      const voter = VoterModel.create(req.body);
      
      res.status(config.statusCodes.CREATED).json({
        voter_id: voter.voter_id,
        message: 'voter registered successfully'
      });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  /**
   * Get voter by ID (Q2)
   * GET /api/voters/{voter_id}
   * Status: 222 Found
   */
  async getVoterById(req, res) {
    try {
      const voterId = req.params.voter_id;
      const voter = VoterModel.findById(voterId);

      if (!voter) {
        return res.status(404).json({ message: 'voter not found' });
      }

      res.status(config.statusCodes.FOUND).json(voter);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  /**
   * List all voters (Q3)
   * GET /api/voters
   * Status: 223 Listed
   */
  async getAllVoters(req, res) {
    try {
      const voters = VoterModel.getAll();
      
      res.status(config.statusCodes.LISTED).json({
        total: voters.length,
        voters: voters
      });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  /**
   * Update voter information (Q4)
   * PUT /api/voters/{voter_id}
   * Status: 224 Updated
   */
  async updateVoter(req, res) {
    try {
      const voterId = req.params.voter_id;
      const voter = VoterModel.findById(voterId);

      if (!voter) {
        return res.status(404).json({ message: 'voter not found' });
      }

      // Check if voter has already voted (cannot update after voting)
      if (VoteModel.hasVoterVoted(parseInt(voterId))) {
        return res.status(423).json({ message: 'cannot update: voter has already cast a vote' });
      }

      const updatedVoter = VoterModel.update(voterId, req.body);
      
      res.status(config.statusCodes.UPDATED).json({
        message: 'voter information updated',
        voter: updatedVoter
      });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  /**
   * Delete voter (Q5)
   * DELETE /api/voters/{voter_id}
   * Status: 225 Deleted
   */
  async deleteVoter(req, res) {
    try {
      const voterId = req.params.voter_id;
      const voter = VoterModel.findById(voterId);

      if (!voter) {
        return res.status(404).json({ message: 'voter not found' });
      }

      // Check if voter has already voted (cannot delete after voting)
      if (VoteModel.hasVoterVoted(parseInt(voterId))) {
        return res.status(423).json({ message: 'cannot delete: voter has already cast a vote' });
      }

      const deleted = VoterModel.delete(voterId);
      
      if (deleted) {
        res.status(config.statusCodes.DELETED).json({
          message: 'voter removed successfully'
        });
      } else {
        res.status(500).json({ message: 'Failed to delete voter' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

module.exports = new VoterController();
