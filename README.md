# 🌾 FarmGuard AI — Next-Gen Crop Health & Decision-Support Platform

[![FastAPI](https://img.shields.io/badge/FastAPI-0.110.0-009688.svg?logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB.svg?logo=react)](https://reactjs.org/)
[![TensorFlow](https://img.shields.io/badge/TensorFlow-2.19.0-FF6F00.svg?logo=tensorflow)](https://tensorflow.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4.1-38B2AC.svg?logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **Empowering smallholder farmers with instant AI leaf disease diagnosis, live weather-aware risk scoring, intelligent irrigation guidance, and actionable agronomic advisory.**

---

## 📌 Problem Statement
Smallholder and commercial farmers face substantial yield losses annually due to undetected plant diseases, erratic microclimate swings, and inefficient watering cycles. Conventional diagnosis requires costly laboratory pathology tests or agronomist visits that are inaccessible in remote rural areas.

## 💡 The FarmGuard Solution
FarmGuard AI combines on-device/edge visual deep learning with real-time agro-meteorological telemetry from Open-Meteo:
1. **AI Visual Pathology Scanner**: Instant detection across 16 major disease and healthy foliar classes in Tomato and Rice using fine-tuned MobileNetV2.
2. **Deterministic Weather-Aware Risk Engine**: Correlates live ambient temperature, humidity, rain probability, wind velocity, and soil temperature with pathogen biological needs.
3. **7-Section Actionable Advisory**: Delivers plain-language, non-chemical triage guidance, field scouting checklists, preventive practices, and safety disclaimers.
4. **Smart Irrigation Advisor**: Balances root-zone moisture, days since last watering, and precipitation forecasts.
5. **Local Device Scan Archive**: Preserves field diagnosis timeline with full inspection capabilities.

---

## 🌿 Supported Crops & 16 Disease Classes

### 🍅 Tomato (10 Classes)
1. `bacterial_spot` — Bacterial Spot (*Xanthomonas*)
2. `early_blight` — Early Blight (*Alternaria solani*)
3. `healthy` — Healthy Foliage
4. `late_blight` — Late Blight (*Phytophthora infestans*)
5. `leaf_mold` — Leaf Mold (*Passalora fulva*)
6. `mosaic_virus` — Tomato Mosaic Virus
7. `septoria_leaf_spot` — Septoria Leaf Spot (*Septoria lycopersici*)
8. `target_spot` — Target Spot (*Corynespora cassiicola*)
9. `twospotted_spider_mite` — Two-Spotted Spider Mite (*Tetranychus urticae*)
10. `yellow_leaf_curl_virus` — Tomato Yellow Leaf Curl Virus (TYLCV)

### 🌾 Rice (6 Classes)
11. `rice_bacterial_leaf_blight` — Bacterial Leaf Blight (*Xanthomonas oryzae*)
12. `rice_brown_spot` — Brown Spot (*Bipolaris oryzae*)
13. `rice_healthy` — Healthy Foliage
14. `rice_leaf_blast` — Rice Blast (*Magnaporthe oryzae*)
15. `rice_leaf_scald` — Leaf Scald (*Microdochium oryzae*)
16. `rice_narrow_brown_spot` — Narrow Brown Spot (*Cercospora janseana*)

---

## 🛠️ Technical Architecture

```
FARMER / BROWSER
      ↓
REACT 18 + TYPESCRIPT + VITE
      ↓
FASTAPI BACKEND (Uvicorn REST API)
      ↓
 ├── 16-Class MobileNetV2 Disease Model (Keras / TensorFlow)
 ├── Open-Meteo Hyper-Local Weather Engine
 ├── 16-Class Deterministic Agronomic Knowledge Base
 ├── Multi-Signal Irrigation Decision Engine
 └── Local Scan History Storage
```

---

## 🚀 Quickstart Guide

### 1. Prerequisites
- Python 3.10 – 3.13
- Node.js 18+ and npm

### 2. Backend Setup
```powershell
cd "backend"
# Create virtual environment
python -m venv .venv
.\.venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run FastAPI server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
*Backend runs on `http://127.0.0.1:8000` (API Docs at `http://127.0.0.1:8000/docs`).*

### 3. Frontend Setup
```powershell
cd "frontend"
# Install dependencies
npm install

# Run Vite dev server
npm run dev
```
*Frontend runs on `http://localhost:5173`.*

---

## 🧪 Testing & Verification

```powershell
# Run full backend pytest suite (27 tests)
cd "backend"
.\.venv\Scripts\python.exe -m pytest tests/

# Build frontend production bundle (0 TypeScript errors)
cd "frontend"
npm run build
```

---

## ⚠️ Limitations & Decision-Support Notice
- **Decision Support Only:** FarmGuard AI outputs serve as early-warning field screening. Final chemical or cultural interventions must comply with manufacturer labels and certified extension advice.
- **Closed 16-Class Scope:** Specifically calibrated for Tomato and Rice leaves; non-leaf or out-of-domain images are safely identified and rejected.
- **Confidence Threshold:** Low-confidence predictions (<60%) prompt for a clearer photo under natural lighting to prevent erroneous chemical applications.

---

## 📄 License
Released under the [MIT License](LICENSE).
