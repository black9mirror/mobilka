import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

interface Vacancy {
  id: string;
  title: string;
  company: string;
  salary: string;
  city: string;
  experience: string;
  description: string;
  requirements: string[];
}

interface FavoritesContextType {
  favorites: Vacancy[];
  addFavorite: (vacancy: Vacancy) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | null>(null);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Vacancy[]>([]);

  // Ключ уникален для каждого пользователя по email
  const storageKey = user?.email ? `@SSrch_favorites_${user.email}` : null;

  // Загружаем избранное когда пользователь входит (меняется user)
  useEffect(() => {
    const loadFavorites = async () => {
      // Если пользователь не авторизован — очищаем список
      if (!storageKey) {
        setFavorites([]);
        return;
      }
      try {
        const stored = await AsyncStorage.getItem(storageKey);
        setFavorites(stored ? JSON.parse(stored) : []);
      } catch (error) {
        console.error("Ошибка загрузки избранного:", error);
      }
    };
    loadFavorites();
  }, [storageKey]); // срабатывает при смене пользователя

  // Сохраняем избранное при каждом изменении списка
  useEffect(() => {
    const saveFavorites = async () => {
      // Не сохраняем если пользователь не авторизован
      if (!storageKey) return;
      try {
        await AsyncStorage.setItem(storageKey, JSON.stringify(favorites));
      } catch (error) {
        console.error("Ошибка сохранения избранного:", error);
      }
    };
    saveFavorites();
  }, [favorites, storageKey]);

  const addFavorite = (vacancy: Vacancy) => {
    setFavorites((prev) => [...prev, vacancy]);
  };

  const removeFavorite = (id: string) => {
    setFavorites((prev) => prev.filter((v) => v.id !== id));
  };

  const isFavorite = (id: string) => {
    return favorites.some((v) => v.id === id);
  };

  return (
    <FavoritesContext.Provider
      value={{ favorites, addFavorite, removeFavorite, isFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within FavoritesProvider");
  }
  return context;
}
