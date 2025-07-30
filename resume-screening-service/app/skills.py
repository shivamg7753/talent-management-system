# app/skills.py
from huggingface_hub import snapshot_download
import spacy, functools, pathlib, os

# download once, then cache - use absolute path in Docker container
_MODEL_PATH = pathlib.Path("/app/.cache/skill_ner")
_MODEL_PATH.mkdir(parents=True, exist_ok=True)

if not (_MODEL_PATH / "vocab").exists():
    print(f"📥 Downloading skill extraction model to {_MODEL_PATH}")
    snapshot_download("amjad-awad/skill-extractor", repo_type="model", local_dir=str(_MODEL_PATH))
    print("✅ Model download complete")

@functools.cache
def get_nlp():
    return spacy.load(str(_MODEL_PATH))

def extract_skills(text: str) -> list[str]:
    nlp = get_nlp()
    doc = nlp(text)
    return sorted({ent.text for ent in doc.ents if "SKILLS" in ent.label_})
