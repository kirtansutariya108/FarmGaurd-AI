import { WeatherData } from '../types/weather';

export const mockWeatherData: WeatherData = {
  location: 'Vadodara, Gujarat',
  currentTemp: 28,
  condition: 'Partly Cloudy',
  humidity: 72,
  rainProbability: 30,
  windSpeedKmH: 12,
  uvIndex: 6,
  soilTemp: 24,
  farmInsight: 'Rain is possible tomorrow (45% probability). We recommend checking your field soil dampness before scheduling heavy morning irrigation.',
  lastUpdated: '10 mins ago',
  forecast: [
    {
      date: 'Today',
      dayName: 'Mon',
      tempMax: 31,
      tempMin: 22,
      condition: 'Partly Cloudy',
      rainProbability: 30,
      humidity: 72,
      icon: 'cloud-sun'
    },
    {
      date: 'Tomorrow',
      dayName: 'Tue',
      tempMax: 29,
      tempMin: 21,
      condition: 'Scattered Showers',
      rainProbability: 55,
      humidity: 82,
      icon: 'cloud-rain'
    },
    {
      date: '17 Sep',
      dayName: 'Wed',
      tempMax: 30,
      tempMin: 23,
      condition: 'Mostly Sunny',
      rainProbability: 15,
      humidity: 65,
      icon: 'sun'
    },
    {
      date: '18 Sep',
      dayName: 'Thu',
      tempMax: 32,
      tempMin: 24,
      condition: 'Clear Sky',
      rainProbability: 10,
      humidity: 60,
      icon: 'sun'
    },
    {
      date: '19 Sep',
      dayName: 'Fri',
      tempMax: 33,
      tempMin: 25,
      condition: 'Sunny',
      rainProbability: 5,
      humidity: 58,
      icon: 'sun'
    }
  ]
};
