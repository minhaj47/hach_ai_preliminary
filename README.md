# Voting System API

A modular voting system API implementation with Map-based fast lookup for optimal performance.

## Features

- **Modular Architecture**: Organized with controllers, models, config, middleware, routes, and utilities
- **Fast Lookup**: Uses JavaScript Map for O(1) data access and retrieval
- **Complete API**: Implements all 20 voting system endpoints
- **Custom Status Codes**: Uses custom HTTP status codes (218-240) as specified
- **Memory-Based Storage**: In-memory data storage using Maps for fast operations

## Project Structure

```
src/
├── config/          # Configuration files
├── controllers/     # Request handlers
├── middleware/      # Custom middleware
├── models/          # Data models with Map storage
├── routes/          # API route definitions
├── utils/           # Utility functions
└── server.js        # Main application entry point
```

## API Endpoints

### Voter Management

- `POST /api/voters` - Create voter (Status 218)
- `GET /api/voters/{voter_id}` - Get voter info (Status 222)
- `GET /api/voters` - List all voters (Status 223)
- `PUT /api/voters/{voter_id}` - Update voter info
- `DELETE /api/voters/{voter_id}` - Delete voter

### Candidate Management

- `POST /api/candidates` - Register candidate (Status 226)
- `GET /api/candidates` - List candidates (Status 227)
- `GET /api/candidates?party={party_name}` - Filter by party (Status 230)

### Voting Operations

- `POST /api/votes` - Cast vote (Status 228)
- `GET /api/candidates/{candidate_id}/votes` - Get candidate votes (Status 229)
- `GET /api/results` - Voting results/leaderboard (Status 231)

### Advanced Features

- Vote timeline, weighted voting, encrypted ballots
- Homomorphic tally, differential privacy analytics
- Ranked-choice voting, risk-limiting audits

## Installation

```bash
npm install
```

## Usage

```bash
# Development
npm run dev

# Production
npm start
```

## Map-Based Storage

The system uses JavaScript Maps for fast O(1) lookup operations:

- Voters Map: `voterMap.get(voterId)`
- Candidates Map: `candidateMap.get(candidateId)`
- Votes Map: `voteMap.get(voteId)`
- Results caching for optimal performance
