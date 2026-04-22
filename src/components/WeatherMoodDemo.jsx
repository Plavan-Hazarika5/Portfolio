import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';

const DEFAULT_CITY = 'Guwahati';
const SAVED_CITIES_KEY = 'weather-mood-saved-cities';

const WEATHER_CODE_MAP = {
  0: { label: 'Clear Sky', emoji: '☀️', mood: 'energetic' },
  1: { label: 'Mainly Clear', emoji: '🌤️', mood: 'uplifted' },
  2: { label: 'Partly Cloudy', emoji: '⛅', mood: 'calm' },
  3: { label: 'Overcast', emoji: '☁️', mood: 'thoughtful' },
  45: { label: 'Fog', emoji: '🌫️', mood: 'quiet' },
  48: { label: 'Depositing Rime Fog', emoji: '🌫️', mood: 'quiet' },
  51: { label: 'Light Drizzle', emoji: '🌦️', mood: 'cozy' },
  53: { label: 'Drizzle', emoji: '🌦️', mood: 'cozy' },
  55: { label: 'Dense Drizzle', emoji: '🌧️', mood: 'cozy' },
  61: { label: 'Slight Rain', emoji: '🌧️', mood: 'reflective' },
  63: { label: 'Rain', emoji: '🌧️', mood: 'reflective' },
  65: { label: 'Heavy Rain', emoji: '⛈️', mood: 'dramatic' },
  71: { label: 'Slight Snow', emoji: '🌨️', mood: 'serene' },
  73: { label: 'Snow', emoji: '🌨️', mood: 'serene' },
  75: { label: 'Heavy Snow', emoji: '❄️', mood: 'serene' },
  80: { label: 'Rain Showers', emoji: '🌦️', mood: 'reflective' },
  81: { label: 'Rain Showers', emoji: '🌧️', mood: 'reflective' },
  82: { label: 'Violent Showers', emoji: '⛈️', mood: 'dramatic' },
  95: { label: 'Thunderstorm', emoji: '⛈️', mood: 'dramatic' },
  96: { label: 'Thunderstorm with Hail', emoji: '⛈️', mood: 'dramatic' },
  99: { label: 'Thunderstorm with Hail', emoji: '⛈️', mood: 'dramatic' },
};

const MOOD_THEME = {
  energetic: {
    gradient: 'from-sky-400/30 via-cyan-300/25 to-yellow-300/20',
    glow: 'rgba(56, 189, 248, 0.28)',
  },
  uplifted: {
    gradient: 'from-cyan-300/30 via-blue-300/25 to-indigo-300/20',
    glow: 'rgba(125, 211, 252, 0.24)',
  },
  calm: {
    gradient: 'from-indigo-400/25 via-slate-400/20 to-cyan-400/20',
    glow: 'rgba(129, 140, 248, 0.22)',
  },
  thoughtful: {
    gradient: 'from-slate-500/30 via-zinc-500/25 to-slate-700/20',
    glow: 'rgba(100, 116, 139, 0.24)',
  },
  quiet: {
    gradient: 'from-slate-400/30 via-zinc-400/25 to-slate-600/20',
    glow: 'rgba(148, 163, 184, 0.2)',
  },
  cozy: {
    gradient: 'from-teal-400/25 via-cyan-500/20 to-blue-600/25',
    glow: 'rgba(45, 212, 191, 0.24)',
  },
  reflective: {
    gradient: 'from-blue-500/30 via-indigo-500/25 to-slate-700/25',
    glow: 'rgba(59, 130, 246, 0.24)',
  },
  dramatic: {
    gradient: 'from-violet-700/25 via-purple-700/20 to-slate-900/30',
    glow: 'rgba(109, 40, 217, 0.26)',
  },
  serene: {
    gradient: 'from-cyan-100/20 via-slate-100/15 to-blue-100/20',
    glow: 'rgba(186, 230, 253, 0.25)',
  },
  neutral: {
    gradient: 'from-slate-500/25 via-zinc-500/20 to-slate-700/20',
    glow: 'rgba(113, 113, 122, 0.2)',
  },
};

