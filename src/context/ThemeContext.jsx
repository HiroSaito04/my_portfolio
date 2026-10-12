
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const ThemeContext = createContext(null);

const STORAGE_KEY = "mike-theme";

const validPreferences = [
  "system",
  "light",
  "dark",
];

function getInitialPreference() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (validPreferences.includes(saved)) {
      return saved;
    }
  } catch {
    // Use system theme when local storage is unavailable.
  }

  return "system";
}

function getSystemTheme() {
  if (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: light)").matches
  ) {
    return "light";
  }

  return "dark";
}

export function ThemeProvider({ children }) {
  const [preference, setPreference] = useState(
    getInitialPreference
  );

  const [systemTheme, setSystemTheme] = useState(
    getSystemTheme
  );

  // Follow operating system theme changes.
  useEffect(() => {
    const mediaQuery = window.matchMedia(
      "(prefers-color-scheme: light)"
    );

    const handleSystemThemeChange = (event) => {
      setSystemTheme(event.matches ? "light" : "dark");
    };

    mediaQuery.addEventListener(
      "change",
      handleSystemThemeChange
    );

    return () => {
      mediaQuery.removeEventListener(
        "change",
        handleSystemThemeChange
      );
    };
  }, []);

  const theme =
    preference === "system"
      ? systemTheme
      : preference;

  // Apply the resolved theme and save preference.
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;

    try {
      localStorage.setItem(STORAGE_KEY, preference);
    } catch {
      // Theme still works without local storage.
    }
  }, [theme, preference]);

  const value = useMemo(
    () => ({
      theme,
      preference,
      setPreference,

      // Compatibility with existing components.
      setTheme: setPreference,

      toggleTheme: () => {
        setPreference(
          theme === "dark" ? "light" : "dark"
        );
      },
    }),
    [theme, preference]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "useTheme must be used inside ThemeProvider"
    );
  }

  return context;
}
