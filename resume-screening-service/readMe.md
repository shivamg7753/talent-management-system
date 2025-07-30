# AI Resume Screening System

## 🚀 How to Run

### 1. Setup Environment
```bash
# Clone repository
git clone <repository-url>
cd resume-checker

# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
python -m spacy download en_core_web_sm
```

### 2. Configure Database
Create `.env` file:
```env
DATABASE_URL=postgresql://username:password@host:port/database?sslmode=require
```

### 3. Create Required Folders
```bash
mkdir -p resumes job_descriptions uploads
```

### 4. Start Server
```bash
uvicorn app.api:app --reload
```

Server runs at: `http://localhost:8000`

## 📁 File Structure

```
resume-checker/
├── app/
│   ├── __init__.py
│   ├── api.py          # FastAPI routes and endpoints
│   ├── db.py           # Database models and utilities
│   ├── parser.py       # Resume text extraction
│   ├── skills.py       # AI skill extraction
│   └── .env              # Environment variables
├── resumes/           # Place resume files here (PDF/DOCX/TXT)
├── job_descriptions/  # Place JD files here (DOCX/TXT)
├── uploads/           # Temporary file storage
├── .cache/            # Hugging Face model cache
├── requirements.txt
└── README.md
```

## 🔗 API Endpoints

### Batch Resume Screening
**Process all resumes against all job descriptions**
```bash
GET /batch_screen
```

**Response:**
```json
{
  "results": [
    {
      "resume_file": "john_doe.txt",
      "email": "john.doe@example.com", 
      "jd_file": "ml_engineer.txt",
      "match_score": 84.23,
      "extracted_skills": ["Python", "AWS", "Machine Learning"]
    }
  ],
  "summary": {
    "total_matches": 4,
    "resumes_processed": 2,
    "jds_processed": 2,
    "errors": 0
  }
}
```

### View All Database Records
**Get all candidate matches with statistics**
```bash
GET /database
```

**Response:**
```json
{
  "status": "success",
  "statistics": {
    "total_candidates": 4,
    "average_match_score": 67.85,
    "highest_match_score": 84.23,
    "unique_skills_found": 12
  },
  "candidates": [...]
}
```

### Get Specific Candidate
**Retrieve candidate by ID**
```bash
GET /database/{candidate_id}
```

### Reset Database
**⚠️ Delete all data and recreate tables**
```bash
POST /reset_database
```

## 📄 Sample Files

**Place in `resumes/` folder:**
```text
John Doe
Email: john.doe@example.com
Skills: Python, Machine Learning, AWS, Docker
Experience: 3+ years in software development
```

**Place in `job_descriptions/` folder:**
```text
Job Title: Machine Learning Engineer
Required Skills: Python, AWS, Docker, Machine Learning
We need someone with ML experience and cloud computing skills.
```

## 🧪 Test Commands

```bash
# Process resumes
curl http://localhost:8000/batch_screen

# View results
curl http://localhost:8000/database

# Reset database
curl -X POST http://localhost:8000/reset_database
```

That's it! The system will automatically extract skills, calculate match scores, and store results in PostgreSQL.

Sources
