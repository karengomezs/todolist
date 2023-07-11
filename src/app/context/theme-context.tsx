"use client";

import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useState,
} from "react";

interface Theme {
  theme: boolean;
  setTheme: Dispatch<SetStateAction<boolean>>;
}

const ThemeContext = createContext<Theme>({
  theme: true,
  setTheme: () => {},
});

export const ThemeProvider = (props: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<boolean>(true);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {props.children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
