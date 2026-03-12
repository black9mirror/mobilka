import React, { createContext, useContext, useState } from "react";
// Структура объекта User с данными
interface User {
  email: string;
  phone: string;
  // необязательные поле
  firstName?: string;
  lastName?: string;
  patronymic?: string;
  birthDate?: string;
}
// Интерфейс контекста авторизации описывает, что будет доступно
interface AuthContextType {
  user: User | null; // данные пользователя
  login: (userData: User) => void; // функция входа
  logout: () => void; // функция выхода
  updateProfile: (data: Partial<User>) => void; // функция обновления профиля
}
// Создаем сам контекст с начальным значением null
const AuthContext = createContext<AuthContextType | null>(null);
// Оборачиваем приложение и предоставляем контекст всем дочерним компонентам
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  // Функция входа - сохраняет данные пользователя
  const login = (userData: User) => {
    setUser(userData);
  };
  // Функция выхода - очищает данные пользователя
  const logout = () => {
    setUser(null);
  };

  // Обновляет только переданные поля, остальные сохраняет
  const updateProfile = (data: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...data } : prev));
  };
  // Провайдер передает значение контекста всем дочерним компонентам
  return (
    <AuthContext.Provider value={{ user, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}
// Хук для использования контекста в компонентах
export function useAuth() {
  const context = useContext(AuthContext);
  // Если хук вызван там, где нет провайдера, то ошибка
  if (!context) {
    throw new Error("useAuth должен использоваться внутри AuthProvider");
  }
  return context;
}
