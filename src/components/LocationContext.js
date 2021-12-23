import React, { useContext, createContext } from "react"

const LocationContext = createContext(null)

export const useLocation = () => {
  return useContext(LocationContext)
}

export const usePageLanguage = () => {
  const location = useLocation()
  return /^\/ko\//gi.test(location?.pathname) ? "ko" : "en"
}

export const LocationContextProvider = ({ location, children }) => {
  return (
    <LocationContext.Provider value={location}>
      {children}
    </LocationContext.Provider>
  )
}