function resolveWeather(code) {
  return WEATHER_CODE_MAP[code] || { label: 'Unknown', emoji: '🌍', mood: 'neutral' };
}

function celsiusToFahrenheit(celsius) {
  return Math.round((celsius * 9) / 5 + 32);
}

function formatWeekday(dateLabel) {
  return new Date(dateLabel).toLocaleDateString('en-US', { weekday: 'short' });
}

function getParticleCount(mood) {
  if (mood === 'dramatic') return 32;
  if (mood === 'cozy' || mood === 'reflective') return 26;
  if (mood === 'serene' || mood === 'quiet') return 22;
  return 16;
}

function getParticleStyle(index, mood) {
  const isRainy = mood === 'cozy' || mood === 'reflective' || mood === 'dramatic';
  const isSnowy = mood === 'serene';
  const size = isRainy ? 2 : isSnowy ? 6 : 4;
  const duration = isRainy ? 1.8 + (index % 5) * 0.35 : 5 + (index % 5) * 0.8;
  const delay = (index % 7) * 0.4;
  const left = `${(index * 7) % 100}%`;

  return {
    left,
    width: `${size}px`,
    height: isRainy ? `${size * 10}px` : `${size}px`,
    borderRadius: isRainy ? '999px' : '50%',
    animationDuration: `${duration}s`,
    animationDelay: `${delay}s`,
    opacity: isRainy ? 0.35 : 0.5,
    background: isRainy ? 'rgba(147,197,253,0.8)' : 'rgba(226,232,240,0.9)',
  };
}

async function getCoordinates(city) {
  const response = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`,
  );

  if (!response.ok) {
    throw new Error('Could not fetch location.');
  }

  const data = await response.json();
  if (!data.results?.length) {
    throw new Error('City not found. Try another one.');
  }

  const [match] = data.results;
  return {
    name: `${match.name}, ${match.country_code}`,
    latitude: match.latitude,
    longitude: match.longitude,
  };
}

async function getLocationFromCoords(latitude, longitude) {
  const response = await fetch(
    `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${latitude}&longitude=${longitude}&language=en&format=json`,
  );

  if (!response.ok) {
    return `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;
  }

  const data = await response.json();
  if (!data.results?.length) {
    return `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;
  }

  const [match] = data.results;
  return `${match.name}, ${match.country_code}`;
}

async function getWeather(latitude, longitude) {
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,wind_speed_10m,weather_code&hourly=relative_humidity_2m,temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`,
  );

  if (!response.ok) {
    throw new Error('Could not fetch weather right now.');
  }

  const data = await response.json();
  const forecast = (data.daily?.time || []).slice(0, 5).map((day, index) => ({
    date: day,
    code: data.daily.weather_code[index],
    max: Math.round(data.daily.temperature_2m_max[index]),
    min: Math.round(data.daily.temperature_2m_min[index]),
  }));

  return {
    temperature: Math.round(data.current.temperature_2m),
    feelsLike: Math.round(data.current.apparent_temperature),
    wind: Math.round(data.current.wind_speed_10m),
    weatherCode: data.current.weather_code,
    humidity: data.hourly.relative_humidity_2m?.[0] ?? null,
    forecast,
  };
}

