const API_KEY = process.env.EXPO_PUBLIC_WEATHER_API_KEY;
const ENDPOINT = 'https://api.weatherapi.com/v1/forecast.json';
const LANGUAGE = 'es';
const DEFAULT_CITY = process.env.EXPO_PUBLIC_WEATHER_CITY ?? 'Leon de los Aldama';

export const VIEWS = ['hoy', 'pronostico', 'horas', 'astronomia'];

// Pide 5 dias (current.json no trae forecast, por eso usamos forecast.json
// que ya incluye clima actual + dias + horas + datos de astronomia en una sola llamada)
async function fetchForecast(city = DEFAULT_CITY) {
  const params = new URLSearchParams({
    key: API_KEY ?? '',
    q: city,
    days: '5',
    lang: LANGUAGE,
    aqi: 'no',
    alerts: 'no',
  });

  const res = await fetch(`${ENDPOINT}?${params.toString()}`);
  const data = await res.json();

  if (!res.ok || data.error) {
    throw new Error(`WeatherAPI ${res.status}: ${data.error?.message ?? ''}`.trim());
  }

  return data;
}

export async function getWeather(view = 'hoy', city = DEFAULT_CITY) {
  const data = await fetchForecast(city);
  return buildItems(view, data);
}

function buildItems(view, data) {
  switch (view) {
    case 'hoy':
      return [
        {
          id: 'current',
          title: `${data.location.name}, ${data.location.region}`,
          subtitle: data.current.condition.text,
          icon: `https:${data.current.condition.icon}`,
          temp: `${Math.round(data.current.temp_c)}°C`,
          updated: data.current.last_updated,
          details: [
            { label: 'Sensación', value: `${Math.round(data.current.feelslike_c)}°C` },
            { label: 'Humedad', value: `${data.current.humidity}%` },
            { label: 'Viento', value: `${data.current.wind_kph} km/h` },
            { label: 'UV', value: `${data.current.uv}` },
          ],
        },
      ];

    case 'pronostico':
      return data.forecast.forecastday.map((day) => ({
        id: day.date,
        title: formatDay(day.date),
        subtitle: day.day.condition.text,
        icon: `https:${day.day.condition.icon}`,
        temp: `${Math.round(day.day.maxtemp_c)}° / ${Math.round(day.day.mintemp_c)}°`,
        details: [
          { label: 'Máxima', value: `${Math.round(day.day.maxtemp_c)}°C` },
          { label: 'Mínima', value: `${Math.round(day.day.mintemp_c)}°C` },
          { label: 'Prob. de lluvia', value: `${day.day.daily_chance_of_rain}%` },
          { label: 'Humedad', value: `${day.day.avghumidity}%` },
        ],
      }));

    case 'horas': {
      const now = new Date();
      const hours = data.forecast.forecastday
        .flatMap((day) => day.hour)
        .filter((hour) => new Date(hour.time) >= now)
        .slice(0, 24);

      return hours.map((hour) => ({
        id: hour.time,
        title: formatHour(hour.time),
        subtitle: hour.condition.text,
        icon: `https:${hour.condition.icon}`,
        temp: `${Math.round(hour.temp_c)}°C`,
        details: [
          { label: 'Sensación', value: `${Math.round(hour.feelslike_c)}°C` },
          { label: 'Prob. de lluvia', value: `${hour.chance_of_rain}%` },
          { label: 'Viento', value: `${hour.wind_kph} km/h` },
        ],
      }));
    }

    case 'astronomia':
      return data.forecast.forecastday.map((day) => ({
        id: day.date,
        title: formatDay(day.date),
        subtitle: `Amanecer ${day.astro.sunrise} · Atardecer ${day.astro.sunset}`,
        icon: null,
        temp: day.astro.moon_phase,
        details: [
          { label: 'Amanecer', value: day.astro.sunrise },
          { label: 'Atardecer', value: day.astro.sunset },
          { label: 'Salida de luna', value: day.astro.moonrise },
          { label: 'Puesta de luna', value: day.astro.moonset },
          { label: 'Fase lunar', value: day.astro.moon_phase },
        ],
      }));

    default:
      return [];
  }
}

function formatDay(value) {
  return new Intl.DateTimeFormat('es-MX', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date(`${value}T12:00:00`));
}

function formatHour(value) {
  return new Intl.DateTimeFormat('es-MX', {
    weekday: 'short',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(value));
}
