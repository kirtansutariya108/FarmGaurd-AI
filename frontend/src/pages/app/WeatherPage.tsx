import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useApp } from '../../hooks/useFarmContext';
import { CurrentWeatherCard } from '../../components/weather/CurrentWeatherCard';
import { ForecastList } from '../../components/weather/ForecastList';
import { WeatherInsightCard } from '../../components/weather/WeatherInsightCard';
import { weatherService } from '../../services/weatherService';
import { WeatherData } from '../../types/weather';
import { Button } from '../../components/common/Button';
import { CloudSun, RefreshCw, MapPin, Search, Navigation, AlertCircle, Loader2, Compass } from 'lucide-react';

export const WeatherPage: React.FC = () => {
  const { selectedFarm } = useApp();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState<string>('');
  const [activeQuery, setActiveQuery] = useState<{ lat?: number; lng?: number; city?: string }>({});
  const [lastFetchTime, setLastFetchTime] = useState<Date | null>(null);
  const [timeAgoText, setTimeAgoText] = useState<string>('just now');

  /**
   * Update elapsed time label every 30 seconds
   */
  useEffect(() => {
    if (!lastFetchTime) return;

    const updateAgo = () => {
      const diffMs = Date.now() - lastFetchTime.getTime();
      const diffSec = Math.floor(diffMs / 1000);
      const diffMin = Math.floor(diffSec / 60);

      if (diffSec < 45) {
        setTimeAgoText('just now');
      } else if (diffMin === 1) {
        setTimeAgoText('1 min ago');
      } else if (diffMin < 60) {
        setTimeAgoText(`${diffMin} mins ago`);
      } else {
        const hours = Math.floor(diffMin / 60);
        setTimeAgoText(`${hours}h ago`);
      }
    };

    updateAgo();
    const interval = setInterval(updateAgo, 30000);
    return () => clearInterval(interval);
  }, [lastFetchTime]);

  /**
   * Core weather fetching function
   * Preserves previous weather data if an error occurs.
   */
  const fetchWeather = useCallback(async (
    query: { lat?: number; lng?: number; city?: string },
    mode: 'initial' | 'search' | 'refresh' = 'search'
  ) => {
    if (mode === 'initial' && !weather) {
      setIsInitialLoading(true);
    } else if (mode === 'refresh') {
      setIsRefreshing(true);
    } else {
      setIsSearching(true);
    }
    setErrorMessage(null);

    try {
      let data: WeatherData;
      if (query.lat !== undefined && query.lng !== undefined) {
        data = await weatherService.getWeatherByCoordinates(query.lat, query.lng);
      } else if (query.city) {
        data = await weatherService.getWeatherByCity(query.city);
      } else {
        data = await weatherService.getWeatherByCity('Vadodara');
      }

      setWeather(data);
      setActiveQuery(query);
      setLastFetchTime(new Date());
    } catch (err: any) {
      console.error('Weather fetch failed:', err);
      setErrorMessage(
        err.message || 'Unable to connect to the weather service. Please check your internet connection.'
      );
    } finally {
      setIsInitialLoading(false);
      setIsSearching(false);
      setIsRefreshing(false);
    }
  }, [weather]);

  /**
   * GPS Location Handler
   */
  const handleUseGps = useCallback((isExplicitClick = false) => {
    if (!('geolocation' in navigator)) {
      if (isExplicitClick) {
        setErrorMessage('Geolocation is not supported by your browser. Please search for your city manually.');
      } else {
        const fallbackCity = selectedFarm?.location?.split(',')[0]?.trim() || 'Vadodara';
        fetchWeather({ city: fallbackCity }, 'initial');
      }
      return;
    }

    if (isExplicitClick) {
      setIsSearching(true);
      setErrorMessage(null);
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        fetchWeather({ lat, lng }, isExplicitClick ? 'search' : 'initial');
      },
      (geoError) => {
        console.warn('Geolocation error:', geoError);
        if (isExplicitClick) {
          if (geoError.code === geoError.PERMISSION_DENIED) {
            setErrorMessage('Location access was denied. You can search for your city manually below.');
          } else if (geoError.code === geoError.TIMEOUT) {
            setErrorMessage('Unable to detect your location within timeout. Please search manually.');
          } else {
            setErrorMessage('Unable to detect your GPS location. Please search for your city manually.');
          }
          setIsSearching(false);
        } else {
          // Silent fallback on initial page load
          const fallbackCity = selectedFarm?.location?.split(',')[0]?.trim() || 'Vadodara';
          fetchWeather({ city: fallbackCity }, 'initial');
        }
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 300000 }
    );
  }, [fetchWeather, selectedFarm]);

  // Initial load
  useEffect(() => {
    handleUseGps(false);
  }, []);

  /**
   * Search Form Submit
   */
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const city = searchInput.trim();
    if (!city || isSearching || isRefreshing) return;
    fetchWeather({ city }, 'search');
  };

  /**
   * Quick chip selection
   */
  const handleQuickSearch = (cityName: string) => {
    if (isSearching || isRefreshing) return;
    setSearchInput(cityName);
    fetchWeather({ city: cityName }, 'search');
  };

  // Weather with dynamic time ago
  const weatherWithUpdatedTime = useMemo(() => {
    if (!weather) return null;
    return {
      ...weather,
      lastUpdated: `Updated ${timeAgoText}`
    };
  }, [weather, timeAgoText]);

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto px-2 sm:px-0">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <CloudSun className="w-7 h-7 text-amber-500 flex-shrink-0" />
              <span>Agricultural Weather Intelligence</span>
            </h1>
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              Open-Meteo Live
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 flex-wrap">
            <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
              {weather ? weather.location : 'Detecting farm station...'}
            </span>
            {weather?.latitude !== undefined && weather?.longitude !== undefined && (
              <span className="text-[11px] text-slate-400">
                ({weather.latitude.toFixed(4)}° N, {weather.longitude.toFixed(4)}° E)
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <Button
            onClick={() => handleUseGps(true)}
            variant="outline"
            size="sm"
            disabled={isInitialLoading || isSearching || isRefreshing}
            isLoading={isSearching && activeQuery.lat !== undefined}
            icon={<Navigation className="w-3.5 h-3.5 text-emerald-600" />}
          >
            Use My Location
          </Button>

          <Button
            onClick={() => fetchWeather(activeQuery, 'refresh')}
            variant="primary"
            size="sm"
            isLoading={isRefreshing}
            disabled={isInitialLoading || isSearching}
            icon={<RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />}
          >
            {isRefreshing ? 'Refreshing...' : 'Refresh Telemetry'}
          </Button>
        </div>
      </div>

      {/* Location Search Bar & Quick Regional Chips */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-center gap-2.5">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Enter city or village (e.g. Vadodara, Surat, Rajkot, Anand, Amreli)..."
              disabled={isSearching}
              aria-label="Search city or village location"
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 disabled:opacity-60"
            />
          </div>
          <Button
            type="submit"
            variant="secondary"
            size="sm"
            disabled={isSearching || !searchInput.trim()}
            isLoading={isSearching && !isRefreshing && activeQuery.lat === undefined}
            className="w-full sm:w-auto flex-shrink-0"
          >
            Search Location
          </Button>
        </form>

        {/* Quick Region Chips */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-[11px] text-slate-400 font-medium">Quick hubs:</span>
          {['Vadodara', 'Surat', 'Rajkot', 'Anand', 'Amreli', 'Ludhiana'].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => handleQuickSearch(c)}
              disabled={isSearching || isRefreshing}
              className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 dark:bg-slate-800 dark:hover:bg-emerald-950 dark:hover:text-emerald-300 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60 transition-colors disabled:opacity-50"
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Error Alert Box (Preserves previous weather data) */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in shadow-xs">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 flex-shrink-0" />
            <div>
              <p className="text-xs font-bold">Weather Request Notice</p>
              <p className="text-xs text-rose-600 dark:text-rose-300 mt-0.5">{errorMessage}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button size="sm" variant="danger" onClick={() => fetchWeather(activeQuery, 'refresh')} icon={<RefreshCw className="w-3.5 h-3.5" />}>
              Retry
            </Button>
            <Button size="sm" variant="outline" onClick={() => setErrorMessage(null)}>
              Dismiss
            </Button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      {isInitialLoading && !weather ? (
        <div className="p-12 flex flex-col items-center justify-center text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-xs">
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Fetching Live Field Telemetry</h3>
            <p className="text-xs text-slate-400 mt-0.5">Connecting to Open-Meteo microclimate weather models...</p>
          </div>
        </div>
      ) : weatherWithUpdatedTime ? (
        <div className="space-y-6">
          {/* Main Telemetry Visual Card */}
          <CurrentWeatherCard weather={weatherWithUpdatedTime} />

          {/* AI Weather Decision Synthesis */}
          <WeatherInsightCard insight={weatherWithUpdatedTime.farmInsight} />

          {/* 7-Day Forecast Grid */}
          <ForecastList forecast={weatherWithUpdatedTime.forecast} />
        </div>
      ) : null}
    </div>
  );
};
