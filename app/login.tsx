import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { users } from "../store/data"; // импортируем хранилище

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Одна функция для обоих файлов
  const validateEmail = (email: string) => {
    // Паттерн для проверки email (разрешает латиницу, цифры, точки, дефисы)
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  };
  const handleLogin = () => {
    // Проверка email через pattern
    if (!validateEmail(email)) {
      Alert.alert("Ошибка", "Введите корректный email (пример: name@mail.ru)");
      return;
    }

    if (!password) {
      Alert.alert("Ошибка", "Введите пароль");
      return;
    }
    // Проверяем, существует ли массив users и есть ли в нем пользователи
    if (!users || users.length === 0) {
      Alert.alert(
        "Ошибка",
        "Пользователь с такой почтой не найден. Сначала зарегистрируйтесь.",
      );
      return;
    }

    // Ищем пользователя
    const user = users.find((u) => u.email === email);

    if (!user) {
      Alert.alert("Ошибка", "Пользователь с таким email не найден");
      return;
    }

    // Проверяем пароль
    if (user.password !== password) {
      Alert.alert("Ошибка", "Неверный пароль");
      return;
    }

    // Все хорошо
    Alert.alert("Успех", `Добро пожаловать, ${user.email}!`);
    router.replace("/(tabs)");
  };

  return (
    <LinearGradient colors={["#2A2A2A", "#3A3A3A"]} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ padding: 20, flex: 1, justifyContent: "center" }}>
          {/* Логотип */}
          <View style={{ alignItems: "center", marginBottom: 40 }}>
            <Text
              style={{
                fontSize: 48,
                fontWeight: "200",
                color: "#FFFFFF",
                letterSpacing: 8,
                marginBottom: 20,
              }}
            >
              SSrch
            </Text>

            <Text
              style={{
                color: "#CCCCCC",
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
              color: "white",
              fontSize: 24,
              marginBottom: 30,
              textAlign: "center",
            }}
          >
            Вход в систему
          </Text>

          {/* Email */}
          <View style={{ marginBottom: 15 }}>
            <Text style={{ color: "#CCCCCC", marginBottom: 5 }}>Email</Text>
            <TextInput
              style={{
                backgroundColor: "#3A3A3A",
                color: "white",
                padding: 15,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: "#555",
              }}
              value={email}
              onChangeText={setEmail}
              placeholder="your@email.ru"
              placeholderTextColor="#666"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Пароль */}
          <View style={{ marginBottom: 25 }}>
            <Text style={{ color: "#CCCCCC", marginBottom: 5 }}>Пароль</Text>
            <TextInput
              style={{
                backgroundColor: "#3A3A3A",
                color: "white",
                padding: 15,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: "#555",
              }}
              value={password}
              onChangeText={setPassword}
              placeholder="введите пароль"
              placeholderTextColor="#666"
              secureTextEntry
            />
          </View>

          {/* Кнопка входа */}
          <TouchableOpacity
            style={{
              backgroundColor: "white",
              padding: 18,
              borderRadius: 8,
              alignItems: "center",
            }}
            onPress={handleLogin}
          >
            <Text style={{ color: "#2A2A2A", fontSize: 16, fontWeight: "600" }}>
              ВОЙТИ
            </Text>
          </TouchableOpacity>

          {/* Ссылка на регистрацию */}
          <TouchableOpacity
            style={{ marginTop: 20, alignItems: "center" }}
            onPress={() => router.push("/")}
          >
            <Text style={{ color: "#CCCCCC" }}>
              Нет аккаунта? Зарегистрироваться
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
