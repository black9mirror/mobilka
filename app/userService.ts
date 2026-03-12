import AsyncStorage from "@react-native-async-storage/async-storage";

// Ключ для хранения в AsyncStorage
const USERS_STORAGE_KEY = "@SSrch_users";

export interface User {
  email: string;
  phone: string;
  password: string;
}

export const userService = {
  // Загрузка пользователей из хранилища
  async loadUsers(): Promise<User[]> {
    try {
      const storedUsers = await AsyncStorage.getItem(USERS_STORAGE_KEY);
      return storedUsers ? JSON.parse(storedUsers) : [];
    } catch (error) {
      console.error("Ошибка загрузки пользователей:", error);
      return [];
    }
  },

  // Сохранение пользователей в хранилище
  async saveUsers(users: User[]): Promise<void> {
    try {
      await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } catch (error) {
      console.error("Ошибка сохранения пользователей:", error);
    }
  },

  // Добавление нового пользователя
  async addUser(user: User): Promise<boolean> {
    try {
      const users = await this.loadUsers();

      // Проверка на существующего пользователя
      const userExists = users.some((u) => u.email === user.email);
      if (userExists) {
        return false;
      }

      users.push(user);
      await this.saveUsers(users);
      return true;
    } catch (error) {
      console.error("Ошибка добавления пользователя:", error);
      return false;
    }
  },

  // Поиск пользователя по email и паролю
  async findUser(email: string, password: string): Promise<User | null> {
    try {
      const users = await this.loadUsers();
      return (
        users.find((u) => u.email === email && u.password === password) || null
      );
    } catch (error) {
      console.error("Ошибка поиска пользователя:", error);
      return null;
    }
  },

  // Проверка существования пользователя по email
  async userExists(email: string): Promise<boolean> {
    try {
      const users = await this.loadUsers();
      return users.some((u) => u.email === email);
    } catch (error) {
      console.error("Ошибка проверки пользователя:", error);
      return false;
    }
  },

  // Очистка всех пользователей
  async clearAllUsers(): Promise<void> {
    try {
      await AsyncStorage.removeItem(USERS_STORAGE_KEY);
    } catch (error) {
      console.error("Ошибка очистки:", error);
    }
  },
};
