import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { users } from "../store/data"; // импортируем хранилище

export default function RegisterScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Валидация email
  const validateEmail = (email: string) => {
    // Паттерн для проверки email (разрешает латиницу, цифры, точки, дефисы)
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  };

  // Валидация телефона
  const validatePhone = (phone: string) => {
    // Проверяем, что номер начинается с + и содержит только цифры после (ровно 11 цифр для РФ)
    const phonePattern = /^\+\d{11}$/;
    return phonePattern.test(phone);
  };

  const handleRegister = () => {
    // Проверка email
    if (!validateEmail(email)) {
      Alert.alert("Ошибка", "Введите корректный email (пример: name@mail.ru");
      return;
    }

    // Проверка телефона
    if (!validatePhone(phone)) {
      Alert.alert("Ошибка", "Введите номер в формате +79696452415");
      return;
    }

    // Проверка пароля
    if (password.length < 6) {
      Alert.alert("Ошибка", "Пароль должен быть не менее 6 символов");
      return;
    }

    // Проверка совпадения паролей
    if (password !== confirmPassword) {
      Alert.alert("Ошибка", "Пароли не совпадают");
      return;
    }
    // Проверяем, что users существует
    if (!users) {
      Alert.alert("Ошибка", "Ошибка инициализации данных");
      return;
    }
    // Проверка на существование пользователя с такой же почтой
    const userExists = users.some((user) => user.email === email);
    if (userExists) {
      Alert.alert("Ошибка", "Пользователь с таким email уже существует");
      return;
    }
    // Сохраняем пользователя
    users.push({
      email: email,
      phone: phone,
      password: password,
    });

    // Если все успешно - переходим на авторизацию
    Alert.alert(
      "Успех",
      "Регистрация выполнена успешно. Теперь необходимо авторизоваться в аккаунт.",
    );
    router.push("/login");
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
            Регистрация
          </Text>

          {/* Email */}
          <View style={{ marginBottom: 15 }}>
            <Text style={{ color: "#CCCCCC", marginBottom: 5 }}>Email *</Text>
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

          {/* Телефон */}
          <View style={{ marginBottom: 15 }}>
            <Text style={{ color: "#CCCCCC", marginBottom: 5 }}>Телефон *</Text>
            <TextInput
              style={{
                backgroundColor: "#3A3A3A",
                color: "white",
                padding: 15,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: "#555",
              }}
              value={phone}
              onChangeText={setPhone}
              placeholder="+79991234567"
              placeholderTextColor="#666"
              keyboardType="phone-pad"
            />
          </View>

          {/* Пароль */}
          <View style={{ marginBottom: 15 }}>
            <Text style={{ color: "#CCCCCC", marginBottom: 5 }}>Пароль *</Text>
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
              placeholder="минимум 6 символов"
              placeholderTextColor="#666"
              secureTextEntry
            />
          </View>

          {/* Подтверждение пароля */}
          <View style={{ marginBottom: 25 }}>
            <Text style={{ color: "#CCCCCC", marginBottom: 5 }}>
              Подтверждение пароля *
            </Text>
            <TextInput
              style={{
                backgroundColor: "#3A3A3A",
                color: "white",
                padding: 15,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: "#555",
              }}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="повторите пароль"
              placeholderTextColor="#666"
              secureTextEntry
            />
          </View>

          {/* Кнопка регистрации */}
          <TouchableOpacity
            style={{
              backgroundColor: "white",
              padding: 18,
              borderRadius: 8,
              alignItems: "center",
            }}
            onPress={handleRegister}
          >
            <Text style={{ color: "#2A2A2A", fontSize: 16, fontWeight: "600" }}>
              ЗАРЕГИСТРИРОВАТЬСЯ
            </Text>
          </TouchableOpacity>

          {/* Ссылка на вход */}
          <TouchableOpacity
            style={{ marginTop: 20, alignItems: "center" }}
            onPress={() => router.push("/login")}
          >
            <Text style={{ color: "#CCCCCC" }}>Уже есть аккаунт? Войти</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
