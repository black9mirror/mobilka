import * as Notifications from "expo-notifications";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Platform } from "react-native";
import { AuthProvider } from "../context/AuthContext";
import { FavoritesProvider } from "../context/FavoritesContext";
import { ThemeProvider, useTheme } from "../context/ThemeContext";

// Настройка обработчика уведомлений
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true, // Показывать ли уведомление как всплывающее окно
    shouldPlaySound: true, // Проигрывать ли звук при получении
    shouldSetBadge: false, // Обновлять ли счетчик (бейдж) на иконке приложения
    shouldShowBanner: true, // Показывать ли баннер в шторке уведомлений
    shouldShowList: false, // Показывать ли в списке уведомлений (в центре уведомлений)
  }),
});

// Внутренний компонент для настройки StatusBar (меняет цвет иконок в зависимости от темы)
function StatusBarHandler() {
  const { theme } = useTheme();
  return <StatusBar style={theme === "dark" ? "light" : "dark"} />;
}

export default function RootLayout() {
  useEffect(() => {
    // Запрос разрешения на уведомления
    const requestPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        console.log("Разрешение на уведомления не получено");
        return;
      }

      // Запускаем планирование уведомлений
      await scheduleReminderNotifications();
    };

    // Функция планирования периодических уведомлений
    const scheduleReminderNotifications = async () => {
      // Отменяем все существующие уведомления
      await Notifications.cancelAllScheduledNotificationsAsync();

      // Планируем уведомление каждые 2 минуты (120 секунд)
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "🔍 Новые вакансии!",
          body: "Загляните в приложение - возможно, появились подходящие вакансии!",
          sound: true,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: 120,
          repeats: true,
        },
      });

      console.log("Уведомления запланированы каждые 2 минуты");
    };

    // Настройка канала для Android
    const setupAndroidChannel = async () => {
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("reminders", {
          name: "Напоминания о вакансиях",
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
        });
      }
    };

    // Инициализация уведомлений
    const initNotifications = async () => {
      await setupAndroidChannel();
      await requestPermissions();

      const scheduleIfGranted = async () => {
        const { status } = await Notifications.getPermissionsAsync();
        if (status === "granted") {
          await scheduleReminderNotifications();
        }
      };
      scheduleIfGranted();
    };

    initNotifications();

    // Подписка на получение уведомлений
    const notificationSubscription =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log("Уведомление получено:", notification);
      });

    // Подписка на нажатие уведомления
    const responseSubscription =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("Нажато на уведомление:", response);
      });

    // Очистка подписок
    return () => {
      notificationSubscription.remove();
      responseSubscription.remove();
    };
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <FavoritesProvider>
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
          <StatusBarHandler />
        </FavoritesProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
