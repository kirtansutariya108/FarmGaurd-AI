# FarmGuard AI - Backend API Contract

This document provides the exhaustive specification of the FarmGuard AI FastAPI backend endpoints, request payloads, response structures, and their mapping to frontend components.

---

## 1. Base URL & Protocol
* **Local Development Base URL:** `http://localhost:8000/api`
* **Content-Type:** `application/json` (except image uploads which use `multipart/form-data`)
* **Authentication Header:** `Authorization: Bearer <access_token>`

---

## 2. Standard Envelopes

### Success Envelope
```json
{
  "data": { ... },
  "message": "Optional human-readable confirmation message"
}
```

### Paginated Envelope
```json
{
  "data": [ ... ],
  "pagination": {
    "total": 42,
    "page": 1,
    "page_size": 10,
    "total_pages": 5,
    "has_next": true,
    "has_prev": false
  },
  "message": null
}
```

### Error Envelope
```json
{
  "error": {
    "code": "NOT_FOUND | UNAUTHORIZED | FORBIDDEN | INVALID_IMAGE | VALIDATION_ERROR | SERVICE_UNAVAILABLE",
    "message": "Human-friendly explanation.",
    "details": {}
  }
}
```

---

## 3. Endpoints Specification

### Authentication & Profile

| Endpoint | Method | Auth | Description | Frontend Mapping |
| :--- | :--- | :--- | :--- | :--- |
| `/auth/register` | `POST` | Public | Register new farmer account | `mockAuthService.signup` |
| `/auth/login` | `POST` | Public | Authenticate with email/phone & password | `mockAuthService.login` |
| `/auth/me` | `GET` | Bearer | Fetch authenticated farmer profile | `mockAuthService.getCurrentUser` |
| `/auth/refresh` | `POST` | Bearer | Refresh access token | Token lifecycle |
| `/auth/logout` | `POST` | Bearer | Revoke session | `mockAuthService.logout` |
| `/profile` | `GET` | Bearer | Get user profile & preferences | `ProfilePage` |
| `/profile` | `PUT` | Bearer | Update profile & preferences | `mockAuthService.updateProfile` |

---

### Farm Management

| Endpoint | Method | Auth | Description | Frontend Mapping |
| :--- | :--- | :--- | :--- | :--- |
| `/farms` | `GET` | Bearer | List farmer's registered parcels | `mockFarmService.getFarms` |
| `/farms` | `POST` | Bearer | Register new farm parcel | `mockFarmService.createFarm` |
| `/farms/{id}` | `GET` | Bearer | Detailed parcel telemetry & crop stats | `mockFarmService.getFarmById` |
| `/farms/{id}` | `PUT` | Bearer | Update parcel attributes & soil values | `mockFarmService.updateFarm` |
| `/farms/{id}` | `DELETE` | Bearer | Remove parcel | N/A |

---

### Disease Scanner

| Endpoint | Method | Auth | Description | Frontend Mapping |
| :--- | :--- | :--- | :--- | :--- |
| `/disease/validate` | `POST` | Bearer | Fast image lighting & clarity check | `mockDiseaseService.validateImageQuality` |
| `/disease/predict` | `POST` | Bearer | Multipart leaf scan & MobileNetV2 inference | `mockDiseaseService.analyzeLeafImage` |

---

### Irrigation Advisor

| Endpoint | Method | Auth | Description | Frontend Mapping |
| :--- | :--- | :--- | :--- | :--- |
| `/irrigation/recommend` | `POST` | Bearer | Multi-signal irrigation guidance | `mockIrrigationService.getRecommendation` |
| `/irrigation/conditions` | `PUT` | Bearer | Log updated soil moisture & re-evaluate | `mockIrrigationService.updateFieldConditions` |

---

### Weather & Health

| Endpoint | Method | Auth | Description | Frontend Mapping |
| :--- | :--- | :--- | :--- | :--- |
| `/weather/current` | `GET` | Bearer | Current weather & 5-day precipitation | `mockWeatherService.getCurrentWeather` |
| `/weather/forecast` | `GET` | Bearer | Refresh forecast readings | `mockWeatherService.refreshForecast` |
| `/health/{farm_id}` | `GET` | Bearer | Composite crop health score (0-100) | `CropHealthPage` |

---

### Dashboard Cockpit & Action Items

| Endpoint | Method | Auth | Description | Frontend Mapping |
| :--- | :--- | :--- | :--- | :--- |
| `/dashboard` | `GET` | Bearer | Unified cockpit payload (farm, weather, health, scans, recs) | `DashboardPage` |
| `/recommendations` | `GET` | Bearer | Prioritized farm action items | `mockRecommendationService.getRecommendations` |
| `/recommendations/{id}/status` | `PATCH` | Bearer | Mark task as completed | `mockRecommendationService.markAsCompleted` |
| `/history` | `GET` | Bearer | Paginated scan archive with filters | `HistoryPage` |
| `/history/{scan_id}` | `GET` | Bearer | Detailed scan breakdown | `ScanDetailsPage` |
| `/notifications` | `GET` | Bearer | Farmer alerts feed | `NotificationsPage` |
| `/notifications/{id}/read` | `PATCH` | Bearer | Mark single alert as read | `NotificationsPage` |
| `/notifications/mark-all-read`| `POST`| Bearer | Mark all alerts read | `NotificationsPage.markAllAsRead` |
