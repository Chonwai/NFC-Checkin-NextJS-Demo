'use client';

import { ThemeProvider } from 'next-themes';
import { createContext, useContext, useState } from 'react';

interface TimeZoneContextType {
    useLocalTimezone: boolean;
    toggleTimezone: () => void;
}

const TimeZoneContext = createContext<TimeZoneContextType>({
    useLocalTimezone: false,
    toggleTimezone: () => {}
});

export function Providers({ children }: { children: React.ReactNode }) {
    const [useLocalTimezone, setUseLocalTimezone] = useState(false);

    const toggleTimezone = () => {
        setUseLocalTimezone((prev) => !prev);
    };

    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
            forcedTheme="light"
        >
            <TimeZoneContext.Provider value={{ useLocalTimezone, toggleTimezone }}>
                {children}
            </TimeZoneContext.Provider>
        </ThemeProvider>
    );
}

export const useTimezone = () => useContext(TimeZoneContext);
