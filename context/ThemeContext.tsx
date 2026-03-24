import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

// Ключ для хранения темы
const THEME_STORAGE_KEY = "@SSrch_theme";

// Типы тем
export type ThemeType = "dark" | "light";

// Определение цветов для тёмной и светлой темы
export const themeColors = {
  dark: {
    // Основные цвета
    background: ["#2A2A2A", "#3A3A3A"] as const, // градиент
    backgroundSolid: "#2A2A2A",
    card: "#3A3A3A",
    cardBorder: "#555",

    // Текст
    textPrimary: "#FFFFFF",
    textSecondary: "#CCCCCC",
    textTertiary: "#999999",
    textMuted: "#666666",

    // Акценты
    accent: "#4CAF50",
    accentButton: "#FFFFFF",
    accentButtonText: "#2A2A2A",

    // Ввод
    inputBackground: "#3A3A3A",
    inputBorder: "#555",
    inputPlaceholder: "#666",

    // Ошибки
    error: "#FF6B6B",
    errorBackground: "#442222",
  },
  light: {
    // Основные цвета
    background: ["#F5F5F5", "#FFFFFF"] as const, // градиент
    backgroundSolid: "#FFFFFF",
    card: "#FFFFFF",
    cardBorder: "#E0E0E0",

    // Текст
    textPrimary: "#1A1A1A",
    textSecondary: "#666666",
    textTertiary: "#999999",
    textMuted: "#CCCCCC",

    // Акценты
    accent: "#4CAF50",
    accentButton: "#4CAF50",
    accentButtonText: "#FFFFFF",

    // Ввод
    inputBackground: "#F5F5F5",
    inputBorder: "#E0E0E0",
    inputPlaceholder: "#999999",

    // Ошибки
    error: "#FF6B6B",
    errorBackground: "#FFEEEE",
  },
};
// Описание того, что будет храниться в контексте темы
interface ThemeContextType {
  theme: ThemeType; // текущая тема ('dark' или 'light')
  colors: typeof themeColors.dark | typeof themeColors.light; // цвета для текущей темы
  toggleTheme: () => void; // функция переключения темы
  setTheme: (theme: ThemeType) => void; // функция установки конкретной темы
}
// Создаём контекст с начальным значением null
const ThemeContext = createContext<ThemeContextType | null>(null);
// Провайдер — оборачивает приложение и предоставляет тему всем дочерним компонентам
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Состояние: текущая тема (по умолчанию 'dark')
  const [theme, setThemeState] = useState<ThemeType>("dark");

  // Загрузка сохраненной темы при запуске
  useEffect(() => {
    loadTheme();
  }, []);
  // Функция загрузки темы из AsyncStorage
  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      // Если в хранилище есть корректное значение, устанавливаем ег
      if (savedTheme === "light" || savedTheme === "dark") {
        setThemeState(savedTheme);
      }
    } catch (error) {
      console.error("Ошибка загрузки темы:", error);
    }
  };
  // Функция сохранения темы в AsyncStorage и обновления состояния
  const setTheme = async (newTheme: ThemeType) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
      setThemeState(newTheme);
    } catch (error) {
      console.error("Ошибка сохранения темы:", error);
    }
  };
  // Функция переключения темы
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };
  // Получаем цвета для текущей темы
  const colors = themeColors[theme];
  // Провайдер передаёт значение контекста всем дочерним компонентам
  return (
    <ThemeContext.Provider value={{ theme, colors, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
// Хук для удобного использования контекста в компонентах
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
