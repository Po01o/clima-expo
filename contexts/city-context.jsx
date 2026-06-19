import { createContext, useContext, useState } from 'react';

const DEFAULT_CITY = process.env.EXPO_PUBLIC_WEATHER_CITY ?? 'Leon de los Aldama';

const CityContext = createContext({
  city: DEFAULT_CITY,
  setCity: () => {},
});

export function CityProvider({ children }) {
  const [city, setCity] = useState(DEFAULT_CITY);
  return (
    <CityContext.Provider value={{ city, setCity }}>
      {children}
    </CityContext.Provider>
  );
}

export function useCity() {
  return useContext(CityContext);
}
