import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthContext";

export default function ProfileScreen() {
  // Получаем данные и функции из контекста авторизации
  const { user, logout, updateProfile } = useAuth();
  const router = useRouter();

  // Локальные состояния формы — инициализируем из контекста
  // Используем ?? "", чтобы не передавать undefined в TextInput
  const [lastName, setLastName] = useState(user?.lastName ?? "");
  const [firstName, setFirstName] = useState(user?.firstName ?? "");
  const [patronymic, setPatronymic] = useState(user?.patronymic ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [birthDate, setBirthDate] = useState(user?.birthDate ?? "");
  // Валидация телефона
  const validatePhone = (value: string) => {
    return /^\+\d{11}$/.test(value);
  };
  // Валидация даты рождения
  const validateBirthDate = (value: string) => {
    if (!/^\d{2}\.\d{2}\.\d{4}$/.test(value)) return false;
    // Разбиваем строку на день, месяц, год
    const [day, month, year] = value.split(".").map(Number);

    // Проверка что месяц от 1 до 12
    if (month < 1 || month > 12) return false;
    // Проверка что год от 1900 до текущего
    if (year < 1900 || year > new Date().getFullYear()) return false;

    // Проверка что день существует в этом месяце (включая високосный год)
    const daysInMonth = new Date(year, month, 0).getDate();
    if (day < 1 || day > daysInMonth) return false;

    // Проверка что дата не в будущем
    const entered = new Date(year, month - 1, day);
    if (entered > new Date()) return false;

    return true;
  };
  // Функция сохранения изменений профиля
  const handleSave = () => {
    if (phone && !validatePhone(phone)) {
      Alert.alert("Ошибка", "Введите номер в формате +79696452415");
      return;
    }
    if (birthDate && !validateBirthDate(birthDate)) {
      Alert.alert(
        "Ошибка",
        "Введите дату в формате ДД.ММ.ГГГГ/Корректную дату по текущий день",
      );
      return;
    }

    updateProfile({ lastName, firstName, patronymic, phone, birthDate });
    Alert.alert("Успех", "Профиль обновлён");
  };
  // Функция выхода из аккаунта
  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <LinearGradient colors={["#2A2A2A", "#3A3A3A"]} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          <Text
            style={{
              color: "white",
              fontSize: 28,
              fontWeight: "200",
              marginBottom: 20,
            }}
          >
            Личный кабинет
          </Text>

          {/* Блок с email — только для чтения */}
          <View
            style={{
              backgroundColor: "#3A3A3A",
              padding: 15,
              borderRadius: 10,
              marginBottom: 20,
              borderWidth: 1,
              borderColor: "#555",
            }}
          >
            <Text style={{ color: "#999999", fontSize: 12, letterSpacing: 1 }}>
              Текущий пользователь
            </Text>
            <Text style={{ color: "white", fontSize: 16, marginTop: 8 }}>
              {user?.email ?? "—"}
            </Text>
          </View>

          {/* Форма редактирования */}
          <Text
            style={{
              color: "#999999",
              fontSize: 12,
              letterSpacing: 1,
              marginBottom: 15,
            }}
          >
            ЛИЧНЫЕ ДАННЫЕ
          </Text>

          {/* Фамилия */}
          <View style={{ marginBottom: 12 }}>
            <Text style={{ color: "#CCCCCC", marginBottom: 5 }}>Фамилия</Text>
            <TextInput
              style={{
                backgroundColor: "#3A3A3A",
                color: "white",
                padding: 15,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: "#555",
              }}
              value={lastName}
              onChangeText={setLastName}
              placeholder="Иванов"
              placeholderTextColor="#666"
            />
          </View>

          {/* Имя */}
          <View style={{ marginBottom: 12 }}>
            <Text style={{ color: "#CCCCCC", marginBottom: 5 }}>Имя</Text>
            <TextInput
              style={{
                backgroundColor: "#3A3A3A",
                color: "white",
                padding: 15,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: "#555",
              }}
              value={firstName}
              onChangeText={setFirstName}
              placeholder="Иван"
              placeholderTextColor="#666"
            />
          </View>

          {/* Отчество */}
          <View style={{ marginBottom: 12 }}>
            <Text style={{ color: "#CCCCCC", marginBottom: 5 }}>Отчество</Text>
            <TextInput
              style={{
                backgroundColor: "#3A3A3A",
                color: "white",
                padding: 15,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: "#555",
              }}
              value={patronymic}
              onChangeText={setPatronymic}
              placeholder="Иванович"
              placeholderTextColor="#666"
            />
          </View>

          {/* Телефон */}
          <View style={{ marginBottom: 12 }}>
            <Text style={{ color: "#CCCCCC", marginBottom: 5 }}>Телефон</Text>
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
              placeholder="+79696452415"
              placeholderTextColor="#666"
              keyboardType="phone-pad"
            />
          </View>

          {/* Дата рождения */}
          <View style={{ marginBottom: 25 }}>
            <Text style={{ color: "#CCCCCC", marginBottom: 5 }}>
              Дата рождения
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
              value={birthDate}
              onChangeText={setBirthDate}
              placeholder="ДД.ММ.ГГГГ"
              placeholderTextColor="#666"
              keyboardType="numeric"
            />
          </View>

          {/* Кнопка сохранить */}
          <TouchableOpacity
            style={{
              backgroundColor: "white",
              padding: 18,
              borderRadius: 8,
              alignItems: "center",
              marginBottom: 12,
            }}
            onPress={handleSave}
          >
            <Text style={{ color: "#2A2A2A", fontSize: 16, fontWeight: "600" }}>
              СОХРАНИТЬ
            </Text>
          </TouchableOpacity>

          {/* Кнопка выйти */}
          <TouchableOpacity
            style={{
              backgroundColor: "#3A3A3A",
              padding: 18,
              borderRadius: 8,
              alignItems: "center",
              borderWidth: 1,
              borderColor: "#555",
              marginBottom: 30,
            }}
            onPress={handleLogout}
          >
            <Text style={{ color: "#CCCCCC", fontSize: 16, fontWeight: "600" }}>
              ВЫЙТИ
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
