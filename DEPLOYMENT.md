# 🚀 FarmGuard AI — Deployment & Production Guide

This guide details the complete deployment process for running FarmGuard AI in local, staging, and cloud production environments.

---

## 1. Prerequisites
- **Operating System:** Linux (Ubuntu 22.04+ recommended) or Windows 10/11
- **Python:** Version 3.10 to 3.13
- **Node.js:** Node.js 18.x or 20.x LTS + npm
- **Hardware:**
  - Minimum: 2 vCPU, 4GB RAM (CPU inference)
  - Recommended: 4 vCPU, 8GB RAM

---

## 2. Environment Configuration

### Backend Configuration (`backend/.env`)
```bash
# Application Environment
APP_NAME="FarmGuard AI"
APP_ENV=production
DEBUG=false
PORT=8000
HOST=0.0.0.0
API_PREFIX=/api

# Demo / Mode
DEMO_MODE=false

# Database
DATABASE_URL=sqlite:///./farmguard.db

# JWT Security
JWT_SECRET_KEY=generate-a-secure-64-character-random-secret-key-here
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# Allowed CORS Origins (Replace with your actual domain in production)
CORS_ORIGINS=https://farmguard.ai,http://localhost:5173,http://127.0.0.1:5173

# Storage & Models
STORAGE_TYPE=local
STORAGE_DIR=./uploads
DISEASE_MODEL_PATH=./models/plant_disease_model.keras
```

### Frontend Configuration (`frontend/.env`)
```bash
# Backend API Base URL
VITE_API_URL=https://api.farmguard.ai
```

---

## 3. Backend Production Deployment

### Option A: Systemd Service + Gunicorn / Uvicorn Workers
```powershell
cd "backend"
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
```

Run with Uvicorn production workers:
```bash
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000 --timeout 120
```

### Option B: Docker Container
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

---

## 4. Frontend Production Build & Hosting

```bash
cd frontend
npm install
npm run build
```
This generates the optimized production bundle inside `frontend/dist/`.

### Serving with Nginx
```nginx
server {
    listen 80;
    server_name farmguard.ai;

    location / {
        root /var/www/farmguard/frontend/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:8000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

---

## 5. Health & Diagnostic Verification

Verify backend operational status:
```bash
curl http://localhost:8000/health
```
Expected output:
```json
{
  "status": "ok",
  "service": "FarmGuard AI backend",
  "environment": "production",
  "ml": {
    "disease_model_loaded": true,
    "disease_labels_count": 16
  }
}
```

---

## 6. Troubleshooting Common Deployment Issues
1. **TensorFlow CPU Optimization Warning:** Normal informational log on standard CPU containers.
2. **CORS Errors:** Verify that the frontend domain (e.g., `https://farmguard.ai`) is explicitly included in `CORS_ORIGINS` in `backend/.env`.
3. **Large File Upload Timeouts:** Ensure Nginx `client_max_body_size 20M;` is configured in reverse proxy settings.
