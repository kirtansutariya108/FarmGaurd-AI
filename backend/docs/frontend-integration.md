# Frontend Integration Guide

This guide explains how to connect the React + TypeScript frontend to the FarmGuard AI FastAPI backend.

---

## 1. Environment Configuration

In the frontend repository, configure the environment variable:

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

---

## 2. API Client Setup (Axios / Fetch)

Create an HTTP client with automatic JWT token attachment:

```typescript
// frontend/src/services/apiClient.ts
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('farmguard_access_token');
  const headers = new Headers(options.headers || {});
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  if (!(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.error?.message || 'API request failed');
  }
  return payload.data;
}
```

---

## 3. Service Replacement Map

Replace frontend mock services with live API calls:

### Authentication
```typescript
export const authService = {
  login: (credentials) => apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  signup: (data) => apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  getCurrentUser: () => apiRequest('/auth/me'),
  logout: () => apiRequest('/auth/logout', { method: 'POST' }),
  updateProfile: (updates) => apiRequest('/profile', { method: 'PUT', body: JSON.stringify(updates) })
};
```

### Disease Scanner
```typescript
export const diseaseService = {
  validateImageQuality: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiRequest('/disease/validate', { method: 'POST', body: formData });
  },
  analyzeLeafImage: (file: File, options) => {
    const formData = new FormData();
    formData.append('file', file);
    if (options.cropName) formData.append('crop_name', options.cropName);
    if (options.farmId) formData.append('farm_id', options.farmId);
    if (options.scenario) formData.append('scenario', options.scenario);
    return apiRequest('/disease/predict', { method: 'POST', body: formData });
  },
  getScanResultById: (id: string) => apiRequest(`/history/${id}`)
};
```

### Smart Irrigation Advisor
```typescript
export const irrigationService = {
  getRecommendation: (farmId?: string) => apiRequest(`/irrigation/recommend${farmId ? `?farmId=${farmId}` : ''}`, { method: 'POST' }),
  updateFieldConditions: (farmId: string, conditions) => apiRequest('/irrigation/conditions', {
    method: 'PUT',
    body: JSON.stringify({ farmId, ...conditions })
  })
};
```

### Dashboard Cockpit
```typescript
export const dashboardService = {
  getSummary: (farmId?: string) => apiRequest(`/dashboard${farmId ? `?farm_id=${farmId}` : ''}`)
};
```
