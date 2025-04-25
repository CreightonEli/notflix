import React, { createContext, useContext, useState } from 'react';

const HeaderVisibilityContext = createContext();

export function HeaderVisibilityProvider({ children }) {
    const [isHeaderVisible, setIsHeaderVisible] = useState(true);

    return (
        <HeaderVisibilityContext.Provider value={{ isHeaderVisible, setIsHeaderVisible }}>
            {children}
        </HeaderVisibilityContext.Provider>
    );
}

export function useHeaderVisibility() {
    return useContext(HeaderVisibilityContext);
}