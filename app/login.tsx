import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { userService } from "../app/userService"; // импортируем хранилище
import ThemeToggle from "../components/ThemeToggle";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

// Supabase
const SUPABASE_URL = "https://gyxcmonztjolowohiowa.supabase.co";
const SUPABASE_KEY = "sb_publishable_cDYOlpV0ItpmWyE6RttIEA_9Y_VSygI";
const SUPABASE_HEADERS = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  "Content-Type": "application/json",
};
export default function LoginScreen() {
  const router = useRouter(); // Хук для навигации
  const { colors } = useTheme(); // Получаем цвета из темы
  // Состояния для хранения данных из полей ввода
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  // Валидация email
  const validateEmail = (email: string) => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  };
  // Основной обработчик входа
  const handleLogin = async () => {
    // Проверка формата email
    if (!validateEmail(email)) {
      Alert.alert("Ошибка", "Введите корректный email (пример: name@mail.ru)");
      return;
    }

    // Проверка заполнения пароля
    if (!password) {
      Alert.alert("Ошибка", "Введите пароль");
      return;
    }

    setIsLoading(true); // Блокировка полей, пока заполняются данные

    try {
      // Пробуем Supabase
      const response = await axios.get(
        `${SUPABASE_URL}/rest/v1/users?email=eq.${email}&select=email,phone,password`,
        { headers: SUPABASE_HEADERS, timeout: 5000 },
      );
      // Получаем массив пользователей
      const users = response.data;

      if (users.length === 0) {
        const localUser = await userService.findUser(email, password);
        if (localUser) {
          // Нашли локально - синхронизируем: добавляем в Supabase, чтобы в следующий раз был там
          await axios.post(
            `${SUPABASE_URL}/rest/v1/users`,
            { email, phone: localUser.phone, password },
            { headers: { ...SUPABASE_HEADERS, Prefer: "return=minimal" } },
          );
          Alert.alert("Успех", `Добро пожаловать, ${localUser.email}!`);
          login({ email: localUser.email, phone: localUser.phone ?? "" });
          router.replace("/(tabs)");
        } else {
          const exists = await userService.userExists(email);
          if (exists) {
            Alert.alert("Ошибка", "Неверный пароль");
          } else {
            Alert.alert("Ошибка", "Пользователь не найден. Зарегистрируйтесь.");
          }
        }
        return;
      }
      // Если пользователь найден, берем первого
      const user = users[0];
      // Проверяем пароль
      if (user.password !== password) {
        Alert.alert("Ошибка", "Неверный пароль");
        return;
      }

      Alert.alert("Успех", `Добро пожаловать, ${user.email}!`);
      login({ email: user.email, phone: user.phone ?? "" });
      router.replace("/(tabs)");
    } catch (err) {
      // Supabase недоступен, то используем локальный userService
      if (axios.isAxiosError(err)) {
        console.warn("Supabase недоступен, используется локальное хранилище");

        try {
          // Ищем пользователя в локальном хранилище
          const user = await userService.findUser(email, password);

          if (user) {
            Alert.alert("Успех", `Добро пожаловать, ${user.email}!`);
            router.replace("/(tabs)");
          } else {
            const exists = await userService.userExists(email);
            if (exists) {
              Alert.alert("Ошибка", "Неверный пароль");
            } else {
              Alert.alert(
                "Ошибка",
                "Пользователь с таким email не найден. Сначала зарегистрируйтесь.",
              );
            }
          }
        } catch {
          // Ошибка при работе с локальным хранилищем
          Alert.alert("Ошибка", "Произошла ошибка при входе");
        }
      } else {
        // Любая другая ошибка (не связанная с axios)
        Alert.alert("Ошибка", "Произошла ошибка при входе");
      }
    } finally {
      // В любом случае разблокируем интерфейс
      setIsLoading(false);
    }
  };
  return (
    <LinearGradient colors={colors.background} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ padding: 20, flex: 1, justifyContent: "center" }}>
          {/* Логотип */}
          <View style={{ alignItems: "center", marginBottom: 40 }}>
            <Text
              style={{
                fontSize: 60,
                fontWeight: "200",
                color: colors.textPrimary,
                letterSpacing: 5,
              }}
            >
              SSRCH
            </Text>
            <Text
              style={{
                color: colors.textSecondary,
                fontSize: 14,
                letterSpacing: 2,
                marginTop: 5,
              }}
            >
              интеллектуальный подбор
            </Text>
          </View>

          <Text
            style={{
              color: colors.textPrimary,
              fontSize: 24,
              marginBottom: 30,
              textAlign: "center",
            }}
          >
            Вход в систему
          </Text>

          {/* Email */}
          <View style={{ marginBottom: 15 }}>
            <Text style={{ color: colors.textSecondary, marginBottom: 5 }}>
              Email
            </Text>
            <TextInput
              style={{
                backgroundColor: colors.inputBackground,
                color: colors.textPrimary,
                padding: 15,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: colors.inputBorder,
              }}
              value={email}
              onChangeText={setEmail}
              placeholder="name@mail.ru"
              placeholderTextColor={colors.inputPlaceholder}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!isLoading}
            />
          </View>

          {/* Пароль */}
          <View style={{ marginBottom: 25 }}>
            <Text style={{ color: colors.textSecondary, marginBottom: 5 }}>
              Пароль
            </Text>
            <TextInput
              style={{
                backgroundColor: colors.inputBackground,
                color: colors.textPrimary,
                padding: 15,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: colors.inputBorder,
              }}
              value={password}
              onChangeText={setPassword}
              placeholder="введите пароль"
              placeholderTextColor={colors.inputPlaceholder}
              secureTextEntry
              editable={!isLoading}
            />
          </View>

          {/* Кнопка входа */}
          <TouchableOpacity
            style={{
              backgroundColor: isLoading
                ? colors.textMuted
                : colors.accentButton,
              padding: 18,
              borderRadius: 8,
              alignItems: "center",
            }}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.accentButtonText} />
            ) : (
              <Text
                style={{
                  color: colors.accentButtonText,
                  fontSize: 16,
                  fontWeight: "600",
                }}
              >
                ВОЙТИ
              </Text>
            )}
          </TouchableOpacity>

          {/* Ссылка на регистрацию */}
          <TouchableOpacity
            style={{ marginTop: 20, alignItems: "center" }}
            onPress={() => router.push("/")}
            disabled={isLoading}
          >
            <Text style={{ color: colors.textSecondary }}>
              Нет аккаунта? Зарегистрироваться
            </Text>
          </TouchableOpacity>

          {/* Кнопка переключения темы */}
          <ThemeToggle />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
