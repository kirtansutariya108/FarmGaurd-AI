import { WeatherData } from '../types/weather';
import { mockWeatherData } from '../data/mockWeather';

export const mockWeatherService = {
  async getCurrentWeather(location?: string): Promise<WeatherData> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      ...mockWeatherData,
      location: location || mockWeatherData.location,
      lastUpdated: 'Just now'
    };
  },

  async refreshForecast(): Promise<WeatherData> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      ...mockWeatherData,
      lastUpdated: 'Just now'
    };
  }
};
