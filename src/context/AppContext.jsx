import React from "react";
import { AppContext } from "./Context";

export const AppContextProvider = (props) => {
  const value = {};

  return (
    <AppContext.Provider value={value}>
        {props.children}
    </AppContext.Provider>
  );
};
