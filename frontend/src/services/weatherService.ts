import { WeatherData, WeatherApiResponse } from '../types/weather';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export const weatherService = {
  /**
   * Fetch live weather by GPS latitude and longitude from the FastAPI backend.
   */
  async getWeatherByCoordinates(latitude: number, longitude: number): Promise<WeatherData> {
    const url = `${API_BASE_URL}/weather?latitude=${encodeURIComponent(latitude)}&longitude=${encodeURIComponent(longitude)}`;
    try {
      const res = await fetch(url);
      if (!res.ok) {
        let errorMsg = 'Weather service is currently unavailable. Please try again.';
        try {
          const errJson = await res.json();
          errorMsg = errJson.detail || errJson.message || errorMsg;
        } catch {}
        throw new Error(errorMsg);
      }
      const json: WeatherApiResponse = await res.json();
      return json.data;
    } catch (err: any) {
      if (err.name === 'TypeError' || err.message?.includes('Failed to fetch') || err.message?.includes('NetworkError')) {
        throw new Error('Weather service is currently unavailable. Please check your internet connection and try again.');
      }
      throw err;
    }
  },

  /**
   * Fetch live weather by city/village name using backend Open-Meteo geocoding.
   */
  async getWeatherByCity(city: string): Promise<WeatherData> {
    const cleanCity = city.trim();
    if (!cleanCity) {
      throw new Error('Please enter a city or village name.');
    }
    const url = `${API_BASE_URL}/weather?city=${encodeURIComponent(cleanCity)}`;
    try {
      const res = await fetch(url);
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error(`Location '${cleanCity}' not found. Please check the spelling and try again.`);
        }
        let errorMsg = 'Weather service is currently unavailable. Please try again.';
        try {
          const errJson = await res.json();
          errorMsg = errJson.detail || errJson.message || errorMsg;
        } catch {}
        throw new Error(errorMsg);
      }
      const json: WeatherApiResponse = await res.json();
      return json.data;
    } catch (err: any) {
      if (err.name === 'TypeError' || err.message?.includes('Failed to fetch') || err.message?.includes('NetworkError')) {
        throw new Error('Weather service is currently unavailable. Please check your internet connection and try again.');
      }
      throw err;
    }
  },

  /**
   * Generic fetcher supporting coordinates or city search.
   */
  async getWeather(params: { latitude?: number; longitude?: number; city?: string }): Promise<WeatherData> {
    if (params.latitude !== undefined && params.longitude !== undefined) {
      return this.getWeatherByCoordinates(params.latitude, params.longitude);
    }
    if (params.city) {
      return this.getWeatherByCity(params.city);
    }
    throw new Error('Either coordinates (latitude & longitude) or a city name is required.');
  }
};
