# FarmGuard AI — Hackathon & SIH Demonstration Guide

This guide is designed for presenting **FarmGuard AI** to judges, mentors, and hackathon evaluation panels (such as the Smart India Hackathon / SIH).

---

## 1. Problem Statement

Smallholder farmers in India and across developing agrarian economies face catastrophic crop losses (up to 30–40% annually) due to unmanaged plant diseases and unpredictable microclimatic conditions. Key challenges include:
- **Delayed Diagnosis**: Farmers often identify foliar fungal and bacterial diseases too late.
- **Disconnected Context**: Disease detection alone is insufficient—weather conditions (temperature, high relative humidity, rain) dictate whether a fungal spore will spread aggressively or remain dormant.
- **Over/Under-Application of Agrochemicals**: Farmers spray blanket treatments without knowing precise disease severity or the risk of rain washing away expensive treatments.
- **Irrigation Inefficiencies**: Water is wasted or crops are overwatered immediately prior to natural precipitation.

---

## 2. Target Users

- **Smallholder Farmers & Agricultural Workers**: Needing simple, non-technical, actionable advice in plain language.
- **Agricultural Extension Officers / KVK Workers**: Needing an objective field diagnostic tool with weather-aware risk scoring.
- **Agri-Tech Cooperatives & Farm Managers**: Needing scan history tracking and farm-level monitoring.

---

## 3. The FarmGuard AI Solution

FarmGuard AI connects **deep-learning computer vision** directly with **real-time micro-meteorological intelligence**:
1. **Instant Edge AI Leaf Diagnosis**: Fast classification of 16 critical tomato and rice conditions using a lightweight MobileNetV2 architecture.
2. **Confidence Safety & Out-of-Domain Guardrails**: Enforces a 60% confidence threshold and low-texture pre-checks to prevent misleading diagnoses.
3. **Live Weather Risk Fusion**: Pulls real-time Open-Meteo data (temperature, relative humidity, precipitation) for the farm's exact coordinates.
4. **Farm Intelligence Engine**: Combines disease pathology with live weather to generate categorized, prioritized action steps:
   - *Immediate Action* (e.g. isolate infected leaves, emergency organic/chemical controls)
   - *Monitoring Action* (e.g. check undersides of adjacent leaves every 48 hours)
   - *Prevention Action* (e.g. improve row aeration, crop rotation)
   - *Weather-Related Advice* (e.g. avoid foliar spraying before rainfall)
5. **Smart Irrigation Advisor**: Formulates water-saving recommendations based on days since last watering, soil moisture status, and imminent rain forecasts.
6. **Local Audit History**: Persists all scan records and recommendations directly on the device for historical inspection.

---

## 4. Key Features Overview

| Feature | Description | Status |
| :--- | :--- | :--- |
| **Farm Dashboard** | Instant farm status, live weather badge, latest crop health summary, risk indicator, and quick actions. | Complete & Verified |
| **Disease Scanner** | Step-by-step leaf image analysis with drag-and-drop, camera capture, and diagnostic summary. | Complete & Verified |
| **Farm Intelligence Card** | Categorized, color-coded farmer action cards (Immediate, Monitoring, Prevention, Weather Advice). | Complete & Verified |
| **Irrigation Advisor** | Rule-based irrigation decision engine factoring upcoming precipitation and growth stages. | Complete & Verified |
| **Scan History** | Timestamped local log of all diagnostic scans with full detail viewing. | Complete & Verified |
| **Authentication & Access** | Demo-ready JWT session persistence with protected app routes and auto-redirects. | Complete & Verified |

---

## 5. AI Component & Supported Classes

### Architecture:
- **Base Model**: MobileNetV2 (Transfer Learning + Fine-Tuning)
- **Input Dimension**: `(224, 224, 3)` RGB Normalized
- **Output Layer**: 16-way Softmax Classifier
- **Inference Speed**: ~174ms on CPU (warm inference)
- **Model File**: `backend/models/plant_disease_model.keras`

### Exactly 16 Supported Classes:

#### Tomato (10 Classes)
1. `tomato_bacterial_spot` (*Xanthomonas*)
2. `tomato_early_blight` (*Alternaria solani*)
3. `tomato_healthy` (Healthy Foliage)
4. `tomato_late_blight` (*Phytophthora infestans*)
5. `tomato_leaf_mold` (*Passalora fulva*)
6. `tomato_mosaic_virus` (ToMV)
7. `tomato_septoria_leaf_spot` (*Septoria lycopersici*)
8. `tomato_target_spot` (*Corynespora cassiicola*)
9. `tomato_twospotted_spider_mite` (*Tetranychus urticae*)
10. `tomato_yellow_leaf_curl_virus` (TYLCV)

