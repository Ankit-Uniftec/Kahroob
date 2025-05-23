import { useState, createContext } from 'react'

export const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
    const [calculation, setCalculation] = useState(null);
    const [currentLocation, setCurrentLocation] = useState(null);
    const [searchedLocation, setSearchedLocation] = useState(null);
    const [EVStation, setEVStation] = useState(null);

    return (
        <LocationContext.Provider
            value={{
                calculation,
                setCalculation,
                EVStation,
                setEVStation,
                currentLocation,
                setCurrentLocation,
                searchedLocation,
                setSearchedLocation,
            }}
        >
            {children}
        </LocationContext.Provider>
    );
};