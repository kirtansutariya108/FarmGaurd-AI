# 🏛️ FarmGuard AI — Architecture & Technical Design

This document details the software architecture, data flow, component decomposition, and decision-support engines powering FarmGuard AI.

---

## 1. High-Level Architecture Diagram

```
+---------------------------------------------------------------+
|                    FARMER / CLIENT LAYER                      |
|                                                               |
|  React 18 + TypeScript + Vite + Tailwind CSS + Lucide Icons   |
|  - Farmer Dashboard Cockpit                                   |
|  - Crop Disease Scanner & Live Dropzone                       |
|  - Weather Forecaster & Telemetry View                        |
|  - Smart Irrigation Advisor                                   |
|  - Local Scan History & Detailed Record Inspector             |
+---------------------------------------------------------------+
                                |  HTTPS / REST JSON + Multipart
                                v
+---------------------------------------------------------------+
|                    FASTAPI BACKEND LAYER                      |
|                                                               |
|  FastAPI Router + Pydantic v2 Schemas + CORS Middleware       |
|  - POST /api/predict (Canonical Disease Inference Endpoint)   |
|  - POST /api/farm-intelligence (Decision Support Engine)      |
|  - GET  /api/weather/current (Open-Meteo Proxy & Geocoding)   |
|  - POST /api/irrigation/recommend (Multi-Signal Advisor)      |
|  - GET  /health (Service & Model Liveness Probe)               |
+---------------------------------------------------------------+
                                |
        +-----------------------+-----------------------+
        |                                               |
        v                                               v
+-----------------------------+   +-----------------------------+
|   DEEP LEARNING ML ENGINE   |   |     WEATHER RISK ENGINE     |
|                             |   |                             |
|  MobileNetV2 (16 Classes)   |   |  Open-Meteo REST Telemetry  |
|  - 224x224 RGB Normalization|   |  - Ambient Temp & Humidity  |
|  - Singleton Model Loader   |   |  - Rain Prob & mm Rain Sum  |
|  - Variance Pre-check Guard |   |  - Wind Velocity & Soil Temp|
|  - Softmax Confidence Guard |   |  - Deterministic Risk Math  |
+-----------------------------+   +-----------------------------+
        |                                               |
        +-----------------------+-----------------------+
                                |
                                v
+---------------------------------------------------------------+
|             16-CLASS AGRONOMIC KNOWLEDGE ENGINE               |
|                                                               |
|  Deterministic Agronomic Rulebase for Tomato & Rice           |
|  - Plain-Language Condition Triage Summary                    |
|  - Biological Pathogen Moisture/Temp Requirements             |
|  - 3-5 Immediate Field Actions (Non-Chemical Triage)          |
|  - 3-5 Monitoring Checklist Items                             |
|  - 3-5 Long-Term Prevention Practices                         |
|  - Contextual Safety Notice & Extension Disclaimer            |
+---------------------------------------------------------------+
                                |
                                v
+---------------------------------------------------------------+
|                   PERSISTENCE & CLIENT CACHE                  |
|                                                               |
|  - Browser LocalStorage (`farmguard_scan_history`)            |
|  - SQLite Diagnostic Repository (`farmguard.db`)              |
|  - File Upload Archive (`./uploads/`)                         |
+---------------------------------------------------------------+
```

---

## 2. End-to-End Farmer Data Flow

1. **User Action:** The farmer captures or selects a leaf photograph on mobile or desktop.
2. **Preprocessing & Guard:** Image format, dimensions, and pixel variance are verified. If pixel variance < 8.0 (blank or uniform non-leaf), the system returns `unsupported_image`.
3. **Inference:** Preprocessed tensor `(1, 224, 224, 3)` passes to cached `MobileNetV2` model in memory. Argmax class index and confidence are calculated.
4. **Confidence Thresholding:**
   - $\ge 60\%$: Classified as `success` $\rightarrow$ proceed to intelligence correlation.
   - $< 60\%$: Classified as `low_confidence` $\rightarrow$ routed to `LowConfidenceCard` with retake guidelines.
5. **Weather Correlation:** Hyper-local ambient telemetry (temperature, relative humidity, rain probability, wind) is retrieved.
6. **Agronomic Synthesis:** Biological pathogen moisture requirements are evaluated against ambient conditions to determine `LOW`, `MODERATE`, or `HIGH` disease spread risk.
7. **Advisory Assembly:** 7-section structured response is returned to the client and saved to the local scan history timeline.

---

## 3. Key Design Decisions & Principles

- **Zero Fabricated Metrics:** If weather or GPS telemetry is unavailable, the UI explicitly displays `"Weather data unavailable"` rather than generating synthetic numbers.
- **Server-Side ML Singleton:** Keras model weights are loaded once upon process startup into a thread-safe singleton, reducing per-scan latency from ~4.5s down to ~174ms.
- **Decision-Support Wording:** Adheres strictly to safe agricultural decision-support language, avoiding unsupported chemical dosages or claims of 100% diagnostic certainty.
