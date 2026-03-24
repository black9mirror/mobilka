import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFavorites } from "../../context/FavoritesContext";
import { useTheme } from "../../context/ThemeContext";

interface Vacancy {
  id: string;
  title: string;
  company: string;
  salary: string;
  city: string;
  experience: string;
  description: string;
  requirements: string[];
}

export default function FavoritesScreen() {
  const router = useRouter();
  const { colors } = useTheme(); // Получаем цвета из темы
  // Получаем данные и функции из глобального контекста избранного
  // favorites - массив сохраненных вакансий
  // removeFavorite - функция для удаления из избранного
  const { favorites, removeFavorite } = useFavorites();
  // Функция для отрисовки одного элемента списка избранных вакансий
  const renderItem = ({ item }: { item: Vacancy }) => (
    <View
      style={{
        backgroundColor: colors.card,
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: colors.cardBorder,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 5,
        }}
      >
        {/* Нажатие на название — переход в детали */}
        <TouchableOpacity
          style={{ flex: 1, marginRight: 10 }}
          onPress={() =>
            router.push({
              pathname: "/(tabs)/vacancyDetails",
              params: { vacancy: JSON.stringify(item) },
            })
          }
        >
          <Text
            style={{
              color: colors.textPrimary,
              fontSize: 18,
              fontWeight: "600",
            }}
          >
            {item.title}
          </Text>
        </TouchableOpacity>
        {/* Нажатие на сердечко — удалить из избранного */}
        <TouchableOpacity onPress={() => removeFavorite(item.id)}>
          <Text style={{ fontSize: 22 }}>❤️</Text>
        </TouchableOpacity>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 5,
        }}
      >
        <Text style={{ color: colors.textSecondary }}>{item.company}</Text>
        <Text style={{ color: colors.accent, fontWeight: "500" }}>
          {item.salary}
        </Text>
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={{ color: colors.textTertiary }}>🏢 {item.city}</Text>
        <Text style={{ color: colors.textTertiary }}>💼 {item.experience}</Text>
      </View>
    </View>
  );

  return (
    <LinearGradient colors={colors.background} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ padding: 20, flex: 1 }}>
          <Text
            style={{
              color: colors.textPrimary,
              fontSize: 28,
              fontWeight: "200",
              marginBottom: 20,
            }}
          >
            Избранное
          </Text>

          <Text style={{ color: colors.textSecondary, marginBottom: 10 }}>
            Сохранено вакансий: {favorites.length}
          </Text>

          <FlatList
            data={favorites}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <Text
                style={{
                  color: colors.textSecondary,
                  textAlign: "center",
                  marginTop: 50,
                }}
              >
                Вы ещё не добавили ни одной вакансии
              </Text>
            }
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
