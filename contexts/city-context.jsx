import { createContext, useContext, useState } from 'react';

const DEFAULT_CITY_QUERY = process.env.EXPO_PUBLIC_WEATHER_CITY ?? 'Leon, Guanajuato';
const DEFAULT_CITY_NAME = 'León, Guanajuato';

const CityContext = createContext({
  city: DEFAULT_CITY_QUERY,
  cityName: DEFAULT_CITY_NAME,
  setCity: () => {},
  setCityName: () => {},
});

export function CityProvider({ children }) {
  const [city, setCity] = useState(DEFAULT_CITY_QUERY);
  const [cityName, setCityName] = useState(DEFAULT_CITY_NAME);
  return (
    <CityContext.Provider value={{ city, cityName, setCity, setCityName }}>
      {children}
    </CityContext.Provider>
  );
}

export function useCity() {
  return useContext(CityContext);
}