export default function WeatherMoodDemo() {
  const [cityInput, setCityInput] = useState(DEFAULT_CITY);
  const [query, setQuery] = useState(DEFAULT_CITY);
  const [location, setLocation] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [unit, setUnit] = useState('C');
  const [savedCities, setSavedCities] = useState([]);
  const [locating, setLocating] = useState(false);

  const weatherDetails = useMemo(() => resolveWeather(weather?.weatherCode), [weather]);
  const moodTheme = useMemo(() => MOOD_THEME[weatherDetails.mood] || MOOD_THEME.neutral, [weatherDetails.mood]);
  const particles = useMemo(() => Array.from({ length: getParticleCount(weatherDetails.mood) }, (_, i) => i), [weatherDetails.mood]);

  function formatTemp(valueInCelsius) {
    if (valueInCelsius === null || valueInCelsius === undefined) return '--';
    if (unit === 'F') return `${celsiusToFahrenheit(valueInCelsius)}°F`;
    return `${valueInCelsius}°C`;
  }

  function saveCity(cityName) {
    if (!cityName) return;
    setSavedCities((prev) => {
      const next = [cityName, ...prev.filter((city) => city.toLowerCase() !== cityName.toLowerCase())].slice(0, 6);
      localStorage.setItem(SAVED_CITIES_KEY, JSON.stringify(next));
      return next;
    });
  }

  async function performSearch(city) {
    if (!city.trim()) {
      return;
    }

    try {
      setLoading(true);
      setError('');
      setQuery(city.trim());
      const coords = await getCoordinates(city.trim());
      const currentWeather = await getWeather(coords.latitude, coords.longitude);
      setLocation(coords.name);
      setWeather(currentWeather);
      saveCity(coords.name);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  async function handleSearch(event) {
    if (event) {
      event.preventDefault();
    }
    await performSearch(cityInput);
  }

  function handleLocateMe() {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported in this browser.');
      return;
    }

    setLocating(true);
    setError('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          const [label, currentWeather] = await Promise.all([
            getLocationFromCoords(latitude, longitude),
            getWeather(latitude, longitude),
          ]);

          setCityInput(label.split(',')[0] || label);
          setQuery(label);
          setLocation(label);
          setWeather(currentWeather);
          saveCity(label);
        } catch {
          setError('Could not load weather for your location.');
        } finally {
          setLocating(false);
        }
      },
      () => {
        setError('Location permission denied. Please allow access and try again.');
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SAVED_CITIES_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setSavedCities(parsed);
        }
      }
    } catch {
      // Ignore malformed local storage payloads
    }
  }, []);

  useEffect(() => {
    performSearch(DEFAULT_CITY);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section id="weather-mood-demo" className="py-24 px-6 bg-void relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <span className="font-mono text-xs text-rose-400 uppercase tracking-[0.3em] mb-3 block">
            Project 02
          </span>
          <h2 className="font-heading text-4xl md:text-5xl text-white mb-3">Weather & Mood UI</h2>
          <p className="text-white/60 max-w-2xl">
            Live demo powered by Open-Meteo APIs. The color tone and visual mood shift as weather changes.
          </p>
        </div>

        <motion.div
          className={`rounded-3xl border border-glass-border bg-glass backdrop-blur-glass p-6 md:p-8 relative overflow-hidden`}
          animate={{ boxShadow: `0 0 60px ${moodTheme.glow}` }}
          transition={{ duration: 0.6 }}
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${moodTheme.gradient} pointer-events-none`} />
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {particles.map((particle) => (
              <span
                key={particle}
                className="absolute -top-12 weather-particle"
                style={getParticleStyle(particle, weatherDetails.mood)}
              />
            ))}
          </div>

          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
              <form onSubmit={handleSearch} className="flex-1 flex flex-col md:flex-row gap-3">
                <input
                  value={cityInput}
                  onChange={(event) => setCityInput(event.target.value)}
                  placeholder="Search city (e.g. Guwahati, London)"
                  className="flex-1 rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-rose-400/70 transition-colors"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-xl px-6 py-3 bg-rose-500 text-white font-mono uppercase tracking-wider text-sm disabled:opacity-60"
                >
                  {loading ? 'Loading...' : 'Get Mood'}
                </button>
                <button
                  type="button"
                  onClick={handleLocateMe}
                  disabled={locating}
                  className="rounded-xl px-6 py-3 border border-white/20 bg-black/20 text-white/90 font-mono uppercase tracking-wider text-sm disabled:opacity-60"
                >
                  {locating ? 'Locating...' : 'Use My Location'}
                </button>
              </form>

              <div className="inline-flex rounded-xl border border-white/10 bg-black/25 p-1">
                <button
                  type="button"
                  onClick={() => setUnit('C')}
                  className={`px-3 py-2 rounded-lg font-mono text-xs ${unit === 'C' ? 'bg-white/15 text-white' : 'text-white/60'}`}
                >
                  Celsius
                </button>
                <button
                  type="button"
                  onClick={() => setUnit('F')}
                  className={`px-3 py-2 rounded-lg font-mono text-xs ${unit === 'F' ? 'bg-white/15 text-white' : 'text-white/60'}`}
                >
                  Fahrenheit
                </button>
              </div>
            </div>

            {error ? <p className="text-red-300 text-sm mb-4">{error}</p> : null}

            {savedCities.length ? (
              <div className="mb-5 flex flex-wrap gap-2">
                {savedCities.map((savedCity) => (
                  <button
                    key={savedCity}
                    type="button"
                    onClick={async () => {
                      const cityOnly = savedCity.split(',')[0]?.trim() || savedCity;
                      setCityInput(cityOnly);
                      await performSearch(cityOnly);
                    }}
                    className="px-3 py-1.5 rounded-full border border-white/10 bg-black/25 text-white/75 text-xs hover:border-white/25 transition-colors"
                  >
                    {savedCity}
                  </button>
                ))}
              </div>
            ) : null}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-2xl border border-white/10 bg-black/25 p-5 md:col-span-2">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-white/50 text-sm mb-2">Now in</p>
                    <h3 className="text-2xl md:text-3xl font-heading text-white">{location || query}</h3>
                  </div>
                  <span className={`text-4xl weather-emoji weather-emoji-${weatherDetails.mood}`} aria-hidden>
                    {weatherDetails.emoji}
                  </span>
                </div>
                <p className="text-white/80 mt-4 text-lg">{weatherDetails.label}</p>
                <p className="text-white/60 capitalize">Mood: {weatherDetails.mood}</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/25 p-5">
                <p className="text-white/50 text-sm mb-2">Temperature</p>
                <p className="text-4xl font-heading text-white">{weather ? formatTemp(weather.temperature) : '--'}</p>
                <p className="text-white/60 mt-2">Feels like {weather ? formatTemp(weather.feelsLike) : '--'}</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/25 p-5">
                <p className="text-white/50 text-sm mb-2">Wind Speed</p>
                <p className="text-3xl font-heading text-white">{weather ? `${weather.wind} km/h` : '--'}</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/25 p-5">
                <p className="text-white/50 text-sm mb-2">Humidity</p>
                <p className="text-3xl font-heading text-white">
                  {weather?.humidity !== null && weather?.humidity !== undefined ? `${weather.humidity}%` : '--'}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/25 p-5">
                <p className="text-white/50 text-sm mb-2">Weather Code</p>
                <p className="text-3xl font-heading text-white">{weather ? weather.weatherCode : '--'}</p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-black/25 p-5">
              <p className="text-white/60 text-sm mb-4">5-Day Forecast</p>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {(weather?.forecast || []).map((day) => {
                  const info = resolveWeather(day.code);
                  return (
                    <div key={day.date} className="rounded-xl border border-white/10 bg-black/20 p-3">
                      <p className="text-white/60 text-xs">{formatWeekday(day.date)}</p>
                      <p className={`text-xl mt-1 weather-emoji weather-emoji-${info.mood}`}>{info.emoji}</p>
                      <p className="text-white/85 text-xs truncate">{info.label}</p>
                      <p className="text-white/70 text-xs mt-1">
                        {formatTemp(day.max)} / {formatTemp(day.min)}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
