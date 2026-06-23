import React from "react";
import { AppContext, useAppController } from "./useAppController";

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const appState = useAppController();
  return (
    <AppContext.Provider value={appState}>
      {children}
    </AppContext.Provider>
  );
};
