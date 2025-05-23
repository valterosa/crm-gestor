import { createContext } from "react";

// Define the type for your app configuration context
interface AppConfigContextType {
  // Add your configuration properties here
  theme: string;
  language: string;
  toggleTheme: () => void;
}

const AppConfigContext = createContext<AppConfigContextType | undefined>(
  undefined
);

export { AppConfigContext };
export type { AppConfigContextType };
