/**
 * weatherService.ts
 *
 * Calls Open-Meteo and its Geocoding API **directly from the browser**.
 * No backend is required — the weather page works even when the FastAPI
 * server is offline.
 */

import { WeatherData, ForecastDay } from '../types/weather';

// ─── WMO Weather Code map ─────────────────────────────────────────────────────
const WMO: Record<number, [string, string]> = {
  0:  ['Clear Sky',                   'sun'],
  1:  ['Mainly Clear',                'cloud-sun'],
  2:  ['Partly Cloudy',               'cloud-sun'],
  3:  ['Overcast',                    'cloud'],
  45: ['Fog',                         'cloud-fog'],
  48: ['Depositing Rime Fog',         'cloud-fog'],
  51: ['Light Drizzle',               'cloud-drizzle'],
  53: ['Moderate Drizzle',            'cloud-drizzle'],
  55: ['Dense Drizzle',               'cloud-drizzle'],
  61: ['Slight Rain',                 'cloud-rain'],
  63: ['Moderate Rain',               'cloud-rain'],
  65: ['Heavy Rain',                  'cloud-rain'],
  71: ['Slight Snow',                 'snowflake'],
  73: ['Moderate Snow',               'snowflake'],
  75: ['Heavy Snow',                  'snowflake'],
  80: ['Rain Showers',                'cloud-rain'],
  81: ['Moderate Rain Showers',       'cloud-rain'],
  82: ['Violent Rain Showers',        'cloud-rain'],
  85: ['Slight Snow Showers',         'snowflake'],
  86: ['Heavy Snow Showers',          'snowflake'],
  95: ['Thunderstorm',                'cloud-lightning'],
  96: ['Thunderstorm w/ Slight Hail', 'cloud-lightning'],
  99: ['Thunderstorm w/ Heavy Hail',  'cloud-lightning'],
};

const DAY_ABBR = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function parseWmo(code: number | null | undefined): [string, string] {
  if (code == null) return ['Partly Cloudy', 'cloud-sun'];
  return WMO[code] ?? ['Partly Cloudy', 'cloud-sun'];
}

function buildInsight(temp: number, humidity: number, rainProb: number, precip: number, soilTemp: number): string {
  if (rainProb >= 60 || precip > 2.0) {
    return `High precipitation likelihood (${rainProb.toFixed(0)}%). Postpone irrigation cycles and foliar spraying.`;
  }
  if (rainProb >= 30) {
    return `Scattered rain possible (${rainProb.toFixed(0)}%). Check rootzone moisture before field irrigation.`;
  }
  if (temp >= 36) {
    return `Elevated temperature (${temp.toFixed(1)}°C) with high evapotranspiration demand. Ensure adequate soil hydration.`;
  }
  if (humidity >= 85) {
    return `High relative humidity (${humidity.toFixed(0)}%). Monitor canopy for foliar fungal and bacterial spore proliferation.`;
  }
  return `Optimal agro-climatic conditions. Soil temperature is ${soilTemp.toFixed(1)}°C — suitable for paddy maintenance.`;
}

