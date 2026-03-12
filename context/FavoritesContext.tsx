import React, { createContext, useContext, useState } from "react";

// Описание структуры вакансии
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
// Описание того, что будет храниться в контексте избранного
interface FavoritesContextType {
  favorites: Vacancy[];
  addFavorite: (vacancy: Vacancy) => void; // Функция добавления в избранное
  removeFavorite: (id: string) => void; // Функция удаления из избранного
  isFavorite: (id: string) => boolean; // Проверка, есть ли вакансия в избранном
}
// Сам контекст. Изначально он null, потом будет заполнен провайдером
const FavoritesContext = createContext<FavoritesContextType | null>(null);
// Компонент-провайдер оборачивает часть приложения
export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<Vacancy[]>([]); // Состояние: массив избранных вакансий
  // Добавление вакансии в избранное
  const addFavorite = (vacancy: Vacancy) => {
    setFavorites((prev) => [...prev, vacancy]); // Добавляем к существующему массиву
  };
  // Удаление вакансии из избранного по id
  const removeFavorite = (id: string) => {
    setFavorites((prev) => prev.filter((v) => v.id !== id)); // Оставляем все, кроме удаляемой
  };
  // Проверка, находится ли вакансия в избранном
  const isFavorite = (id: string) => {
    return favorites.some((v) => v.id === id);
  };
  // Провайдер передает значение контекста всем дочерним компонентам
  return (
    <FavoritesContext.Provider
      value={{ favorites, addFavorite, removeFavorite, isFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}
// Хук для использования контекста в компонентах
export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error(
      "useFavorites должен использоваться внутри FavoritesProvider",
    );
  }
  return context;
}
