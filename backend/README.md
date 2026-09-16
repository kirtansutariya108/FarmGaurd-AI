# FarmGuard AI - Backend Engine

**From crop image to actionable farm decisions.**

FarmGuard AI backend is a production-grade FastAPI application engineered for multi-signal agricultural decision support. It combines crop leaf disease diagnosis, smart irrigation advisory, agro-meteorological forecasting, transparent composite crop health scoring, and actionable farm task synthesis.

---

## 🌾 Architecture Highlights

* **Layered Architecture:** Clear separation between API Routers, Service Layer, Repository Data Access Layer, ORM Models, and Deterministic Decision Engines.
* **ML Integration:** Singleton inference loader for MobileNetV2 disease detection with Softmax top-k ranking and configurable confidence thresholding (`DISEASE_CONFIDENCE_THRESHOLD=0.60`).
* **Agricultural Safety & Honesty:** Transparent rule-based decision support. Never fabricates treatment prescriptions, chemical quantities, or fake predictions when telemetry is missing.
* **Unified Dashboard Aggregation:** `/api/dashboard` consolidates farm telemetry, weather, health scores, and recent scans to eliminate frontend waterfall delays.
* **Database Compatibility:** SQLAlchemy 2.0 ORM with PostgreSQL / Supabase connection pooling and SQLite zero-config local development support.
* **Authentication:** JWT Bearer tokens with Bcrypt password hashing.

---

## 🚀 Quick Start (Local Setup)

### 1. Create Virtual Environment
```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

### 2. Install Dependencies
```powershell
pip install -r requirements.txt
```

### 3. Initialize Database & Seed Demo Data
```powershell
python -m app.db.seed
```

### 4. Run Automated Test Suite
```powershell
pytest tests/ -v
```

### 5. Launch FastAPI Development Server
```powershell
uvicorn app.main:app --reload --port 8000
```

* **Interactive API Docs (Swagger):** `http://localhost:8000/docs`
* **Alternative API Docs (ReDoc):** `http://localhost:8000/redoc`
* **Service Health Check:** `http://localhost:8000/api/health`

---

## 🔑 Demo Credentials

When running in `DEMO_MODE=true`, the following default account is pre-seeded:
* **Email:** `kirtan.farmer@farmguard.ai`
* **Phone:** `+91 98765 43210`
* **Password:** `FarmGuard@2026`

---

## 📁 Directory Structure

```
backend/
├── app/
│   ├── main.py                          # FastAPI app entry point & middleware
│   ├── core/                            # Config, security, logging, exceptions
│   ├── db/                              # Database sessions, ORM models, seed
│   ├── schemas/                         # Pydantic validation & serialization
│   ├── api/                             # Dependency injection & route blueprints
│   ├── services/                        # Business logic orchestration
│   ├── repositories/                    # Data Access Layer
│   ├── ml/                              # Disease & irrigation inference loaders
│   ├── decision_engine/                 # Health calculation & rule matrices
│   └── utils/                           # Image validation, pagination, timestamps
├── tests/                               # Comprehensive pytest suite
├── docs/                                # API contract & frontend integration guide
├── alembic/                             # Alembic migrations
├── requirements.txt
├── .env.example
├── Dockerfile
└── README.md
```

---

## 🧪 Testing & Verification

Run the full automated test suite:
```powershell
pytest tests/ -v
```
Tests cover:
* Authentication & JWT validation
* Farm CRUD & cross-user ownership security
* Image validation, disease inference & thresholding
* Irrigation rule evaluation & moisture update
* Weather service fallback & forecasting
* Composite crop health calculation
* Actionable recommendation synthesis
* Scan history querying and filtering
* Dashboard aggregation