// ─── Geocoding ────────────────────────────────────────────────────────────────
async function geocodeCity(city: string): Promise<{ lat: number; lng: number; name: string } | null> {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city.trim())}&count=1&language=en&format=json`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const json = await res.json();
  const results: any[] = json.results ?? [];
  if (!results.length) return null;
  const top = results[0];
  const parts = [top.name, top.admin1, top.country].filter(Boolean);
  return {
    lat: parseFloat(top.latitude),
    lng: parseFloat(top.longitude),
    name: parts.join(', '),
  };
}

// ─── Open-Meteo forecast fetch ────────────────────────────────────────────────
async function fetchOpenMeteo(lat: number, lng: number, locationName: string): Promise<WeatherData> {
  const url =
    `https://api.open-meteo.com/v1/forecast?` +
    `latitude=${lat}&longitude=${lng}` +
    `&current=temperature_2m,relative_humidity_2m,precipitation,precipitation_probability,wind_speed_10m,weather_code,soil_temperature_0cm` +
    `&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,relative_humidity_2m_mean,uv_index_max,weather_code` +
    `&timezone=auto`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Open-Meteo responded with status ${res.status}`);
  const data = await res.json();

  const cur = data.current ?? {};
  const daily = data.daily ?? {};

  const currTemp     = parseFloat(cur.temperature_2m      ?? 28);
  const currHumidity = parseFloat(cur.relative_humidity_2m ?? 70);
  const currRainProb = parseFloat(cur.precipitation_probability ?? 0) || 0;
  const currWind     = parseFloat(cur.wind_speed_10m       ?? 10);
  const currPrecip   = parseFloat(cur.precipitation        ?? 0) || 0;
  const currSoilTemp = parseFloat(cur.soil_temperature_0cm ?? (currTemp - 2));
  const [currCondition] = parseWmo(cur.weather_code);

  const dates   = (daily.time                        ?? []) as string[];
  const tMax    = (daily.temperature_2m_max          ?? []) as number[];
  const tMin    = (daily.temperature_2m_min          ?? []) as number[];
  const pSum    = (daily.precipitation_sum           ?? []) as number[];
  const pProb   = (daily.precipitation_probability_max ?? []) as number[];
  const hum     = (daily.relative_humidity_2m_mean   ?? []) as number[];
  const uvMax   = (daily.uv_index_max                ?? []) as number[];
  const codes   = (daily.weather_code                ?? []) as number[];

  const forecast: ForecastDay[] = dates.slice(0, 7).map((d, i) => {
    const date = new Date(d);
    const dayLabel = i === 0 ? 'Today' : DAY_ABBR[date.getDay()];
    const [condition, icon] = parseWmo(codes[i]);
    return {
      date: d,
      dayName: dayLabel,
      tempMax: Math.round((tMax[i] ?? 30) * 10) / 10,
      tempMin: Math.round((tMin[i] ?? 22) * 10) / 10,
      condition,
      rainProbability: Math.round(pProb[i] ?? 0),
      humidity: Math.round(hum[i] ?? 65),
      icon,
      precipitationMm: Math.round((pSum[i] ?? 0) * 10) / 10,
      uvIndex: Math.round((uvMax[i] ?? 5) * 10) / 10,
    };
  });

  const todayUv = uvMax[0] ?? 5;

  return {
    location: locationName,
    latitude: Math.round(lat * 10000) / 10000,
    longitude: Math.round(lng * 10000) / 10000,
    currentTemp: Math.round(currTemp * 10) / 10,
    condition: currCondition,
    humidity: Math.round(currHumidity * 10) / 10,
    rainProbability: Math.round(currRainProb),
    windSpeedKmH: Math.round(currWind * 10) / 10,
    uvIndex: Math.round(todayUv * 10) / 10,
    soilTemp: Math.round(currSoilTemp * 10) / 10,
    precipitationMm: Math.round(currPrecip * 10) / 10,
    forecast,
    farmInsight: buildInsight(currTemp, currHumidity, currRainProb, currPrecip, currSoilTemp),
    lastUpdated: 'Just now',
    source: 'open-meteo',
  };
}

// ─── Public API ───────────────────────────────────────────────────────────────
export const weatherService = {
  /** Fetch weather by GPS coordinates directly from Open-Meteo. */
  async getWeatherByCoordinates(latitude: number, longitude: number): Promise<WeatherData> {
    const locationName = `${latitude.toFixed(4)}° N, ${longitude.toFixed(4)}° E`;
    try {
      return await fetchOpenMeteo(latitude, longitude, locationName);
    } catch (err: any) {
      throw new Error('Unable to fetch live weather. Please check your internet connection and try again.');
    }
  },

  /** Geocode city name then fetch weather from Open-Meteo. */
  async getWeatherByCity(city: string): Promise<WeatherData> {
    const trimmed = city.trim();
    if (!trimmed) throw new Error('Please enter a city or village name.');

    // Try geocoding first
    let lat = 22.3072;
    let lng = 73.1812;
    let name = trimmed;

    try {
      const geo = await geocodeCity(trimmed);
      if (geo) {
        lat = geo.lat;
        lng = geo.lng;
        name = geo.name;
      } else {
        throw new Error(`Location '${trimmed}' not found. Please check the spelling and try again.`);
      }
    } catch (geoErr: any) {
      // If the error is "not found", rethrow. Otherwise network error — try with defaults.
      if (geoErr.message?.includes('not found')) throw geoErr;
      // Network issue during geocoding — use default Vadodara coords as fallback
      name = trimmed;
    }

    try {
      return await fetchOpenMeteo(lat, lng, name);
    } catch (err: any) {
      throw new Error('Unable to fetch live weather. Please check your internet connection and try again.');
    }
  },

  /** Generic fetcher supporting coordinates or city search. */
  async getWeather(params: { latitude?: number; longitude?: number; city?: string }): Promise<WeatherData> {
    if (params.latitude !== undefined && params.longitude !== undefined) {
      return this.getWeatherByCoordinates(params.latitude, params.longitude);
    }
    if (params.city) {
      return this.getWeatherByCity(params.city);
    }
    throw new Error('Either coordinates (latitude & longitude) or a city name is required.');
  },
};
