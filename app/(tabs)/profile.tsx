import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ThemeToggle from "../../components/ThemeToggle";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
// Ключ для хранения всех профилей пользователей
const PROFILES_STORAGE_KEY = "@SSrch_all_profiles";

// Интерфейс данных профиля
interface ProfileData {
  lastName?: string;
  firstName?: string;
  patronymic?: string;
  phone?: string;
  birthDate?: string;
  avatar?: string | null; // base64 или uri аватара
}

export default function ProfileScreen() {
  // Получаем данные и функции из контекста авторизации
  const { user, logout, updateProfile } = useAuth();
  const router = useRouter();
  const { colors } = useTheme(); // Получаем цвета из темы

  // Состояние загрузки
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSendingTestNotification, setIsSendingTestNotification] =
    useState(false);

  // Локальные состояния формы
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [patronymic, setPatronymic] = useState("");
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);

  // Загрузка сохраненного профиля при первом открытии или смене пользователя
  useEffect(() => {
    loadProfileFromStorage();
  }, [user?.email]);

  // Функция загрузки профиля конкретного пользователя из AsyncStorage
  const loadProfileFromStorage = async () => {
    if (!user?.email) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);

      const storedProfiles = await AsyncStorage.getItem(PROFILES_STORAGE_KEY);
      const allProfiles: Record<string, ProfileData> = storedProfiles
        ? JSON.parse(storedProfiles)
        : {};

      const userProfile = allProfiles[user.email] || {};

      setLastName(userProfile.lastName ?? user?.lastName ?? "");
      setFirstName(userProfile.firstName ?? user?.firstName ?? "");
      setPatronymic(userProfile.patronymic ?? user?.patronymic ?? "");
      setPhone(userProfile.phone ?? user?.phone ?? "");
      setBirthDate(userProfile.birthDate ?? user?.birthDate ?? "");
      setAvatar(userProfile.avatar ?? null);
    } catch (error) {
      console.error("Ошибка загрузки профиля:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Функция сохранения профиля конкретного пользователя в AsyncStorage
  const saveProfileToStorage = async (profileData: ProfileData) => {
    if (!user?.email) return false;

    try {
      const storedProfiles = await AsyncStorage.getItem(PROFILES_STORAGE_KEY);
      const allProfiles: Record<string, ProfileData> = storedProfiles
        ? JSON.parse(storedProfiles)
        : {};

      allProfiles[user.email] = {
        ...allProfiles[user.email],
        ...profileData,
      };

      await AsyncStorage.setItem(
        PROFILES_STORAGE_KEY,
        JSON.stringify(allProfiles),
      );
      return true;
    } catch (error) {
      console.error("Ошибка сохранения профиля:", error);
      return false;
    }
  };

  // Функция выбора аватара из галереи
  const pickImage = async () => {
    // Запрашиваем разрешение на доступ к галерее
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Нет доступа",
        "Для загрузки аватара необходимо разрешить доступ к галерее",
      );
      return;
    }

    // Открываем галерею
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true, // Разрешаем обрезку
      aspect: [1, 1], // Квадратная обрезка
      quality: 0.5, // Качество 50%
      base64: true, // Получаем base64 для хранения
    });

    if (!result.canceled) {
      // Получаем выбранное изображение
      const asset = result.assets[0];
      setAvatar(asset.uri); // сохраняем URI
    }
  };
  // Функция отправки тестового уведомления
  const sendTestNotification = async () => {
    setIsSendingTestNotification(true);
    try {
      // Проверяем разрешение
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Нет разрешения",
          "Для отправки уведомлений необходимо разрешить доступ",
        );
        return;
      }

      // Отправляем тестовое уведомление
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "🔔 Тестовое уведомление",
          body: `Привет, ${firstName || user?.email}! Это тестовое уведомление от SSRCH.`,
          sound: true,
        },
        trigger: null, // null = отправить сразу
      });

      Alert.alert("Успех", "Тестовое уведомление отправлено!");
    } catch (error) {
      console.error("Ошибка отправки уведомления:", error);
      Alert.alert("Ошибка", "Не удалось отправить уведомление");
    } finally {
      setIsSendingTestNotification(false);
    }
  };
  // Функция сохранения изменений профиля
  const handleSave = async () => {
    if (phone && !/^\+\d{11}$/.test(phone)) {
      Alert.alert("Ошибка", "Введите номер в формате +79696452415");
      return;
    }

    if (birthDate) {
      const validateBirthDate = (value: string) => {
        if (!/^\d{2}\.\d{2}\.\d{4}$/.test(value)) return false;
        const [day, month, year] = value.split(".").map(Number);
        if (month < 1 || month > 12) return false;
        if (year < 1900 || year > new Date().getFullYear()) return false;
        const daysInMonth = new Date(year, month, 0).getDate();
        if (day < 1 || day > daysInMonth) return false;
        const entered = new Date(year, month - 1, day);
        if (entered > new Date()) return false;
        return true;
      };

      if (!validateBirthDate(birthDate)) {
        Alert.alert(
          "Ошибка",
          "Введите дату в формате ДД.ММ.ГГГГ / Корректную дату по текущий день",
        );
        return;
      }
    }

    setIsSaving(true);

    const profileData = {
      lastName,
      firstName,
      patronymic,
      phone,
      birthDate,
      avatar,
    };

    const success = await saveProfileToStorage(profileData);

    if (success) {
      updateProfile(profileData);
      Alert.alert("Успех", "Профиль обновлён");
    } else {
      Alert.alert("Ошибка", "Не удалось сохранить профиль");
    }

    setIsSaving(false);
  };

  // Функция выхода из аккаунта
  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  // Показываем индикатор загрузки
  if (isLoading) {
    return (
      <LinearGradient colors={colors.background} style={{ flex: 1 }}>
        <SafeAreaView
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color={colors.textPrimary} />
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={colors.background} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          <Text
            style={{
              color: colors.textPrimary,
              fontSize: 28,
              fontWeight: "200",
              marginBottom: 20,
            }}
          >
            Личный кабинет
          </Text>

          {/* Аватар */}
          <View style={{ alignItems: "center", marginBottom: 20 }}>
            <TouchableOpacity onPress={pickImage}>
              {avatar ? (
                <Image
                  source={{ uri: avatar }}
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 50,
                    backgroundColor: colors.card,
                  }}
                />
              ) : (
                <View
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 50,
                    backgroundColor: colors.card,
                    justifyContent: "center",
                    alignItems: "center",
                    borderWidth: 1,
                    borderColor: colors.cardBorder,
                  }}
                >
                  <Text style={{ fontSize: 40, color: colors.textMuted }}>
                    📷
                  </Text>
                </View>
              )}
            </TouchableOpacity>
            <Text
              style={{
                color: colors.textSecondary,
                fontSize: 12,
                marginTop: 8,
              }}
            >
              Нажмите, чтобы загрузить фото
            </Text>
          </View>

          {/* Блок с email — только для чтения */}
          <View
            style={{
              backgroundColor: colors.card,
              padding: 15,
              borderRadius: 10,
              marginBottom: 20,
              borderWidth: 1,
              borderColor: colors.cardBorder,
            }}
          >
            <Text
              style={{
                color: colors.textTertiary,
                fontSize: 12,
                letterSpacing: 1,
              }}
            >
              Текущий пользователь
            </Text>
            <Text
              style={{ color: colors.textPrimary, fontSize: 16, marginTop: 8 }}
            >
              {user?.email ?? "—"}
            </Text>
          </View>

          {/* Блок с телефоном из регистрации */}
          <View
            style={{
              backgroundColor: colors.card,
              padding: 15,
              borderRadius: 10,
              marginBottom: 20,
              borderWidth: 1,
              borderColor: colors.cardBorder,
            }}
          >
            <Text
              style={{
                color: colors.textTertiary,
                fontSize: 12,
                letterSpacing: 1,
              }}
            >
              Телефон при регистрации
            </Text>
            <Text
              style={{ color: colors.textPrimary, fontSize: 16, marginTop: 8 }}
            >
              {user?.phone ?? "—"}
            </Text>
          </View>

          {/* Форма редактирования */}
          <Text
            style={{
              color: colors.textTertiary,
              fontSize: 12,
              letterSpacing: 1,
              marginBottom: 15,
              marginTop: 10,
            }}
          >
            ЛИЧНЫЕ ДАННЫЕ
          </Text>

          {/* Фамилия */}
          <View style={{ marginBottom: 12 }}>
            <Text style={{ color: colors.textSecondary, marginBottom: 5 }}>
              Фамилия
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
              value={lastName}
              onChangeText={setLastName}
              placeholder="Иванов"
              placeholderTextColor={colors.inputPlaceholder}
            />
          </View>

          {/* Имя */}
          <View style={{ marginBottom: 12 }}>
            <Text style={{ color: colors.textSecondary, marginBottom: 5 }}>
              Имя
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
              value={firstName}
              onChangeText={setFirstName}
              placeholder="Иван"
              placeholderTextColor={colors.inputPlaceholder}
            />
          </View>

          {/* Отчество */}
          <View style={{ marginBottom: 12 }}>
            <Text style={{ color: colors.textSecondary, marginBottom: 5 }}>
              Отчество
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
              value={patronymic}
              onChangeText={setPatronymic}
              placeholder="Иванович"
              placeholderTextColor={colors.inputPlaceholder}
            />
          </View>

          {/* Дополнительный телефон */}
          <View style={{ marginBottom: 12 }}>
            <Text style={{ color: colors.textSecondary, marginBottom: 5 }}>
              Дополнительный телефон
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
            />
          </View>

          {/* Дата рождения */}
          <View style={{ marginBottom: 25 }}>
            <Text style={{ color: colors.textSecondary, marginBottom: 5 }}>
              Дата рождения
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
              value={birthDate}
              onChangeText={setBirthDate}
              placeholder="ДД.ММ.ГГГГ"
              placeholderTextColor={colors.inputPlaceholder}
              keyboardType="numeric"
            />
          </View>

          {/* Кнопка сохранить */}
          <TouchableOpacity
            style={{
              backgroundColor: isSaving
                ? colors.textMuted
                : colors.accentButton,
              padding: 18,
              borderRadius: 8,
              alignItems: "center",
              marginBottom: 12,
            }}
            onPress={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator color={colors.accentButtonText} />
            ) : (
              <Text
                style={{
                  color: colors.accentButtonText,
                  fontSize: 16,
                  fontWeight: "600",
                }}
              >
                СОХРАНИТЬ
              </Text>
            )}
          </TouchableOpacity>

          {/* Кнопка тестового уведомления */}
          <TouchableOpacity
            style={{
              backgroundColor: isSendingTestNotification
                ? colors.textMuted
                : colors.accent,
              padding: 18,
              borderRadius: 8,
              alignItems: "center",
              marginBottom: 12,
            }}
            onPress={sendTestNotification}
            disabled={isSendingTestNotification}
          >
            {isSendingTestNotification ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={{ color: "white", fontSize: 16, fontWeight: "600" }}>
                Отправить тестовое уведомление
              </Text>
            )}
          </TouchableOpacity>

          {/* Кнопка переключения темы */}
          <ThemeToggle />

          {/* Кнопка выйти */}
          <TouchableOpacity
            style={{
              backgroundColor: colors.card,
              padding: 18,
              borderRadius: 8,
              alignItems: "center",
              borderWidth: 1,
              borderColor: colors.cardBorder,
              marginTop: 12,
              marginBottom: 30,
            }}
            onPress={handleLogout}
          >
            <Text
              style={{
                color: colors.textSecondary,
                fontSize: 16,
                fontWeight: "600",
              }}
            >
              ВЫЙТИ
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
