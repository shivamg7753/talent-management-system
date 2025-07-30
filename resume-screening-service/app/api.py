# app/api.py

import pathlib
import os
from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from . import parser, skills, db

app = FastAPI(title="Batch AI Resume Screening")

RESUMES_DIR = pathlib.Path("/app/resumes")
JDS_DIR = pathlib.Path("/app/job_descriptions")

def get_db():
    session = db.SessionLocal()
    try:
        yield session
    finally:
        session.close()

@app.on_event("startup")
def on_startup():
    db.init_db()

# -----------------------------
# 🔷 Text Similarity Function
# -----------------------------
def calculate_text_similarity(resume_text: str, job_desc_text: str) -> float:
    """
    Robust similarity checker with safe handling for empty or invalid TF-IDF matrices.
    """
    try:
        resume_text = resume_text.strip().lower()
        job_desc_text = job_desc_text.strip().lower()

        if len(resume_text) < 10 or len(job_desc_text) < 10:
            print("⚠️ One of the texts is too short.")
            return 0.0

        texts = [resume_text, job_desc_text]

        vectorizer = TfidfVectorizer(stop_words='english', ngram_range=(1, 2))
        tfidf_matrix = vectorizer.fit_transform(texts)

        print(f"✅ TF-IDF matrix shape: {tfidf_matrix.shape}")

        if tfidf_matrix.shape[0] < 2 or tfidf_matrix.shape[1] == 0:
            print("⚠️ TF-IDF matrix is invalid or empty — skipping similarity.")
            return 0.0

        sim = cosine_similarity(tfidf_matrix[0], tfidf_matrix[1])
        return float(sim[0][0] * 100.0)

    except Exception as e:
        print(f"🚨 Text similarity failed: {e}")
        return 0.0

# -----------------------------
# 🔷 Extract JD Text
# -----------------------------
def extract_job_desc_text(jd_file: pathlib.Path) -> str:
    if jd_file.suffix.lower() == ".txt":
        return jd_file.read_text(encoding='utf-8')
    elif jd_file.suffix.lower() in {".docx", ".doc"}:
        return parser.extract_txt(jd_file)
    else:
        raise ValueError(f"Unsupported JD file type: {jd_file.suffix}")

# -----------------------------
# 🔷 Batch Screening Endpoint
# -----------------------------
@app.get("/batch_screen")
def batch_screen(db_session: Session = Depends(get_db)):
    if not RESUMES_DIR.exists() or not JDS_DIR.exists():
        raise HTTPException(status_code=500, detail="Resume or JD folder not found.")

    results = []
    processed_count = 0
    error_count = 0

    print(f"📁 Scanning resumes in: {RESUMES_DIR}")
    print(f"📁 Scanning JDs in: {JDS_DIR}")

    resume_files = [f for f in RESUMES_DIR.iterdir() if f.is_file() and f.suffix.lower() in {".pdf", ".docx", ".doc", ".txt"}]
    jd_files = [f for f in JDS_DIR.iterdir() if f.is_file() and f.suffix.lower() in {".txt", ".docx", ".doc"}]

    print(f"📄 Found {len(resume_files)} resume files")
    print(f"📋 Found {len(jd_files)} JD files")

    for resume_file in resume_files:
        print(f"🔍 Processing resume: {resume_file.name}")

        try:
            resume_txt = parser.extract_txt(resume_file)
            print(f"📝 {resume_file.name} → {len(resume_txt)} characters")

            email = parser.detect_email(resume_txt)
            extracted_skills = skills.extract_skills(resume_txt)

            print(f"  ✅ Parsed resume, found {len(extracted_skills)} skills")

        except Exception as e:
            print(f"  ❌ Failed to parse resume {resume_file.name}: {e}")
            error_count += 1
            continue

        for jd_file in jd_files:
            print(f"  🎯 Matching against JD: {jd_file.name}")
            try:
                jd_text = extract_job_desc_text(jd_file)
                score = calculate_text_similarity(resume_txt, jd_text)

                if score == 0.0:
                    print(f"  ⚠️ Skipped match: {resume_file.name} vs {jd_file.name}")
                    continue

                result = {
                    "resume_file": resume_file.name,
                    "email": email,
                    "jd_file": jd_file.name,
                    "match_score": round(score, 2),
                    "extracted_skills": extracted_skills,
                }

                results.append(result)

                db_record = db.CandidateMatch(
                    candidate=resume_file.name,
                    email=email,
                    match_score=score,
                    extracted_skills=extracted_skills,
                    jd_file=jd_file.name,
                    resume_path=str(resume_file),
                    total_skills_found=len(extracted_skills)
                )
                db_session.add(db_record)
                print(f"    ✅ Match score: {score:.2f}%")
                processed_count += 1

            except Exception as e:
                print(f"    ❌ Failed to match {resume_file.name} vs {jd_file.name}: {e}")
                error_count += 1
                continue

    try:
        db_session.commit()
        print(f"💾 Saved {len(results)} records to database")
    except Exception as e:
        print(f"❌ Database save failed: {e}")
        db_session.rollback()

    print(f"📊 Summary: {processed_count} matches, {error_count} errors")
    return {
        "results": results,
        "summary": {
            "total_matches": len(results),
            "resumes_processed": len(resume_files),
            "jds_processed": len(jd_files),
            "errors": error_count
        }
    }

# -----------------------------
# 🔷 Database Endpoints
# -----------------------------
@app.get("/database")
def view_database(db_session: Session = Depends(get_db)):
    try:
        records = db_session.query(db.CandidateMatch).all()
        candidates = []

        for record in records:
            candidates.append({
                "id": record.id,
                "candidate": record.candidate,
                "email": record.email,
                "match_score": record.match_score,
                "extracted_skills": record.extracted_skills
            })

        if candidates:
            scores = [c["match_score"] for c in candidates]
            avg_score = sum(scores) / len(scores)
            stats = {
                "total_candidates": len(candidates),
                "average_match_score": round(avg_score, 2),
                "highest_match_score": round(max(scores), 2),
                "lowest_match_score": round(min(scores), 2),
                "unique_skills_found": len(set(skill for c in candidates for skill in c["extracted_skills"])),
                "top_skills": list(set(skill for c in candidates for skill in c["extracted_skills"]))[:10]
            }
        else:
            stats = {"total_candidates": 0, "message": "No data found."}

        return {"status": "success", "statistics": stats, "candidates": candidates}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@app.get("/database/{candidate_id}")
def get_candidate(candidate_id: int, db_session: Session = Depends(get_db)):
    try:
        record = db_session.query(db.CandidateMatch).filter(db.CandidateMatch.id == candidate_id).first()
        if not record:
            raise HTTPException(status_code=404, detail="Candidate not found")
        return {
            "id": record.id,
            "candidate": record.candidate,
            "email": record.email,
            "match_score": record.match_score,
            "extracted_skills": record.extracted_skills
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# -----------------------------
# 🔷 Reset DB (Dev Only)
# -----------------------------
@app.post("/reset_database")
def reset_database():
    try:
        db.reset_db()
        return {"message": "✅ Database reset successfully with new schema"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Reset failed: {str(e)}")
