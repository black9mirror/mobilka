import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFavorites } from "../../context/FavoritesContext";
import { useTheme } from "../../context/ThemeContext";

export default function VacancyDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { colors } = useTheme(); // Получаем цвета из темы
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  // Получаем данные вакансии из параметров
  const vacancy = params.vacancy ? JSON.parse(params.vacancy as string) : null;

  if (!vacancy) {
    return (
      <LinearGradient colors={colors.background} style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1 }}>
          <View style={{ padding: 20 }}>
            <Text style={{ color: colors.textPrimary }}>
              Вакансия не найдена
            </Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }
  const favorited = isFavorite(vacancy.id);
  const handleFavoriteToggle = () => {
    favorited ? removeFavorite(vacancy.id) : addFavorite(vacancy);
  };
  return (
    <LinearGradient colors={colors.background} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
          {/* Кнопка назад */}
          <TouchableOpacity
            style={{ marginBottom: 20 }}
            onPress={() => router.push("/(tabs)/vacancies")}
          >
            <Text style={{ color: colors.textSecondary, fontSize: 16 }}>
              ← Назад к списку
            </Text>
          </TouchableOpacity>

          {/* Заголовок + сердечко */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 10,
            }}
          >
            <Text
              style={{
                color: colors.textPrimary,
                fontSize: 28,
                fontWeight: "bold",
                flex: 1,
                marginRight: 10,
              }}
            >
              {vacancy.title}
            </Text>
            <TouchableOpacity onPress={handleFavoriteToggle}>
              <Text style={{ fontSize: 28 }}>{favorited ? "❤️" : "🤍"}</Text>
            </TouchableOpacity>
          </View>

          {/* Компания */}
          <Text
            style={{
              color: colors.textSecondary,
              fontSize: 20,
              marginBottom: 15,
            }}
          >
            {vacancy.company}
          </Text>

          {/* Основная информация */}
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
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              <Text style={{ color: colors.textSecondary }}>
                💰 Заработная плата:
              </Text>
              <Text style={{ color: colors.accent, fontWeight: "500" }}>
                {vacancy.salary}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              <Text style={{ color: colors.textSecondary }}>🏢 Город:</Text>
              <Text style={{ color: colors.textPrimary }}>{vacancy.city}</Text>
            </View>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={{ color: colors.textSecondary }}>
                💼 Требования к опыту:
              </Text>
              <Text style={{ color: colors.textPrimary }}>
                {vacancy.experience}
              </Text>
            </View>
          </View>

          {/* Описание */}
          <View style={{ marginBottom: 20 }}>
            <Text
              style={{
                color: colors.textPrimary,
                fontSize: 18,
                fontWeight: "600",
                marginBottom: 10,
              }}
            >
              Описание вакансии
            </Text>
            <Text style={{ color: colors.textSecondary, lineHeight: 22 }}>
              {vacancy.description}
            </Text>
          </View>

          {/* Требования */}
          <View style={{ marginBottom: 30 }}>
            <Text
              style={{
                color: colors.textPrimary,
                fontSize: 18,
                fontWeight: "600",
                marginBottom: 10,
              }}
            >
              Требования
            </Text>
            {vacancy.requirements.map((req: string, index: number) => (
              <View
                key={index}
                style={{ flexDirection: "row", marginBottom: 8 }}
              >
                <Text style={{ color: colors.accent, marginRight: 10 }}>•</Text>
                <Text style={{ color: colors.textSecondary, flex: 1 }}>
                  {req}
                </Text>
              </View>
            ))}
          </View>

          {/* Кнопка отклика */}
          <TouchableOpacity
            style={{
              backgroundColor: colors.accentButton,
              padding: 18,
              borderRadius: 8,
              alignItems: "center",
              marginBottom: 30,
            }}
            onPress={() => alert("Отклик отправлен!")}
          >
            <Text
              style={{
                color: colors.accentButtonText,
                fontSize: 16,
                fontWeight: "600",
              }}
            >
              ОТКЛИКНУТЬСЯ
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
