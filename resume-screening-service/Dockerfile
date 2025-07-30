# Use official slim Python image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install OS dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    g++ \
    curl \
    git \
    && rm -rf /var/lib/apt/lists/*

# Define environment
ENV PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    HF_HUB_CACHE=/app/.cache

# Copy only requirements first to leverage Docker layer caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --upgrade pip && \
    pip install -r requirements.txt

# ✳️ Install spaCy model locally
RUN python -m spacy download en_core_web_sm && \
    python -m spacy link en_core_web_sm en_core_web_sm

# ✳️ Pre-download Hugging Face skill extraction model
RUN python -c "\
from huggingface_hub import snapshot_download; \
snapshot_download(repo_id='amjad-awad/skill-extractor', repo_type='model', local_dir='/app/.cache/skill_ner')"

# Copy application source
COPY app/ ./app/
COPY resumes/ ./resumes/
COPY job_descriptions/ ./job_descriptions/

# Create upload & cache directories
RUN mkdir -p /app/uploads /app/.cache

# Expose port (FastAPI)
EXPOSE 8084

# Startup command
CMD ["uvicorn", "app.api:app", "--host", "0.0.0.0", "--port", "8084"]
