const VoterModel = require('../models/VoterModel');
const CandidateModel = require('../models/CandidateModel');
const VoteModel = require('../models/VoteModel');

/**
 * Seed data script to populate the voting system with sample data
 */
function seedData() {
  console.log('🌱 Seeding voting system with sample data...');

  // Sample voters
  const voters = [
    {
      full_name: 'Alice Johnson',
      email: 'alice.johnson@email.com',
      age: 28,
      address: '123 Main Street, Springfield, IL',
      phone: '+15551234567'
    },
    {
      full_name: 'Bob Smith',
      email: 'bob.smith@email.com',
      age: 35,
      address: '456 Oak Avenue, Springfield, IL',
      phone: '+15559876543'
    },
    {
      full_name: 'Carol Williams',
      email: 'carol.williams@email.com',
      age: 42,
      address: '789 Pine Road, Springfield, IL',
      phone: '+15555551212'
    },
    {
      full_name: 'David Brown',
      email: 'david.brown@email.com',
      age: 31,
      address: '321 Elm Street, Springfield, IL',
      phone: '+15554567890'
    },
    {
      full_name: 'Emma Davis',
      email: 'emma.davis@email.com',
      age: 26,
      address: '654 Maple Lane, Springfield, IL',
      phone: '+15557890123'
    }
  ];

  // Sample candidates
  const candidates = [
    {
      full_name: 'John Martinez',
      party_name: 'Democratic Party',
      age: 45,
      bio: 'Experienced legislator focused on healthcare reform and education funding'
    },
    {
      full_name: 'Sarah Thompson',
      party_name: 'Republican Party',
      age: 38,
      bio: 'Business owner advocating for economic growth and small business support'
    },
    {
      full_name: 'Michael Green',
      party_name: 'Green Party',
      age: 52,
      bio: 'Environmental scientist committed to sustainable energy and climate action'
    },
    {
      full_name: 'Lisa Chen',
      party_name: 'Independent',
      age: 41,
      bio: 'Former prosecutor focusing on criminal justice reform and community safety'
    }
  ];

  // Create voters
  const createdVoters = voters.map(voterData => {
    const voter = VoterModel.create(voterData);
    console.log(`👤 Created voter: ${voter.full_name} (ID: ${voter.voter_id})`);
    return voter;
  });

  // Create candidates
  const createdCandidates = candidates.map(candidateData => {
    const candidate = CandidateModel.create(candidateData);
    console.log(`🗳️  Created candidate: ${candidate.full_name} - ${candidate.party_name} (ID: ${candidate.candidate_id})`);
    return candidate;
  });

  // Cast some sample votes
  const votes = [
    { voter_id: createdVoters[0].voter_id, candidate_id: createdCandidates[0].candidate_id },
    { voter_id: createdVoters[1].voter_id, candidate_id: createdCandidates[1].candidate_id },
    { voter_id: createdVoters[2].voter_id, candidate_id: createdCandidates[0].candidate_id },
    { voter_id: createdVoters[3].voter_id, candidate_id: createdCandidates[2].candidate_id },
    { voter_id: createdVoters[4].voter_id, candidate_id: createdCandidates[0].candidate_id }
  ];

  votes.forEach(voteData => {
    const vote = VoteModel.create(voteData);
    CandidateModel.incrementVotes(voteData.candidate_id);
    VoterModel.markAsVoted(voteData.voter_id);
    
    const voter = VoterModel.findById(voteData.voter_id);
    const candidate = CandidateModel.findById(voteData.candidate_id);
    console.log(`✅ ${voter.full_name} voted for ${candidate.full_name} (Vote ID: ${vote.vote_id})`);
  });

  console.log('\n📊 Current Results:');
  const results = CandidateModel.getLeaderboard();
  results.forEach((candidate, index) => {
    console.log(`${index + 1}. ${candidate.full_name} (${candidate.party_name}): ${candidate.vote_count} votes`);
  });

  console.log('\n🎉 Sample data seeding completed!');
  console.log(`Total Voters: ${VoterModel.getCount()}`);
  console.log(`Total Candidates: ${CandidateModel.getCount()}`);
  console.log(`Total Votes Cast: ${VoteModel.getTotalCount()}`);
}

// Export for use in other modules
module.exports = { seedData };

// Run if called directly
if (require.main === module) {
  seedData();
}
