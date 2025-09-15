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

      // Check if voter already exists by voter_id
      if (req.body.voter_id && VoterModel.exists(req.body.voter_id)) {
        return res.status(409).json({ 
          message: `voter with id: ${req.body.voter_id} already exists` 
        });
      }

      const voter = VoterModel.create(req.body);
      
      res.status(config.statusCodes.CREATED).json({
        voter_id: voter.voter_id,
        name: voter.name,
        age: voter.age,
        has_voted: voter.has_voted
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
        return res.status(417).json({ 
          message: `voter with id: ${voterId} was not found` 
        });
      }

      res.status(config.statusCodes.FOUND).json({
        voter_id: voter.voter_id,
        name: voter.name,
        age: voter.age,
        has_voted: voter.has_voted
      });
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
      
    const voterList = voters.map(({ voter_id, name, age }) => ({
      voter_id,
      name,
      age
    }));
    res.status(config.statusCodes.LISTED).json({
      voters: voterList
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
      const { age } = req.body;
      const voter = VoterModel.findById(voterId);

      if (!voter) {
        return res.status(404).json({ message: 'voter not found' });
      }

      if(age<18){
        return res.status(404).json({
            "message": `invalid age: ${age}, must be 18 or older`
        });
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

      const deleted = VoterModel.delete(voterId);
      
      if (deleted) {
        res.status(config.statusCodes.DELETED).json({
            message: `voter with id: ${voterId} deleted successfully`
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
