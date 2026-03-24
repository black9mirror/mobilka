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
import { useTheme } from "../context/ThemeContext";

// Supabase
const SUPABASE_URL = "https://gyxcmonztjolowohiowa.supabase.co";
const SUPABASE_KEY = "sb_publishable_cDYOlpV0ItpmWyE6RttIEA_9Y_VSygI";
const SUPABASE_HEADERS = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  "Content-Type": "application/json",
};
export default function RegisterScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Валидация email
  const validateEmail = (email: string) => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  };
  // Валидация телефона
  const validatePhone = (phone: string) => {
    const phonePattern = /^\+\d{11}$/;
    return phonePattern.test(phone);
  };
  // Обработчик нажатия на кнопку регистрации
  const handleRegister = async () => {
    // Проверка email
    if (!validateEmail(email)) {
      Alert.alert("Ошибка", "Введите корректный email (пример: name@mail.ru)");
      return;
    }

    // Проверка телефона
    if (!validatePhone(phone)) {
      Alert.alert("Ошибка", "Введите номер в формате +79696452415");
      return;
    }

    // Проверка длины пароля
    if (password.length < 6) {
      Alert.alert("Ошибка", "Пароль должен быть не менее 6 символов");
      return;
    }

    // Проверка совпадения паролей
    if (password !== confirmPassword) {
      Alert.alert("Ошибка", "Пароли не совпадают");
      return;
    }

    setIsLoading(true); // Блокировка полей, пока заполняются данные

    try {
      // Пробуем сначала Supabase
      const checkResponse = await axios.get(
        `${SUPABASE_URL}/rest/v1/users?email=eq.${email}&select=email`,
        { headers: SUPABASE_HEADERS, timeout: 5000 },
      );
      // Если пользователь найден (массив не пустой)
      if (checkResponse.data.length > 0) {
        Alert.alert("Ошибка", "Пользователь с таким email уже существует");
        return;
      }
      // Для надежности проверяем и в локальном хранилище
      const localExists = await userService.userExists(email);
      if (localExists) {
        Alert.alert("Ошибка", "Пользователь с таким email уже существует");
        return;
      }
      // Отправляем POST-запрос для создания нового пользователя в Supabase
      await axios.post(
        `${SUPABASE_URL}/rest/v1/users`,
        { email, phone, password },
        { headers: { ...SUPABASE_HEADERS, Prefer: "return=minimal" } },
      );

      Alert.alert(
        "Успех",
        "Регистрация выполнена успешно. Теперь необходимо авторизоваться в аккаунт.",
      );
      router.push("/login");
    } catch (err) {
      console.warn("Supabase недоступен, используется локальное хранилище");
      try {
        // Проверяем существование пользователя в локальном хранилище
        const exists = await userService.userExists(email);
        if (exists) {
          Alert.alert("Ошибка", "Пользователь с таким email уже существует");
          return;
        }
        // Сохраняем пользователя в локальное хранилище
        const success = await userService.addUser({ email, phone, password });
        if (success) {
          Alert.alert(
            "Успех",
            "Регистрация выполнена успешно. Теперь необходимо авторизоваться в аккаунт.",
          );
          router.push("/login");
        } else {
          Alert.alert("Ошибка", "Не удалось зарегистрироваться");
        }
      } catch {
        Alert.alert("Ошибка", "Произошла ошибка при регистрации");
      }
    } finally {
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
            Регистрация
          </Text>

          {/* Email */}
          <View style={{ marginBottom: 15 }}>
            <Text style={{ color: colors.textSecondary, marginBottom: 5 }}>
              Email *
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

          {/* Телефон */}
          <View style={{ marginBottom: 15 }}>
            <Text style={{ color: colors.textSecondary, marginBottom: 5 }}>
              Телефон *
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
              value={phone}
              onChangeText={setPhone}
              placeholder="+79696452415"
              placeholderTextColor={colors.inputPlaceholder}
              keyboardType="phone-pad"
              editable={!isLoading}
            />
          </View>

          {/* Пароль */}
          <View style={{ marginBottom: 15 }}>
            <Text style={{ color: colors.textSecondary, marginBottom: 5 }}>
              Пароль *
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
              placeholder="минимум 6 символов"
              placeholderTextColor={colors.inputPlaceholder}
              secureTextEntry
              editable={!isLoading}
            />
          </View>

          {/* Подтверждение пароля */}
          <View style={{ marginBottom: 25 }}>
            <Text style={{ color: colors.textSecondary, marginBottom: 5 }}>
              Подтверждение пароля *
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
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="повторите пароль"
              placeholderTextColor={colors.inputPlaceholder}
              secureTextEntry
              editable={!isLoading}
            />
          </View>

          {/* Кнопка регистрации */}
          <TouchableOpacity
            style={{
              backgroundColor: isLoading
                ? colors.textMuted
                : colors.accentButton,
              padding: 18,
              borderRadius: 8,
              alignItems: "center",
            }}
            onPress={handleRegister}
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
                ЗАРЕГИСТРИРОВАТЬСЯ
              </Text>
            )}
          </TouchableOpacity>

          {/* Ссылка на вход */}
          <TouchableOpacity
            style={{ marginTop: 20, alignItems: "center" }}
            onPress={() => router.push("/login")}
            disabled={isLoading}
          >
            <Text style={{ color: colors.textSecondary }}>
              Уже есть аккаунт? Войти
            </Text>
          </TouchableOpacity>

          {/* Кнопка переключения темы */}
          <ThemeToggle />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
