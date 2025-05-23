import React from 'react';
import { LocationProvider } from './location';

const AppProviders = ({ children }) => {
    return (
        <LocationProvider>
            {children}
        </LocationProvider>
    );
};

export default AppProviders;