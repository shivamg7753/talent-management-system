# app/db.py

import os
import logging
from datetime import datetime, timedelta
from typing import Optional, List
from sqlalchemy import create_engine, Column, Integer, String, Float, JSON, DateTime, Text, Boolean, text
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from sqlalchemy.exc import SQLAlchemyError
from dotenv import load_dotenv

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Database configuration
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("❌ DATABASE_URL is not set in .env file")

# Validate and fix database URL format
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)
    logger.info("✅ Fixed database URL format (postgres:// → postgresql://)")

# SQLAlchemy engine configuration with better settings
engine = create_engine(
    DATABASE_URL,
    echo=False,  # Set to True for SQL debugging
    pool_size=10,
    max_overflow=20,
    pool_pre_ping=True,  # Validates connections before use
    pool_recycle=3600,   # Recycle connections every hour
)

# Session configuration
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# Base class for all models
Base = declarative_base()

# ===============================
# DATABASE MODELS
# ===============================

class CandidateMatch(Base):
    """
    Enhanced candidate match table with better fields and constraints
    """
    __tablename__ = "candidate_matches"

    id = Column(Integer, primary_key=True, index=True)
    candidate = Column(String(255), nullable=False, index=True)
    email = Column(String(255), index=True)
    phone = Column(String(50))
    match_score = Column(Float, index=True)
    extracted_skills = Column(JSON)  # List of skills
    jd_file = Column(String(255))  # Job description file matched against
    resume_path = Column(Text)  # Full path to resume file
    
    # Metadata
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_active = Column(Boolean, default=True)
    
    # Additional analysis fields
    experience_years = Column(Integer)
    education_level = Column(String(100))
    total_skills_found = Column(Integer)
    
    def __repr__(self):
        return f"<CandidateMatch(id={self.id}, candidate='{self.candidate}', score={self.match_score})>"

class JobDescription(Base):
    """
    Store job descriptions for better tracking and reuse
    """
    __tablename__ = "job_descriptions"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    filename = Column(String(255), nullable=False, unique=True)
    content = Column(Text)
    required_skills = Column(JSON)  # List of required skills
    department = Column(String(100))
    location = Column(String(255))
    salary_range = Column(String(100))
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_active = Column(Boolean, default=True)
    
    def __repr__(self):
        return f"<JobDescription(id={self.id}, title='{self.title}')>"

class Skill(Base):
    """
    Master skills table for better skill management
    """
    __tablename__ = "skills"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, unique=True, index=True)
    category = Column(String(50))  # e.g., "Programming", "Database", "Cloud"
    description = Column(Text)
    demand_level = Column(String(20))  # e.g., "High", "Medium", "Low"
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f"<Skill(id={self.id}, name='{self.name}')>"

# ===============================
# DATABASE UTILITIES
# ===============================

def get_db() -> Session:
    """
    Dependency to get database session with proper error handling
    """
    db = SessionLocal()
    try:
        yield db
    except SQLAlchemyError as e:
        logger.error(f"Database session error: {e}")
        db.rollback()
        raise
    finally:
        db.close()

def init_db() -> None:
    """
    Initialize database tables with error handling and logging
    """
    try:
        logger.info("🚀 Initializing database tables...")
        Base.metadata.create_all(bind=engine)
        logger.info("✅ Database tables created successfully")
        
        # Verify connection - FIXED: Using text() wrapper
        with SessionLocal() as session:
            session.execute(text("SELECT 1"))  # ✅ Fixed this line
            logger.info("✅ Database connection verified")
            
    except Exception as e:
        logger.error(f"❌ Database initialization failed: {e}")
        raise

def reset_db() -> None:
    """
    Drop and recreate all tables (use with caution!)
    """
    try:
        logger.warning("⚠️ Resetting database - all data will be lost!")
        Base.metadata.drop_all(bind=engine)
        Base.metadata.create_all(bind=engine)
        logger.info("✅ Database reset completed")
    except Exception as e:
        logger.error(f"❌ Database reset failed: {e}")
        raise

def get_database_stats() -> dict:
    """
    Get database statistics for monitoring
    """
    try:
        with SessionLocal() as session:
            candidate_count = session.query(CandidateMatch).count()
            jd_count = session.query(JobDescription).count()
            skill_count = session.query(Skill).count()
            
            # Get average match score using proper SQLAlchemy syntax
            avg_score_result = session.query(CandidateMatch.match_score).filter(
                CandidateMatch.match_score.isnot(None)
            ).first()
            
            avg_score = avg_score_result[0] if avg_score_result else 0
            
            return {
                "total_candidates": candidate_count,
                "total_job_descriptions": jd_count,
                "total_skills": skill_count,
                "average_match_score": round(avg_score or 0, 2),
                "database_status": "healthy"
            }
    except Exception as e:
        logger.error(f"Failed to get database stats: {e}")
        return {"database_status": "error", "error": str(e)}

def bulk_insert_candidates(candidates: List[dict]) -> tuple[int, int]:
    """
    Efficiently insert multiple candidate records
    Returns: (success_count, error_count)
    """
    success_count = 0
    error_count = 0
    
    try:
        with SessionLocal() as session:
            for data in candidates:
                try:
                    candidate = CandidateMatch(
                        candidate=data.get("candidate"),
                        email=data.get("email"),
                        match_score=data.get("match_score"),
                        extracted_skills=data.get("extracted_skills"),
                        jd_file=data.get("jd_file"),
                        resume_path=data.get("resume_path"),
                        total_skills_found=len(data.get("extracted_skills", []))
                    )
                    session.add(candidate)
                    success_count += 1
                except Exception as e:
                    logger.error(f"Failed to add candidate {data.get('candidate')}: {e}")
                    error_count += 1
            
            session.commit()
            logger.info(f"✅ Bulk insert completed: {success_count} success, {error_count} errors")
            
    except Exception as e:
        logger.error(f"Bulk insert transaction failed: {e}")
        session.rollback()
        error_count += success_count
        success_count = 0
    
    return success_count, error_count

def cleanup_old_records(days: int = 30) -> int:
    """
    Clean up records older than specified days
    Returns count of deleted records
    """
    try:
        cutoff_date = datetime.utcnow() - timedelta(days=days)
        
        with SessionLocal() as session:
            deleted_count = session.query(CandidateMatch).filter(
                CandidateMatch.created_at < cutoff_date,
                CandidateMatch.is_active == False
            ).delete()
            
            session.commit()
            logger.info(f"✅ Cleaned up {deleted_count} old records")
            return deleted_count
            
    except Exception as e:
        logger.error(f"Cleanup failed: {e}")
        return 0

# ===============================
# HEALTH CHECK
# ===============================

def health_check() -> dict:
    """
    Comprehensive database health check
    """
    try:
        with SessionLocal() as session:
            # Test basic query - FIXED: Using text() wrapper
            session.execute(text("SELECT 1"))  # ✅ Fixed this line
            
            # Get table sizes
            stats = get_database_stats()
            
            return {
                "status": "healthy",
                "connection": "ok",
                "statistics": stats,
                "timestamp": datetime.utcnow().isoformat()
            }
            
    except Exception as e:
        return {
            "status": "unhealthy",
            "connection": "failed",
            "error": str(e),
            "timestamp": datetime.utcnow().isoformat()
        }

# ===============================
# INITIALIZATION
# ===============================

if __name__ == "__main__":
    # For testing the database module directly
    print("🧪 Testing database connection...")
    health = health_check()
    print(f"Health check result: {health}")
    
    if health["status"] == "healthy":
        print("✅ Database is ready!")
    else:
        print("❌ Database issues detected!")
