const request = require('supertest');
const app = require('../src/server');

describe('Voting System API Tests', () => {
  let voterId, candidateId, voteId;

  describe('Voter Management', () => {
    test('POST /api/voters - Create voter (Status 218)', async () => {
      const voterData = {
        full_name: 'John Doe',
        email: 'john.doe@example.com',
        age: 30,
        address: '123 Main St, City, State',
        phone: '+1234567890'
      };

      const response = await request(app)
        .post('/api/voters')
        .send(voterData)
        .expect(218);

      expect(response.body).toHaveProperty('voter_id');
      expect(response.body.message).toBe('voter registered successfully');
      voterId = response.body.voter_id;
    });

    test('GET /api/voters/{voter_id} - Get voter (Status 222)', async () => {
      const response = await request(app)
        .get(`/api/voters/${voterId}`)
        .expect(222);

      expect(response.body).toHaveProperty('voter_id', voterId);
      expect(response.body.full_name).toBe('John Doe');
    });

    test('GET /api/voters - List all voters (Status 223)', async () => {
      const response = await request(app)
        .get('/api/voters')
        .expect(223);

      expect(response.body).toHaveProperty('total');
      expect(response.body).toHaveProperty('voters');
      expect(Array.isArray(response.body.voters)).toBe(true);
    });
  });

  describe('Candidate Management', () => {
    test('POST /api/candidates - Register candidate (Status 226)', async () => {
      const candidateData = {
        full_name: 'Jane Smith',
        party_name: 'Progressive Party',
        age: 45,
        bio: 'Experienced politician with focus on environmental issues'
      };

      const response = await request(app)
        .post('/api/candidates')
        .send(candidateData)
        .expect(226);

      expect(response.body).toHaveProperty('candidate_id');
      expect(response.body.message).toBe('candidate registered successfully');
      candidateId = response.body.candidate_id;
    });

    test('GET /api/candidates - List candidates (Status 227)', async () => {
      const response = await request(app)
        .get('/api/candidates')
        .expect(227);

      expect(response.body).toHaveProperty('total');
      expect(response.body).toHaveProperty('candidates');
      expect(Array.isArray(response.body.candidates)).toBe(true);
    });

    test('GET /api/candidates?party=Progressive%20Party - Filter by party (Status 230)', async () => {
      const response = await request(app)
        .get('/api/candidates?party=Progressive%20Party')
        .expect(230);

      expect(response.body).toHaveProperty('party', 'Progressive Party');
      expect(response.body).toHaveProperty('candidates');
    });
  });

  describe('Voting Operations', () => {
    test('POST /api/votes - Cast vote (Status 228)', async () => {
      const voteData = {
        voter_id: voterId,
        candidate_id: candidateId
      };

      const response = await request(app)
        .post('/api/votes')
        .send(voteData)
        .expect(228);

      expect(response.body).toHaveProperty('vote_id');
      expect(response.body.message).toBe('vote cast successfully');
      voteId = response.body.vote_id;
    });

    test('GET /api/candidates/{candidate_id}/votes - Get candidate votes (Status 229)', async () => {
      const response = await request(app)
        .get(`/api/candidates/${candidateId}/votes`)
        .expect(229);

      expect(response.body).toHaveProperty('candidate_id', candidateId);
      expect(response.body).toHaveProperty('total_votes', 1);
    });

    test('GET /api/results - Get results (Status 231)', async () => {
      const response = await request(app)
        .get('/api/results')
        .expect(231);

      expect(response.body).toHaveProperty('total_votes');
      expect(response.body).toHaveProperty('leaderboard');
      expect(Array.isArray(response.body.leaderboard)).toBe(true);
    });
  });

  describe('Advanced Features', () => {
    test('GET /api/votes/timeline - Vote timeline (Status 233)', async () => {
      const response = await request(app)
        .get(`/api/votes/timeline?candidate_id=${candidateId}`)
        .expect(233);

      expect(response.body).toHaveProperty('candidate_id', candidateId);
      expect(response.body).toHaveProperty('timeline');
      expect(Array.isArray(response.body.timeline)).toBe(true);
    });

    test('POST /api/ballots/encrypted - Encrypted ballot (Status 236)', async () => {
      const ballotData = {
        election_id: 'test-2025',
        ciphertext: 'base64encodedciphertext',
        zk_proof: 'base64encodedproof',
        voter_pubkey: 'hexencodedpubkey',
        nullifier: 'hexencodednullifier',
        signature: 'base64encodedsignature'
      };

      const response = await request(app)
        .post('/api/ballots/encrypted')
        .send(ballotData)
        .expect(236);

      expect(response.body).toHaveProperty('ballot_id');
      expect(response.body.status).toBe('accepted');
    });

    test('POST /api/analytics/dp - Differential privacy (Status 238)', async () => {
      const queryData = {
        election_id: 'test-2025',
        query: {
          type: 'histogram',
          dimension: 'voter_age_bucket',
          buckets: ['18-24', '25-34', '35-44', '45-64', '65+'],
          filter: { has_voted: true }
        },
        epsilon: 0.5,
        delta: 1e-6
      };

      const response = await request(app)
        .post('/api/analytics/dp')
        .send(queryData)
        .expect(238);

      expect(response.body).toHaveProperty('answer');
      expect(response.body).toHaveProperty('epsilon_spent', 0.5);
    });
  });

  describe('Error Handling', () => {
    test('POST /api/voters - Duplicate email (Status 409)', async () => {
      const voterData = {
        full_name: 'John Duplicate',
        email: 'john.doe@example.com', // Same email as first voter
        age: 25,
        address: '456 Oak St, City, State',
        phone: '+9876543210'
      };

      const response = await request(app)
        .post('/api/voters')
        .send(voterData)
        .expect(409);

      expect(response.body.message).toBe('voter already exists');
    });

    test('POST /api/votes - Double voting (Status 409)', async () => {
      const voteData = {
        voter_id: voterId,
        candidate_id: candidateId
      };

      const response = await request(app)
        .post('/api/votes')
        .send(voteData)
        .expect(409);

      expect(response.body.message).toBe('voter has already cast a vote');
    });

    test('GET /api/voters/999 - Voter not found (Status 404)', async () => {
      const response = await request(app)
        .get('/api/voters/999')
        .expect(404);

      expect(response.body.message).toBe('voter not found');
    });
  });
});

module.exports = app;
