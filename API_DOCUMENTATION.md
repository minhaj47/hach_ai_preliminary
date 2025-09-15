# Voting System API Documentation

## Overview

This is a complete implementation of a modular voting system API with Map-based fast lookup for optimal performance. The system implements all 20 voting system endpoints as specified in the HackAI preliminary problems.

## Base URL

```
http://localhost:3000
```

## Quick Start

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Run with sample data:**

   ```bash
   npm run dev:seed
   ```

3. **Run in production:**
   ```bash
   npm start
   ```

## Architecture

### Map-Based Fast Lookup

- **Voters Map**: O(1) voter lookup by ID
- **Candidates Map**: O(1) candidate lookup by ID
- **Votes Map**: O(1) vote lookup by ID
- **Party Index**: O(1) candidate filtering by party
- **Voter Index**: O(1) vote lookup by voter
- **Timeline Index**: O(1) vote timeline retrieval

## API Endpoints

### 1. Voter Management

#### Create Voter (Q1)

```http
POST /api/voters
Status: 218 Created
```

**Request Body:**

```json
{
  "full_name": "John Doe",
  "email": "john.doe@example.com",
  "age": 30,
  "address": "123 Main St, City, State",
  "phone": "+1234567890"
}
```

**Response:**

```json
{
  "voter_id": 1,
  "message": "voter registered successfully"
}
```

#### Get Voter by ID (Q2)

```http
GET /api/voters/{voter_id}
Status: 222 Found
```

#### List All Voters (Q3)

```http
GET /api/voters
Status: 223 Listed
```

#### Update Voter (Q4)

```http
PUT /api/voters/{voter_id}
Status: 224 Updated
```

#### Delete Voter (Q5)

```http
DELETE /api/voters/{voter_id}
Status: 225 Deleted
```

### 2. Candidate Management

#### Register Candidate (Q6)

```http
POST /api/candidates
Status: 226 Registered
```

**Request Body:**

```json
{
  "full_name": "Jane Smith",
  "party_name": "Progressive Party",
  "age": 45,
  "bio": "Experienced politician"
}
```

#### List Candidates (Q7)

```http
GET /api/candidates
Status: 227 Listed
```

#### Get Candidate Votes (Q9)

```http
GET /api/candidates/{candidate_id}/votes
Status: 229 Votes Retrieved
```

#### Filter Candidates by Party (Q10)

```http
GET /api/candidates?party={party_name}
Status: 230 Filtered
```

### 3. Voting Operations

#### Cast Vote (Q8)

```http
POST /api/votes
Status: 228 Vote Cast
```

**Request Body:**

```json
{
  "voter_id": 1,
  "candidate_id": 2
}
```

#### Get Voting Results (Q11)

```http
GET /api/results
Status: 231 Results
```

**Response:**

```json
{
  "total_votes": 5,
  "total_candidates": 4,
  "winner": {
    "rank": 1,
    "candidate_id": 1,
    "candidate_name": "John Martinez",
    "party_name": "Democratic Party",
    "votes": 3,
    "percentage": "60.00"
  },
  "leaderboard": [...]
}
```

### 4. Advanced Features

#### Vote Timeline (Q13)

```http
GET /api/votes/timeline?candidate_id={id}
Status: 233 Timeline
```

#### Weighted Vote (Q14)

```http
POST /api/votes/weighted
Status: 234 Weighted
```

#### Range Vote Query (Q15)

```http
GET /api/votes/range?candidate_id={id}&from={t1}&to={t2}
Status: 235 Range
```

#### Encrypted Ballot (Q16)

```http
POST /api/ballots/encrypted
Status: 236 Encrypted
```

**Request Body:**

```json
{
  "election_id": "nat-2025",
  "ciphertext": "base64(encrypted_vote)",
  "zk_proof": "base64(zero_knowledge_proof)",
  "voter_pubkey": "hex(public_key)",
  "nullifier": "hex(nullifier_hash)",
  "signature": "base64(signature)"
}
```

#### Homomorphic Tally (Q17)

```http
POST /api/results/homomorphic
Status: 237 Tallied
```

#### Differential Privacy Analytics (Q18)

```http
POST /api/analytics/dp
Status: 238 Private
```

**Request Body:**

```json
{
  "election_id": "nat-2025",
  "query": {
    "type": "histogram",
    "dimension": "voter_age_bucket",
    "buckets": ["18-24", "25-34", "35-44", "45-64", "65+"],
    "filter": { "has_voted": true }
  },
  "epsilon": 0.5,
  "delta": 1e-6
}
```

#### Ranked-Choice Ballot (Q19)

```http
POST /api/ballots/ranked
Status: 239 Ranked
```

#### Risk-Limiting Audit (Q20)

```http
POST /api/audits/plan
Status: 240 Audited
```

## Error Codes

- **409 Conflict**: Voter already exists, already voted
- **417 Expectation Failed**: Invalid expectation
- **422 Unprocessable Entity**: Validation error
- **423 Locked**: Cannot update after voting
- **424 Failed Dependency**: Invalid time range
- **425 Too Early**: Invalid ZK proof

## Testing

Run the test suite:

```bash
npm test
```

Example test commands:

```bash
# Health check
curl http://localhost:3000/health

# Create voter
curl -X POST http://localhost:3000/api/voters \
  -H "Content-Type: application/json" \
  -d '{"full_name":"Test User","email":"test@example.com","age":25,"address":"123 Test St","phone":"+1234567890"}'

# Get results
curl http://localhost:3000/api/results

# Vote timeline
curl "http://localhost:3000/api/votes/timeline?candidate_id=1"
```

## Docker Deployment

Build and run with Docker:

```bash
# Build image
docker build -t voting-api .

# Run container
docker run -p 3000:3000 voting-api

# Or use docker-compose
docker-compose up
```

## Performance Features

- **O(1) Lookups**: All primary operations use Map data structures
- **Secondary Indices**: Fast filtering and querying
- **Memory-based Storage**: No database overhead
- **Request Rate Limiting**: Built-in protection
- **Input Validation**: Comprehensive validation with Joi
- **Error Handling**: Centralized error management

## Security Features

- **CORS Protection**: Configurable cross-origin policies
- **Rate Limiting**: Prevents abuse
- **Input Validation**: Sanitizes all inputs
- **Helmet Security**: HTTP security headers
- **API Key Support**: Optional authentication

## Development

Start development server with file watching:

```bash
npm run dev
```

Start with sample data:

```bash
npm run dev:seed
```

Seed data manually:

```bash
npm run seed
```