#### Rice (6 Classes)
11. `rice_bacterial_leaf_blight` (*Xanthomonas oryzae*)
12. `rice_brown_spot` (*Bipolaris oryzae*)
13. `rice_healthy` (Healthy Foliage)
14. `rice_leaf_blast` (*Magnaporthe oryzae*)
15. `rice_leaf_scald` (*Microdochium oryzae*)
16. `rice_narrow_brown_spot` (*Cercospora janseana*)

---

## 6. Weather & Farm Intelligence Integration

```
       [Uploaded Leaf Photo]                [Farm Coordinates]
                 │                                   │
                 ▼                                   ▼
    ┌────────────────────────┐              ┌─────────────────┐
    │ MobileNetV2 Classifier │              │ Open-Meteo API  │
    └────────────────────────┘              └─────────────────┘
                 │                                   │
                 ▼                                   ▼
      Disease + Confidence %              Temp, Humidity, Rain %
                 │                                   │
                 └─────────────────┬─────────────────┘
                                   │
                                   ▼
                    ┌──────────────────────────────┐
                    │    Farm Intelligence Engine  │
                    │ (Pathogen biology + Weather) │
                    └──────────────────────────────┘
                                   │
                                   ▼
          ┌──────────────────────────────────────────────────┐
          │ Categorized Farmer Action Plan:                  │
          │ • Risk Level: HIGH (Rain + Fungal Spore Spread) │
          │ • Immediate: Isolate affected plants            │
          │ • Monitoring: Inspect lower canopy every 48h    │
          │ • Weather Advice: Delay spraying until rain ends│
          └──────────────────────────────────────────────────┘
```

---

## 7. 5–7 Minute Live Demo Script for Judges

1. **Minute 0–1: Introduction & Dashboard**
   - Open `/app/dashboard`. Show farm overview, live weather metrics pulled from Open-Meteo, and the single-click navigation bar.
2. **Minute 1–3: Tomato Disease Scan & Farm Intelligence**
   - Navigate to `/app/scanner`.
   - Upload a sample tomato leaf showing Late Blight.
   - Explain the 16-class MobileNetV2 prediction and confidence score.
   - Show how the **Farm Intelligence Engine** reads the live humidity (e.g., >80%) and warns the farmer of high spore propagation risk.
   - Walk through the 4 actionable cards: Immediate, Monitoring, Prevention, and Weather-related advice.
3. **Minute 3–4: Healthy Foliage & Low-Confidence Guardrails**
   - Demonstrate a healthy leaf scan: UI clearly displays "Healthy Foliage Detected" and provides routine maintenance and prevention tips without prescribing chemical interventions.
   - Explain the safety fallback: If an unclear or low-contrast image is provided (confidence < 60%), the system marks it as "Uncertain Classification" and prompts the farmer with photographic guidance rather than giving a hallucinated diagnosis.
4. **Minute 4–5: Irrigation Advisor**
   - Navigate to `/app/irrigation`.
   - Show how the advisory engine takes soil moisture status and rainfall likelihood to advise delaying or proceeding with irrigation, saving water and preventing root rot.
5. **Minute 5–6: Scan History & Local Persistence**
   - Open `/app/history`.
   - Show the persistent record of all diagnoses performed, complete with timestamps and confidence scores.
6. **Minute 6–7: Architecture, Scalability & Q&A**
   - Present the FastAPI + React TypeScript architecture, local inference speed (~174ms), and future roadmap for vernacular languages and IoT sensor integration.

---

## 8. Known Limitations & Honest Technical Boundaries

- **Crop Scope**: Validated specifically for Tomato (10 classes) and Rice (6 classes). Does not classify other crop types.
- **Closed-World Softmax Characteristic**: As standard in classification networks, non-plant images containing visual texture may trigger arbitrary predictions; a low-texture standard deviation filter rejects blank/solid images, but general out-of-domain detection requires a dedicated upstream detector.
- **Weather API Dependency**: Requires an internet connection to reach Open-Meteo; if unavailable, the UI gracefully continues showing diagnosis and general advice with a notice.
- **Decision Support**: FarmGuard AI is an AI-assisted decision support system; it provides recommendations, not guaranteed agronomic guarantees.
